# FMCG and native local TT99 accounting assessment

Status: **PROPOSED / compliance not certified**. Scope: an unrelated personal Carbon local demo, one legal entity, three locations (beverages, food, personal care), 1,000 workers per location. Review date: 2026-10-05.

## Official sources and retrieval limits

- [Government Gazette: TT99/2025/TT-BTC](https://congbao.chinhphu.vn/van-ban/thong-tu-so-99-2025-tt-btc-46529/59631.htm): official entry confirms issuance 27/10/2025, effectiveness 01/01/2026, and exposes ten PDF/DOC attachment parts across Gazette issues 1563–1582. All ten official PDFs were subsequently downloaded with Windows `curl.exe` and normal TLS certificate verification. Raw PDFs and extracted UTF-8 text remain local in `.cc1-agentic/tt99-official-0..9`; durable SHA256/page-count evidence is `fmcg-tt99-source-manifest.json`. Appendix-II primary chart is part 1 PDF pages 33–43 (Gazette printed pages 34–44); Appendix-IV forms are in parts 8–9. These are the legal sources for the implementation, rather than a remembered TT200 account chart. Analytical suffixes such as `.THANHLY` remain explicitly company-specific demo extensions requiring review.
- [National legal database entry](https://vbpl.vn/TW/Pages/vbpq-van-ban-goc.aspx?ItemID=187356): search indexed official entry; direct fetch rejected 403.
- [Ministry of Finance: Appendix-II explanation](https://portal.mof.gov.vn/hoidapcstc/home/cthoidap/159654): confirms Appendix II is the enterprise chart of accounts and that former accounts 161/461 are removed. This does not validate every proposed demo account.
- [Ministry of Finance: financial-report presentation](https://ttcg.mof.gov.vn/hoidapcstc/home/cthoidap/163296): describes Appendix-IV financial statements and permissible supplementary lines with disclosure. Cash-flow presentation is explicitly discussed.

## Existing Carbon capability, inspected source evidence

- `apps/erp/app/modules/accounting/AGENTS.md`, `accounting.service.ts`: hierarchical chart, natural-balance double entry, posted/reversed journals, trial balance, generic balance sheet and income statement, inventory valuation, dimensions, cost centers, period close and reopen, fixed assets, consolidation and FX. Balance/report readers are company scoped; chart is company-group scoped.
- `packages/database/src/seed-data.ts`: default chart uses 1010/1110/1210/2010/4010 etc, not a Vietnamese statutory chart. Defaults are account IDs resolved from these seed numbers.
- `packages/database/src/datasets/tiers/09-accounting.ts`: real document posting, journal seed, payroll-accrual examples, fixed asset depreciation, periods, settlements. The payment documentary currency now resolves from `company.baseCurrencyCode`; existing USD companies retain USD.
- `packages/server-functions/src/post-purchase-invoice/`: configured Asset input-tax control now enables deductible purchase VAT. Generated base tax is excluded from inventory/expense/acquisition cost and posted as an Asset debit and AP credit. Fixed-asset purchases use the group's active Asset 1332 when present. Existing Liability-tax-default companies retain the original nonrecoverable capitalization policy. Pure purchase-posting tests cover the opt-in and legacy paths; native server-function typecheck passed.
- `packages/database/src/datasets/data/motor/accounting.ts`: scaffold payroll accrual is a manual GL journal, not a payroll engine.
- Initial repository baseline: generic statements/trial balance were present, but TT99 cash-flow/notes forms were absent. The local extension now adds `reports/vietnamese`: B01-DN, B02-DN, B03-DN and all 101 B09-DN sections, with explicit account, maturity and cash-flow classification rather than automatic guesses.

## Local accounting behavior supplied

`packages/database/src/datasets/fmcg-accounting.ts` contains transaction-owned helpers. `prepareVietnameseAccounting` runs before document tiers and refuses shared groups or existing journals; it correctly classifies input VAT as Asset, customer settlement discounts as Expense, supplier settlement discounts as Revenue and dividends payable as Liability. `applyVietnameseAccounting` runs after tiers and renumbers/labels all 82 bootstrap leaves without changing IDs or posted lines; it refuses missing accounts/collisions and adds VAT-fixed-asset, payroll liabilities and production-cost leaves. It verifies non-Draft journals balance after converting natural balances to debit signs. `postFmcgPlantAccounting` values the extra plants' physical opening stock into costLedger with a balanced 152/421 journal, validates 1,000 tagged workers at each of three plants, posts fictional gross pay of 10,000,000 VND per person (30,000,000,000 VND total) as 622/3341, closes this to 154, and closes actual current-period 621/627 balances to 154. Gross pay is a simulation amount, not a statutory rate or net-pay calculation. `classifyFmcgAccounting` supplies explicit synthetic maturity and company-scoped partner metadata for gross debtor/creditor presentation, including clearly labeled fictional opening allocation. The outer dry-run transaction must roll back unless the seed runner is explicitly applied.

Company base currency VND and Asia/Ho_Chi_Minh timezone must be set before document tiers. Synthetic amounts must be scaled consistently from the USD scaffold, including settlements, journal lines, asset values and invoice totals. Three locations are analytical plants, not three legal entities; consolidation/intercompany demonstration needs separate entities if requested later.

## Native reporting and closing extension

The annual going-concern report engine reconciles both current and opening B01 balances and both current and comparative B03 cash movements. Gross 131/331 control balances require explicit short/long-term maturity. Partial fiscal years are management/demo periods, not annual statutory periods. Existing account IDs remain stable.

All 101 B09 sections can be saved through the native document/storage permissions as immutable company-private DRAFT versions. Versions are bound to company, period and ledger digest; stale versions are rejected. A saved draft is not approved. The demo package has a separate `DEMO_PREPARED` status and cannot be exported as an approved statutory package.

The closing planner uses TT99 521 → 511, income/expenses → 911 and result → 4212. It blocks unresolved manufacturing collectors, unexplained 911 balances, invalid posting accounts and invalid amounts. The native posting integration must use one transaction, existing period and journal validation, and an explicit user posting action. The current-period demo is not automatically closed.

Technical runtime QA, accountant content review and official publication are separate. Source publication to the user's Git fork does not promote DRAFT financial statements to APPROVED.

## Explicit open gaps

| Area | Current demo | Required before TT99 compliance claim |
| --- | --- | --- |
| Account system | Vietnamese-number/name candidates, preserved Carbon classes | Verify every mapping against official Appendix II; approve local analytical subaccounts and full reconciliation |
| Input VAT | Native opt-in Asset 1331/1332 posting and legacy policy regression tests | Verify complete invoice/AP/tax reconciliation and product-specific tax policy; no statutory tax rates are invented |
| Prepayments and advances | Separate Carbon Asset/Liability controls retained | Statutory debtor/creditor presentation and per-partner debit/credit classification |
| Discounts and dividends | New isolated demo's posting classes corrected before journals | Accountant review of settlement/trade-discount and dividend policy |
| Production cost | WIP, inventories, absorption and variance flows supported | Verified 621/622/627→154→155→632 closing/cost reconciliation and product cost policy |
| Payroll | 3,000 synthetic worker records, 30 billion VND fictional gross accrual, 622→154 close | PIT, insurance and trade-union calculations require a separate payroll/tax engine; gross accrual does not imply statutory net-pay calculation |
| Annual financial statements | B01/B02/B03/B09 engine, comparative checks, 101 versioned disclosures, separate demo exports | Accountant review of mappings/policies, factual/legal disclosures, signatures and authorized statutory approval; interim/non-going-concern variants are outside this implementation |
| Fiscal/FX policies | Existing fiscal calendar and exchange-rate engine | TT99-specific policy review, approved rates and treatment; a market rate alone is not compliance |
| Source review | All ten official PDFs downloaded; SHA256/page evidence captured; chart and forms provided to implementers | Review domain policies and final mappings; downloading the law is not accountant certification |

All exported reports must state **simulation / proposed mapping / not an official statutory financial report** until these gaps close. No statutory insurance or tax rates are inferred or hardcoded from memory.
