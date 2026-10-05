# TT99 native closing transaction review

Status: DRAFT
Date: 2026-10-05 (Asia/Saigon)
Scope: Independent read-only review of the native closing planner, server, accounting route and rollback integration test. This review does not approve statutory financial statements.

## Finding: unclosed prior financial-year income

The reviewed implementation read all historical opening balances in `vietnamese-closing.server.ts` and added them to the planner's current income-account balances in `vietnamese-closing.ts`. The result target was account 4212. When an opening income balance belongs to an unclosed prior financial year, this routes that historical result into the current-year retained-profit account.

A read-only pure-planner reproduction executed through `node --require tsx/cjs` with stdin, without file or database writes:

- Company: `review`; period: 2026-01-01 through 2026-12-31.
- Accounts: active posting leaves 5111 Revenue / Income Statement, 911 Expense / Income Statement, 4212 Equity / Balance Sheet.
- Opening 5111 debit-positive amount: -100, representing unclosed previous-year sales.
- Posted current-year 5111 amount: -200, dated 2026-10-05.
- Actual result: `blocked=false`, `netIncome=300`, debit 911 300, credit 4212 300.

Required resolution: block unclosed prior financial-year P&L balances or require a separate historical close. Do not silently assign prior-year income to current-year 4212. Root assigned this correction to the closing implementation owner; resolution and final verification must be recorded separately. This finding describes the reviewed version, not a claim that subsequent code remains defective.

## Security and transaction assessment

- HTTP posting requires employee role and accounting create/update permissions before obtaining the privileged database client.
- Company and company-group ownership scopes are applied to chart and ledger queries.
- Posting uses one serializable transaction and a per-company advisory lock.
- Historical accounting periods affecting the opening and selected balances are locked in deterministic order with `FOR UPDATE`; native journal posting takes `FOR SHARE` on its period. This prevents an ordinary concurrent posting from bypassing the relevant period-row lock.
- Preview fingerprint mismatch prevents fresh posting; existing posted closing is returned without duplicates when the remaining plan is empty. Reversed or changed closing is rejected.
- The implementation writes journal headers and lines through native Draft-to-Posted constraints. It does not change period close status or mutate previously posted journal lines.

## Verification boundaries

The existing actual rollback integration checks balanced posted closing entries, no remaining income/911 closing plan, repeat-request idempotency, unchanged B02 presentation, and journal counts restored after rollback. This review did not rerun heavy tests and is not browser authentication coverage. Explicit 4212 balance-delta and period-state assertions were suggested as useful additional integration evidence.

## Document metadata correction

Native B09 draft save metadata used raw Blob bytes as `document.size`; the existing document contract uses kilobytes. Corrected to `Math.ceil(file.size / 1024)` without changing stored JSON bytes, permissions or version paths. Existing focused server tests and scoped Biome checks are the verification for this low-impact correction.

## Gross control-account completeness hardening

Root identified a conservative completeness gap in grouped 131/331 balances: two nonzero lines lacking known counterparties could net to zero in an unknown-party bucket, hiding gross receivables and advances. The prior `missingControls` check only considered nonzero grouped balances.

Resolution: the existing company/group-scoped control query now counts original nonzero journal lines whose resolved customer/supplier is unknown, as `unknownPartyLineCount`. Any positive count blocks exports even when the grouped amount is zero. A known counterparty fully settled to zero is not blocked solely because residual maturity is absent. No additional query, N+1 operation, authentication or schema change was added.

Verification on the corrected version: 28 route server tests passed, including both DRAFT management and DEMO export cases for unknown-party zero-net buckets and known-party settled buckets. The actual local demo-loader integration passed (one test), exercising authenticated company/RLS scope, live SQL and persisted demo-package validation without database writes. That read-only integration mocks only the unrelated document-write service to avoid its Lingui UI/glossary import graph in server-only Vitest. Scoped Biome checks passed. This remains DRAFT review evidence, not statutory approval.
