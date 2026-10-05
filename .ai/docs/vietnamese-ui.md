# Vietnamese interface

Vietnamese (`vi`, native label **Tiếng Việt**) is registered in the existing Lingui configuration and runtime locale list for ERP and MES. Catalogs are `packages/locale/locales/vi/erp.po` and `mes.po`. Source messages, identifiers, database fields and existing language defaults are unchanged.

To select Vietnamese, open the ERP avatar menu → **Language / Ngôn ngữ** → **Tiếng Việt**. The existing `/api/locale` endpoint sets the locale cookie, shared by localhost ERP and MES. The profile language form also offers Vietnamese. A browser preferring `vi-VN` receives Vietnamese automatically unless an existing language cookie overrides that preference.

Coverage is the full extracted UI catalog: 7,026 ERP entries and 610 MES entries. Text outside Lingui (unmarked upstream copy), user-entered business data, external service labels and other Carbon apps are not automatically translated. Keep brand names, codes, variables and external option identifiers intact.

Terminology is **DRAFT**, not business-approved. The upstream approved glossary has no Vietnamese column. Proposed consistent wording is recorded in [vietnamese-terminology.draft.json](vietnamese-terminology.draft.json); context and non-domain meanings take precedence over literal word substitution. Do not treat these proposals as approved glossary entries.

Verification commands:

```powershell
.cc1-agentic\bin\pnpm.cmd --filter @carbon/locale test
.cc1-agentic\bin\pnpm.cmd --filter @carbon/locale typecheck
node packages/locale/scripts/verify-catalogs.mjs vi
.cc1-agentic\bin\pnpm.cmd exec linguito check
```

The catalog validator checks complete source-ID coverage, ICU arguments/branches/format styles, rich-text tags and nesting, boundary whitespace and shared ERP/MES wording. Explicit context exceptions remain: **Failed** means workflow execution failure (**Thất bại**) in ERP and an inspection not passing (**Không đạt**) in MES. Compiled `.mjs` files remain ignored build artifacts. Local runtime verification and limitations are recorded in `.ai/runs/2026-10-05-vietnamese.md` when checks finish. No production release approval is implied.
