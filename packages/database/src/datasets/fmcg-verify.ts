// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PoolClient } from "pg";
import { COVERAGE_FLOORS, COVERAGE_SCOPES } from "./coverage.ts";
import { quote } from "./sql.ts";

export const FMCG_COVERAGE_EXCLUSIONS: Readonly<Record<string, string>> = {
  modelUpload:
    "Product CAD model upload is inapplicable to bulk FMCG batch manufacturing.",
  assemblyComponentMapping:
    "Product CAD assembly is inapplicable to bulk FMCG batch manufacturing.",
  assemblyInstruction:
    "Product CAD assembly is inapplicable to bulk FMCG batch manufacturing.",
  assemblyInstructionStep:
    "Product CAD assembly is inapplicable to bulk FMCG batch manufacturing.",
  assemblyInstructionStepMaterial:
    "Product CAD assembly is inapplicable to bulk FMCG batch manufacturing.",
  assemblyInstructionStepTool:
    "Product CAD assembly is inapplicable to bulk FMCG batch manufacturing."
};

export async function verifyFmcgCompany(client: PoolClient, companyId: string) {
  const issues: string[] = [];
  const coverage = await client.query<{ table: string; count: number }>(
    Object.keys(COVERAGE_FLOORS)
      .map(
        (table) =>
          `SELECT '${table}' AS table, count(*)::int AS count FROM ${quote(table)}
       WHERE ${COVERAGE_SCOPES[table] ?? '"companyId" = $1'}`
      )
      .join(" UNION ALL "),
    [companyId]
  );
  for (const row of coverage.rows) {
    if (
      !FMCG_COVERAGE_EXCLUSIONS[row.table] &&
      row.count < COVERAGE_FLOORS[row.table]!
    ) {
      issues.push(
        `${row.table}: ${row.count} below coverage floor ${COVERAGE_FLOORS[row.table]}`
      );
    }
  }
  const plants = await client.query<{
    id: string;
    name: string;
    workers: number;
    jobs: number;
    operations: number;
    productionEvents: number;
    productionQuantities: number;
    warehouses: number;
  }>(
    `SELECT l.id, l.name,
      (SELECT count(*)::int FROM employee e JOIN "user" u ON u.id=e.id
        JOIN "employeeJob" ej ON ej.id=e.id AND ej."companyId"=e."companyId"
        WHERE e."companyId"=$1 AND ej."locationId"=l.id AND e.active=true
          AND u.email LIKE '%@workers.fmcg.invalid') AS workers,
      (SELECT count(*)::int FROM job j WHERE j."companyId"=$1 AND j."locationId"=l.id) AS jobs,
      (SELECT count(*)::int FROM "jobOperation" o JOIN job j ON j.id=o."jobId" AND j."companyId"=o."companyId"
        WHERE j."companyId"=$1 AND j."locationId"=l.id) AS operations,
      (SELECT count(*)::int FROM "productionEvent" p JOIN "jobOperation" o ON o.id=p."jobOperationId" AND o."companyId"=p."companyId"
        JOIN job j ON j.id=o."jobId" AND j."companyId"=o."companyId"
        WHERE j."companyId"=$1 AND j."locationId"=l.id) AS "productionEvents",
      (SELECT count(*)::int FROM "productionQuantity" p JOIN "jobOperation" o ON o.id=p."jobOperationId" AND o."companyId"=p."companyId"
        JOIN job j ON j.id=o."jobId" AND j."companyId"=o."companyId"
        WHERE j."companyId"=$1 AND j."locationId"=l.id) AS "productionQuantities",
      (SELECT count(*)::int FROM warehouse w WHERE w."companyId"=$1 AND w."locationId"=l.id) AS warehouses
     FROM location l WHERE l."companyId"=$1 AND l.code IN ('FMCG-BEV','FMCG-FOOD','FMCG-CARE') ORDER BY l.code`,
    [companyId]
  );
  if (plants.rowCount !== 3)
    issues.push(`Expected 3 manufacturing plants, got ${plants.rowCount}`);
  for (const plant of plants.rows) {
    if (plant.workers !== 1000)
      issues.push(`${plant.name}: expected 1000 workers, got ${plant.workers}`);
    for (const field of [
      "jobs",
      "operations",
      "productionEvents",
      "productionQuantities",
      "warehouses"
    ] as const) {
      if (plant[field] < 1) issues.push(`${plant.name}: no ${field}`);
    }
  }
  const journalBalances = await client.query<{ id: string; imbalance: string }>(
    `SELECT j.id, sum(CASE WHEN a.class IN ('Asset','Expense') THEN jl.amount ELSE -jl.amount END)::text AS imbalance
     FROM journal j JOIN "journalLine" jl ON jl."journalId"=j.id AND jl."companyId"=j."companyId"
     JOIN company c ON c.id=j."companyId"
     JOIN account a ON a.id=jl."accountId" AND a."companyGroupId"=c."companyGroupId"
     WHERE j."companyId"=$1 AND j.status='Posted' GROUP BY j.id
     HAVING sum(CASE WHEN a.class IN ('Asset','Expense') THEN jl.amount ELSE -jl.amount END) <> 0`,
    [companyId]
  );
  if (journalBalances.rowCount)
    issues.push(`${journalBalances.rowCount} unbalanced posted journals`);
  const currencies = await client.query<{
    baseCurrencyCode: string;
    timezone: string;
  }>(`SELECT "baseCurrencyCode", timezone FROM company WHERE id=$1`, [
    companyId
  ]);
  if (currencies.rows[0]?.baseCurrencyCode !== "VND")
    issues.push("Company currency is not VND");
  const trialBalance = await client.query(
    `SELECT a.number, a.name, a.class,
      sum(greatest(CASE WHEN a.class IN ('Asset','Expense') THEN jl.amount ELSE -jl.amount END,0))::text AS debit,
      sum(greatest(CASE WHEN a.class IN ('Asset','Expense') THEN -jl.amount ELSE jl.amount END,0))::text AS credit
     FROM "journalLine" jl JOIN journal j ON j.id=jl."journalId" AND j."companyId"=jl."companyId"
     JOIN company c ON c.id=j."companyId"
     JOIN account a ON a.id=jl."accountId" AND a."companyGroupId"=c."companyGroupId"
     WHERE j."companyId"=$1 AND j.status='Posted'
     GROUP BY a.number,a.name,a.class ORDER BY a.number`,
    [companyId]
  );
  const authWorkers = await client.query<{ count: number }>(
    `SELECT count(*)::int AS count FROM auth.users au JOIN employee e ON e.id=au.id::text
     JOIN "user" u ON u.id=e.id WHERE e."companyId"=$1 AND u.email LIKE '%@workers.fmcg.invalid'`,
    [companyId]
  );
  if (authWorkers.rows[0]!.count !== 0)
    issues.push("Synthetic workers unexpectedly have authentication accounts");
  const company = await client.query<{
    id: string;
    name: string;
    currencyCode: string;
    today: string;
  }>(
    `SELECT id,name,"baseCurrencyCode" AS "currencyCode",company_today(id)::text AS today FROM company WHERE id=$1`,
    [companyId]
  );
  const journalRows = await client.query(
    `SELECT j.id AS "journalId",j."postingDate"::text AS "postingDate",a.number AS "accountNumber",a.name AS "accountName",a.class AS "accountClass",
       (CASE WHEN a.class IN ('Asset','Expense') THEN jl.amount ELSE -jl.amount END)::float8 AS amount,
       jl.description,j."sourceType"::text AS "sourceType",coalesce(jl."customFields"->'tt99'->>'cashFlowCode',a."customFields"->'tt99'->'cashFlowAllocations'->jl.id->>'cashFlowCode') AS "cashFlowCode",
       coalesce(jl."customFields"->'tt99'->>'counterpartyId',a."customFields"->'tt99'->'controlAllocations'->jl.id->>'counterpartyId') AS "partyId",
       coalesce(jl."customFields"->'tt99'->>'maturity',a."customFields"->'tt99'->'controlAllocations'->jl.id->>'maturity') AS maturity
     FROM "journalLine" jl JOIN journal j ON j.id=jl."journalId" AND j."companyId"=jl."companyId"
     JOIN company c ON c.id=j."companyId" JOIN account a ON a.id=jl."accountId" AND a."companyGroupId"=c."companyGroupId"
     WHERE j."companyId"=$1 AND j.status IN ('Posted','Reversed') ORDER BY j."postingDate",j.id,jl.id`,
    [companyId]
  );
  const classifications = await client.query(
    `SELECT a.number,a."customFields"->'tt99' AS classification FROM account a JOIN company c ON c."companyGroupId"=a."companyGroupId"
     WHERE c.id=$1 AND NOT a."isGroup"`,
    [companyId]
  );
  return {
    issues,
    plants: plants.rows,
    currencies: currencies.rows[0],
    coverage: coverage.rows.map((row) => ({
      ...row,
      floor: COVERAGE_FLOORS[row.table],
      excluded: FMCG_COVERAGE_EXCLUSIONS[row.table] ?? null
    })),
    unbalancedPostedJournals: journalBalances.rows,
    trialBalance: trialBalance.rows,
    syntheticWorkerAuthAccounts: authWorkers.rows[0]!.count,
    reportSnapshot: {
      company: company.rows[0],
      journalLines: journalRows.rows,
      classifications: classifications.rows
    },
    statutoryCompliance:
      "OPEN: Vietnamese statutory forms/disclosures and transition review are separate from demo balance checks."
  };
}
