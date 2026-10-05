# Local Vietnamese accounting module and Git publication

Status: IN_PROGRESS. Extends the approved FMCG specification at the user's explicit request on 2026-10-05: load/customize accounting locally, retain it locally, and publish source to the user's Git fork. Production deployment is outside scope.

## Implementation scope

- Preserve existing company ownership, authentication, authorization and period-close controls.
- Add deterministic TT99 income closing: reductions of revenue → revenue, income and expenses → 911, result → 4212. Post through native journal validation in an atomic transaction; do not alter posted journals or close periods automatically.
- Persist all 101 B09 disclosure sections as immutable company-private DRAFT versions, bound to the reporting period and ledger digest. Saving a draft is not accountant approval or statutory filing.
- Validate gross receivables/payables maturity, opening balance reconciliation, comparative cash flow and annual fiscal-period scope before annual-form export.
- Retain ERP/MES synthetic data for three plants and 3,000 workers; retain Vietnamese locale support.
- Back up the local database before configuration writes. Keep dumps, credentials and demo release files out of Git.
- Run the repository's check-and-commit gates and publish only source/configuration/documentation to origin, never force-push.

## Scope and evidence limits

The annual going-concern forms B01-DN, B02-DN, B03-DN and B09-DN are supported. Interim/non-going-concern variants and company-specific tax/legal assertions require a separate decision. Existing Carbon cost-clearing analytical accounts remain proposed local mappings requiring accountant review. Native DRAFT disclosures must not be represented as approved. Automated runtime tests do not constitute human review, a financial-statement signature or a compliance certificate.

Odoo applicability: N/A. This is the user's Carbon fork, not a CC1/Odoo project; the existing Carbon schema and stack remain authoritative. The default CC1 build method is adapted to this repository without importing Odoo fields.

## Local backup before writes

`D:/Code/carbon/.cc1-agentic/backups/carbon-before-tt99-native-2026-10-05.dump`

PostgreSQL custom-format archive, `pg_restore --list` verified; SHA-256:
`71de46f0b97f09cd699b4dd39249e23311a99e6b2ecbed2bef2aed6529ab8948`.
Local-only and Git-ignored. The archive contains local authentication data and must not be published.
