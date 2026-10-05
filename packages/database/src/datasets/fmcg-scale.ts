// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PoolClient } from "pg";
import {
  resolveInspectionPlan,
  SEED_SAMPLING_STANDARD
} from "./helpers/inspection.ts";
import { quote } from "./sql.ts";

export type FmcgScaleOptions = {
  companyId: string;
  userId: string;
  plantId?: string;
};

/** Local synthetic-data extension. The caller owns the surrounding transaction.
 * No authentication accounts, invitations, passwords or permission grants are created.
 * Existing posted documents are not copied or edited.
 */
export async function applyFmcgScale(
  client: PoolClient,
  options: FmcgScaleOptions
) {
  const { companyId, userId } = options;
  const first = await client.query<{ id: string }>(
    `SELECT id FROM location WHERE "companyId"=$1 AND id=COALESCE($2,
      (SELECT "locationId" FROM job WHERE "companyId"=$1 ORDER BY "createdAt",id LIMIT 1))`,
    [companyId, options.plantId ?? null]
  );
  const plantId = first.rows[0]?.id;
  if (!plantId)
    throw new Error("FMCG scale requires the dataset's manufacturing plant");
  const prior = await client.query<{ count: string }>(
    `SELECT count(*) FROM "employeeJob" WHERE "companyId"=$1 AND tags @> ARRAY['FMCG-SYNTHETIC-WORKER']`,
    [companyId]
  );
  if (Number(prior.rows[0]?.count) !== 0)
    throw new Error(
      "FMCG workers already exist; use a fresh synthetic company"
    );

  await client.query(
    `CREATE TEMP TABLE fmcg_scale_plants (n int PRIMARY KEY,id text NOT NULL,name text NOT NULL,family text NOT NULL) ON COMMIT DROP`
  );
  await client.query(
    `INSERT INTO fmcg_scale_plants VALUES
    (1,$1,'Nhà máy Đồ uống Bình Dương','BEV'),
    (2,id('loc'),'Nhà máy Thực phẩm Đồng Nai','FOOD'),
    (3,id('loc'),'Nhà máy Chăm sóc cá nhân Long An','CARE')`,
    [plantId]
  );
  await client.query(
    `INSERT INTO location (id,name,code,"companyId","createdBy",timezone,"countryCode",city,"addressLine1","stateProvince","postalCode")
    SELECT id,name,'FMCG-' || family,$1,$2,'Asia/Ho_Chi_Minh','VN',CASE n WHEN 2 THEN 'Đồng Nai' ELSE 'Long An' END,
      'Địa chỉ nhà máy giả lập FMCG',CASE n WHEN 2 THEN 'Đồng Nai' ELSE 'Long An' END,'000000'
    FROM fmcg_scale_plants WHERE n>1`,
    [companyId, userId]
  );
  await client.query(
    `UPDATE location SET name=p.name,code='FMCG-' || p.family,timezone='Asia/Ho_Chi_Minh',"countryCode"='VN'
    FROM fmcg_scale_plants p WHERE location.id=p.id AND location."companyId"=$1 AND p.n=1`,
    [companyId]
  );

  // Allocate every destination ID first, so self-referencing shelves can be copied
  // without topological row-by-row queries or disabling their FK constraints.
  await client.query(
    `CREATE TEMP TABLE fmcg_scale_map (kind text,n int,old_id text,new_id text,PRIMARY KEY(kind,n,old_id)) ON COMMIT DROP`
  );
  const metadata = await client.query<{
    table_name: string;
    column_name: string;
  }>(
    `SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='public'
      AND table_name=ANY($1::text[]) AND is_generated='NEVER' ORDER BY table_name,ordinal_position`,
    [
      [
        "shift",
        "warehouse",
        "workCenter",
        "storageUnit",
        "workCenterProcess",
        "workCenterShift",
        "itemPlanning",
        "pickMethod"
      ]
    ]
  );
  const columns = new Map<string, string[]>();
  for (const row of metadata.rows)
    columns.set(row.table_name, [
      ...(columns.get(row.table_name) ?? []),
      row.column_name
    ]);
  const remaps: Record<string, string> = {
    warehouseId: "warehouse",
    workCenterId: "workCenter",
    parentId: "storageUnit",
    shiftId: "shift",
    defaultStorageUnitId: "storageUnit"
  };
  const tables = ["shift", "warehouse", "workCenter", "storageUnit"];
  for (const table of tables) {
    await client.query(
      `INSERT INTO fmcg_scale_map SELECT $3,p.n,s.id,id() FROM ${quote(table)} s
      CROSS JOIN fmcg_scale_plants p WHERE s."companyId"=$1 AND s."locationId"=$2 AND p.n>1`,
      [companyId, plantId, table]
    );
  }
  for (const table of tables) {
    const cols = columns.get(table);
    if (!cols?.length) throw new Error(`Missing scale table ${table}`);
    const expressions = cols.map((column) => {
      if (column === "id") return "m.new_id";
      if (column === "locationId") return "p.id";
      if (column === "name") return "s.name || ' — ' || p.family";
      if (column === "code")
        return "CASE WHEN s.code IS NULL THEN NULL ELSE s.code || '-' || p.family END";
      if (column === "createdBy") return "$3";
      if (column === "createdAt") return "now()";
      if (column === "updatedBy" || column === "updatedAt") return "NULL";
      const kind = remaps[column];
      return kind
        ? `(SELECT new_id FROM fmcg_scale_map WHERE kind='${kind}' AND n=p.n AND old_id=s.${quote(column)})`
        : `s.${quote(column)}`;
    });
    await client.query(
      `INSERT INTO ${quote(table)} (${cols.map(quote).join(",")}) SELECT ${expressions.join(",")}
      FROM ${quote(table)} s JOIN fmcg_scale_map m ON m.old_id=s.id AND m.kind=$4
      JOIN fmcg_scale_plants p ON p.n=m.n WHERE s."companyId"=$1 AND s."locationId"=$2`,
      [companyId, plantId, userId, table]
    );
  }
  await client.query(
    `INSERT INTO "workCenterProcess" ("workCenterId","processId","companyId","createdBy")
    SELECT m.new_id,w."processId",$1,$2 FROM "workCenterProcess" w
    JOIN fmcg_scale_map m ON m.kind='workCenter' AND m.old_id=w."workCenterId" WHERE w."companyId"=$1`,
    [companyId, userId]
  );
  await client.query(
    `INSERT INTO "workCenterShift" ("workCenterId","shiftId","companyId","createdBy")
    SELECT w.new_id,s.new_id,$1,$2 FROM "workCenterShift" source
    JOIN fmcg_scale_map w ON w.kind='workCenter' AND w.old_id=source."workCenterId"
    JOIN fmcg_scale_map s ON s.kind='shift' AND s.old_id=source."shiftId" AND s.n=w.n WHERE source."companyId"=$1`,
    [companyId, userId]
  );
  for (const table of ["itemPlanning", "pickMethod"]) {
    const cols = columns.get(table);
    if (!cols?.length) throw new Error(`Missing planning table ${table}`);
    const expr = cols.map((column) =>
      column === "locationId"
        ? "p.id"
        : column === "createdBy"
          ? "$3"
          : column === "createdAt"
            ? "now()"
            : remaps[column]
              ? `(SELECT new_id FROM fmcg_scale_map WHERE kind='${remaps[column]}' AND n=p.n AND old_id=s.${quote(column)})`
              : `s.${quote(column)}`
    );
    await client.query(
      `INSERT INTO ${quote(table)} (${cols.map(quote).join(",")}) SELECT ${expr.join(",")}
      FROM ${quote(table)} s CROSS JOIN fmcg_scale_plants p WHERE s."companyId"=$1 AND s."locationId"=$2 AND p.n>1
      ON CONFLICT ("itemId","locationId") DO UPDATE SET ${cols
        .filter(
          (column) => !["itemId", "locationId", "companyId"].includes(column)
        )
        .map((column) => `${quote(column)}=EXCLUDED.${quote(column)}`)
        .join(",")}`,
      [companyId, plantId, userId]
    );
  }

  await client.query(
    `CREATE TEMP TABLE fmcg_scale_jobs ON COMMIT DROP AS
    SELECT j.id,p.n,p.id AS location_id FROM job j JOIN item i ON i.id=j."itemId" AND i."companyId"=j."companyId"
    JOIN fmcg_scale_plants p ON i."readableId" LIKE '%-' || p.family || '-%'
    WHERE j."companyId"=$1`,
    [companyId]
  );
  await client.query(
    `UPDATE job j SET "locationId"=m.location_id,"storageUnitId"=CASE WHEN m.n=1 THEN j."storageUnitId" ELSE
    (SELECT new_id FROM fmcg_scale_map WHERE kind='storageUnit' AND n=m.n AND old_id=j."storageUnitId") END
    FROM fmcg_scale_jobs m WHERE j.id=m.id AND j."companyId"=$1`,
    [companyId]
  );
  await client.query(
    `UPDATE "jobOperation" o SET "workCenterId"=m.new_id FROM fmcg_scale_jobs j,fmcg_scale_map m
    WHERE o."jobId"=j.id AND o."companyId"=$1 AND m.kind='workCenter' AND m.n=j.n AND m.old_id=o."workCenterId"`,
    [companyId]
  );
  await client.query(
    `UPDATE "methodOperation" o SET "workCenterId"=m.new_id
      FROM "makeMethod" method,item i,fmcg_scale_plants p,fmcg_scale_map m
      WHERE o."makeMethodId"=method.id AND method."itemId"=i.id
        AND o."companyId"=$1 AND method."companyId"=$1 AND i."companyId"=$1
        AND i."readableId" LIKE '%-' || p.family || '-%'
        AND m.kind='workCenter' AND m.n=p.n AND m.old_id=o."workCenterId"`,
    [companyId]
  );
  await client.query(
    `UPDATE "productionEvent" e SET "workCenterId"=o."workCenterId"
    FROM "jobOperation" o WHERE e."jobOperationId"=o.id AND e."companyId"=$1 AND o."companyId"=$1 AND NOT e."postedToGL"`,
    [companyId]
  );
  await client.query(
    `UPDATE "jobMaterial" material SET "storageUnitId"=m.new_id
      FROM fmcg_scale_jobs j,fmcg_scale_map m WHERE material."jobId"=j.id AND material."companyId"=$1
      AND material."quantityIssued"=0 AND m.kind='storageUnit' AND m.n=j.n AND m.old_id=material."storageUnitId"`,
    [companyId]
  );
  await client.query(
    `UPDATE "pickingListLine" line SET "storageUnitId"=COALESCE((SELECT new_id FROM fmcg_scale_map
        WHERE kind='storageUnit' AND n=j.n AND old_id=line."storageUnitId"),line."storageUnitId"),
      "toStorageUnitId"=COALESCE((SELECT new_id FROM fmcg_scale_map
        WHERE kind='storageUnit' AND n=j.n AND old_id=line."toStorageUnitId"),line."toStorageUnitId")
      FROM fmcg_scale_jobs j WHERE line."jobId"=j.id AND line."companyId"=$1 AND j.n>1 AND line."quantityPicked"=0`,
    [companyId]
  );
  await client.query(
    `UPDATE "pickingList" list SET "locationId"=source.location_id FROM (
      SELECT line."pickingListId",min(j.location_id) AS location_id
      FROM "pickingListLine" line JOIN fmcg_scale_jobs j ON j.id=line."jobId"
      WHERE line."companyId"=$1 GROUP BY line."pickingListId" HAVING count(DISTINCT j.location_id)=1 AND sum(line."quantityPicked")=0
    ) source WHERE list.id=source."pickingListId" AND list."companyId"=$1`,
    [companyId]
  );
  await client.query(
    `UPDATE "jobOperationBatch" batch SET "locationId"=source.location_id,"workCenterId"=source.work_center FROM (
      SELECT o."jobOperationBatchId",min(j.location_id) AS location_id,min(o."workCenterId") AS work_center
      FROM "jobOperation" o JOIN fmcg_scale_jobs j ON j.id=o."jobId" WHERE o."companyId"=$1
      GROUP BY o."jobOperationBatchId" HAVING count(DISTINCT j.location_id)=1 AND count(DISTINCT o."workCenterId")=1
    ) source WHERE batch.id=source."jobOperationBatchId" AND batch."companyId"=$1`,
    [companyId]
  );

  // Employee records intentionally have no login membership or access grants.
  const workerType = await client.query<{ id: string }>(
    `INSERT INTO "employeeType" (name,"companyId",protected) VALUES ('Công nhân giả lập — không có quyền truy cập',$1,false) RETURNING id`,
    [companyId]
  );
  await client.query(
    `CREATE TEMP TABLE fmcg_scale_workers ON COMMIT DROP AS
    SELECT id('simworker') AS id,p.n AS plant,g AS ordinal,p.id AS location_id,
      (SELECT s.id FROM shift s WHERE s."locationId"=p.id AND s."companyId"=$1
        ORDER BY s."startTime",s.id OFFSET ((g-1)%3) LIMIT 1) AS shift_id
    FROM fmcg_scale_plants p CROSS JOIN generate_series(1,1000) g`,
    [companyId]
  );
  await client.query(`INSERT INTO "user" (id,email,"firstName","lastName",active,admin,developer,"isConsoleOperator",about)
    SELECT id,id || '@workers.fmcg.invalid','Công nhân',plant::text || '-' || lpad(ordinal::text,4,'0'),true,false,false,false,
      'Dữ liệu giả lập FMCG; không có tài khoản xác thực hoặc quyền truy cập' FROM fmcg_scale_workers`);
  await client.query(
    `INSERT INTO employee (id,"companyId","employeeTypeId",active) SELECT id,$1,$2,true FROM fmcg_scale_workers`,
    [companyId, workerType.rows[0]?.id]
  );
  await client.query(
    `INSERT INTO "employeeJob" (id,"companyId","locationId","shiftId",title,"startDate","departmentId","managerId","updatedBy",tags)
    SELECT id,$1,location_id,shift_id,'Công nhân vận hành FMCG',company_today($1)-180,
      (SELECT id FROM department WHERE "companyId"=$1 ORDER BY name,id LIMIT 1),$2,$2,ARRAY['FMCG-SYNTHETIC-WORKER']
    FROM fmcg_scale_workers`,
    [companyId, userId]
  );
  await client.query(
    `INSERT INTO "employeeShift" ("employeeId","shiftId","companyId") SELECT id,shift_id,$1 FROM fmcg_scale_workers WHERE shift_id IS NOT NULL`,
    [companyId]
  );

  // A modest, unposted production run per plant, attached to real routings/BOMs.
  await client.query(
    `CREATE TEMP TABLE fmcg_scale_runs ON COMMIT DROP AS
    SELECT DISTINCT ON (j.n) j.n,o.id AS operation_id,o."workCenterId",job.id AS job_id,job."itemId",job."jobId",
      greatest(0,COALESCE(o."operationQuantity",job.quantity)-COALESCE(o."quantityComplete",0)) AS quantity,
      o."inspectionDocumentId",id('pe') AS event_id,
      (SELECT id FROM fmcg_scale_workers w WHERE w.plant=j.n ORDER BY ordinal LIMIT 1) AS worker_id
    FROM fmcg_scale_jobs j JOIN job ON job.id=j.id AND job."companyId"=$1
    JOIN "jobOperation" o ON o."jobId"=job.id AND o."companyId"=$1
    WHERE job.status IN ('Ready','In Progress') AND o.status IN ('Ready','In Progress') AND o."workCenterId" IS NOT NULL
      AND COALESCE(o."operationQuantity",job.quantity)>COALESCE(o."quantityComplete",0)
    ORDER BY j.n,(o."inspectionDocumentId" IS NULL),job."createdAt",o."order",o.id`,
    [companyId]
  );
  await client.query(
    `INSERT INTO "productionEvent" (id,"jobOperationId",type,"startTime","endTime","employeeId","workCenterId","companyId","createdBy",notes)
    SELECT event_id,operation_id,'Labor',company_today($1)::timestamp AT TIME ZONE 'Asia/Ho_Chi_Minh' + interval '8 hours',
      company_today($1)::timestamp AT TIME ZONE 'Asia/Ho_Chi_Minh' + interval '9 hours',worker_id,"workCenterId",$1,$2,
      'Ca sản xuất giả lập FMCG; chưa hạch toán sổ cái' FROM fmcg_scale_runs`,
    [companyId, userId]
  );
  await client.query(
    `INSERT INTO "productionQuantity" ("jobOperationId",type,quantity,"laborProductionEventId","companyId","createdBy",notes)
    SELECT operation_id,'Production',least(10,greatest(1,quantity)),event_id,$1,$2,'Sản lượng ca giả lập FMCG'
    FROM fmcg_scale_runs`,
    [companyId, userId]
  );

  // New plants receive explicitly labelled opening balances, not copies of
  // posted receipts. Batch/serial stock has its own traceable synthetic entity.
  await client.query(
    `CREATE TEMP TABLE fmcg_scale_stock ON COMMIT DROP AS
      SELECT p.n,p.id AS location_id,i.id AS item_id,i."readableId",i."itemTrackingType",
        CASE WHEN i."itemTrackingType"='Serial' THEN 1 ELSE 1000 END AS quantity,
        CASE WHEN i."itemTrackingType" IN ('Batch','Serial') THEN id('te') ELSE NULL END AS entity_id,
        (SELECT s.id FROM "storageUnit" s JOIN warehouse w ON w.id=s."warehouseId" AND w."companyId"=s."companyId"
          WHERE s."companyId"=$1 AND s."locationId"=p.id ORDER BY s.name,s.id LIMIT 1) AS shelf_id
      FROM fmcg_scale_plants p CROSS JOIN item i
      WHERE p.n>1 AND i."companyId"=$1 AND i."replenishmentSystem"='Buy' AND i.active`,
    [companyId]
  );
  await client.query(
    `INSERT INTO "trackedEntity" (id,quantity,status,"sourceDocument","sourceDocumentId","sourceDocumentReadableId",attributes,"companyId","createdBy","readableId","itemId","expirationDate")
      SELECT entity_id,quantity,'Available','Item',item_id,"readableId",'{"Synthetic":true}'::jsonb,$1,$2,
        'FMCG-OPEN-' || n::text || '-' || entity_id,item_id,company_today($1)+365 FROM fmcg_scale_stock WHERE entity_id IS NOT NULL`,
    [companyId, userId]
  );
  await client.query(
    `INSERT INTO "itemLedger" ("entryType","documentType","postingDate","itemId","locationId","storageUnitId",quantity,"companyId","createdBy","trackedEntityId",comment)
      SELECT 'Positive Adjmt.','Inventory Receipt',company_today($1),item_id,location_id,shelf_id,quantity,$1,$2,entity_id,
        'FMCG synthetic opening balance; accounting valuation pending' FROM fmcg_scale_stock`,
    [companyId, userId]
  );
  await client.query(
    `INSERT INTO "pickMethod" ("itemId","locationId","defaultStorageUnitId","companyId","createdBy")
      SELECT item_id,location_id,shelf_id,$1,$2 FROM fmcg_scale_stock
      ON CONFLICT ("itemId","locationId") DO UPDATE SET "defaultStorageUnitId"=EXCLUDED."defaultStorageUnitId"`,
    [companyId, userId]
  );

  const lots = await client.query<{
    operation_id: string;
    job_id: string;
    jobId: string;
    itemId: string;
    quantity: string;
    inspectionDocumentId: string;
    samplingAql: string;
  }>(
    `SELECT r.*,d."samplingAql" FROM fmcg_scale_runs r JOIN "inspectionDocument" d
      ON d.id=r."inspectionDocumentId" AND d."companyId"=$1`,
    [companyId]
  );
  const inspections = lots.rows.map((lot) => {
    const lotSize = Math.max(1, Math.floor(Number(lot.quantity)));
    const aql = Number(lot.samplingAql ?? 1);
    const plan = resolveInspectionPlan({ aql }, lotSize);
    return {
      operationId: lot.operation_id,
      jobId: lot.job_id,
      readableId: lot.jobId,
      itemId: lot.itemId,
      documentId: lot.inspectionDocumentId,
      lotSize,
      aql,
      sampleSize: plan.sampleSize,
      acceptance: plan.acceptance,
      rejection: plan.rejection,
      codeLetter: plan.codeLetter ?? null
    };
  });
  await client.query(
    `INSERT INTO inspection ("inspectionId","itemId","lotSize","samplingStandard","samplingPlanType","sampleSize","acceptanceNumber","rejectionNumber",aql,"inspectionLevel",severity,"codeLetter","inspectionDocumentId",status,"sourceDocument","sourceDocumentId","sourceDocumentLineId","sourceDocumentReadableId","companyId","createdBy",notes)
    SELECT 'INS-SIM-' || id(),x."itemId",x."lotSize",$3,'AQL',x."sampleSize",x.acceptance,x.rejection,x.aql,'II','Normal',x."codeLetter",x."documentId",'Pending','Job Operation',x."jobId",x."operationId",x."readableId",$1,$2,'Kiểm nghiệm ca giả lập FMCG'
    FROM jsonb_to_recordset($4::jsonb) x("itemId" text,"lotSize" int,"sampleSize" int,acceptance int,rejection int,aql numeric,"codeLetter" text,"documentId" text,"jobId" text,"operationId" text,"readableId" text)
    WHERE NOT EXISTS (SELECT 1 FROM inspection existing WHERE existing."companyId"=$1 AND existing."sourceDocumentLineId"=x."operationId")`,
    [companyId, userId, SEED_SAMPLING_STANDARD, JSON.stringify(inspections)]
  );
  await client.query(
    `INSERT INTO "inspectionSamplingPlan" ("inspectionId","inspectionFeatureId","sampleSize","acceptanceNumber","rejectionNumber","codeLetter","companyId","createdBy")
      SELECT lot.id,feature.id,lot."sampleSize",lot."acceptanceNumber",lot."rejectionNumber",lot."codeLetter",$1,$2
      FROM inspection lot JOIN "inspectionFeature" feature ON feature."inspectionDocumentId"=lot."inspectionDocumentId" AND feature."companyId"=lot."companyId"
      WHERE lot."companyId"=$1 AND lot.notes='Kiểm nghiệm ca giả lập FMCG'`,
    [companyId, userId]
  );
  await client.query(
    `INSERT INTO "inspectionSample" ("inspectionId",status,"companyId","createdBy",notes)
      SELECT lot.id,'Pending',$1,$2,'Mẫu chờ kiểm nghiệm ca giả lập FMCG'
      FROM inspection lot CROSS JOIN LATERAL generate_series(1,lot."sampleSize") sample
      WHERE lot."companyId"=$1 AND lot.notes='Kiểm nghiệm ca giả lập FMCG'`,
    [companyId, userId]
  );

  const plants = await client.query<{
    id: string;
    name: string;
    family: string;
    workers: number;
  }>(
    `SELECT p.id,p.name,p.family,count(w.id)::int AS workers FROM fmcg_scale_plants p LEFT JOIN fmcg_scale_workers w ON w.plant=p.n GROUP BY p.n,p.id,p.name,p.family ORDER BY p.n`
  );
  const runCoverage = await client.query<{ count: string }>(
    `SELECT count(*) FROM fmcg_scale_runs`
  );
  return {
    plants: plants.rows,
    workerCount: plants.rows.reduce((sum, plant) => sum + plant.workers, 0),
    unsupported: [
      ...(Number(runCoverage.rows[0]?.count) === 3
        ? []
        : [
            "A plant has no runnable job operation; MES sample run could not be generated there"
          ]),
      ...(inspections.length === 3
        ? []
        : [
            "A plant run has no inspection document; a sampling inspection could not be generated there"
          ]),
      "Synthetic workers have personnel records only; authentication accounts and access permissions are intentionally not provisioned",
      "Additional plant opening inventory quantities are seeded; accounting valuation of those opening balances remains pending"
    ]
  };
}
