// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PoolClient } from "pg";

/** Synthetic recent attendance and resource allocations; caller owns the transaction. */
export async function seedFmcgAttendance(
  client: PoolClient,
  companyId: string,
  userId: string
) {
  await client.query(
    `WITH numbered AS (
      SELECT s.id, row_number() OVER (PARTITION BY s."locationId" ORDER BY s."startTime",s.id) AS n
      FROM shift s JOIN location l ON l.id=s."locationId" AND l."companyId"=s."companyId"
      WHERE s."companyId"=$1 AND l.code IN ('FMCG-BEV','FMCG-FOOD','FMCG-CARE')
    ) UPDATE shift s SET name='Ca '||n.n::text,
      "startTime"=CASE n.n WHEN 1 THEN '06:00:00'::time WHEN 2 THEN '14:00:00'::time ELSE '22:00:00'::time END,
      "endTime"=CASE n.n WHEN 1 THEN '14:00:00'::time WHEN 2 THEN '22:00:00'::time ELSE '06:00:00'::time END,
      monday=true,tuesday=true,wednesday=true,thursday=true,friday=true,saturday=true,sunday=false
     FROM numbered n WHERE s.id=n.id AND s."companyId"=$1`,
    [companyId]
  );
  await client.query(
    `CREATE TEMP TABLE fmcg_attendance ON COMMIT DROP AS
     SELECT ej.id AS employee_id,ej."locationId" AS location_id,ej."shiftId" AS shift_id,
       company_today($1)-g AS work_date,
       ((company_today($1)-g)+s."startTime") AT TIME ZONE 'Asia/Ho_Chi_Minh' AS clock_in,
       (((company_today($1)-g)+s."startTime") AT TIME ZONE 'Asia/Ho_Chi_Minh')+interval '8 hours' AS clock_out
     FROM "employeeJob" ej JOIN "user" u ON u.id=ej.id
     JOIN shift s ON s.id=ej."shiftId" AND s."companyId"=ej."companyId"
     CROSS JOIN generate_series(1,7) g
     WHERE ej."companyId"=$1 AND u.email LIKE '%@workers.fmcg.invalid'
       AND extract(isodow FROM company_today($1)-g)<>7`,
    [companyId]
  );
  const timeCards = await client.query(
    `INSERT INTO "timeCardEntry" ("employeeId","companyId","clockIn","clockOut",note,"createdBy")
     SELECT employee_id,$1,clock_in,clock_out,'Chấm công ca giả lập FMCG — không dùng tính lương thực tế',$2
     FROM fmcg_attendance`,
    [companyId, userId]
  );
  const allocations = await client.query(
    `WITH centers AS (
      SELECT id,"locationId",row_number() OVER(PARTITION BY "locationId" ORDER BY id) AS n,
        count(*) OVER(PARTITION BY "locationId") AS total
      FROM "workCenter" WHERE "companyId"=$1 AND active
    ), workers AS (
      SELECT a.*,dense_rank() OVER(PARTITION BY location_id ORDER BY employee_id) AS ordinal
      FROM fmcg_attendance a
    ) INSERT INTO "peopleAssignment" ("companyId","locationId","workCenterId","employeeId",date,"shiftId",hours,"overtimeHours",note,"createdBy")
    SELECT $1,w.location_id,c.id,w.employee_id,w.work_date,w.shift_id,8,0,
      'Phân công nguồn lực giả lập FMCG',$2 FROM workers w
    JOIN centers c ON c."locationId"=w.location_id AND c.n=((w.ordinal-1)%c.total)+1`,
    [companyId, userId]
  );
  return {
    timeCards: timeCards.rowCount,
    resourceAssignments: allocations.rowCount,
    days: 6
  };
}
