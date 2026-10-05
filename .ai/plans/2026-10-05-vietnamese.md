# Vietnamese UI for Carbon

Scope confirmed by user: all extracted ERP and MES UI strings, Vietnamese locale `vi`, native label `Tiếng Việt`. Use existing Lingui catalogs and picker; preserve existing defaults, cookies, permissions, database fields and other locales. Independent Carbon application; CC1 Odoo mapping N/A.

1. Register `vi` in Lingui and runtime; extract only Vietnamese catalogs.
2. Translate all entries with manufacturing ERP/MES context and consistent draft terminology; preserve interpolation, ICU syntax and rich-text tags. Vietnamese glossary approval is OPEN; do not mark proposed wording as approved.
3. Merge deterministically; verify zero empty entries, exact source IDs, interpolation and ICU parsing, locale resolution and picker options.
4. Run locale package tests/typecheck, affected formatting and scoped catalog compilation, then verify real localhost Vietnamese SSR with the locale cookie.

No production deployment. Prior authorized fork push is still blocked by incomplete ERP typecheck; do not bypass that gate. Keep earlier staged changes separate from this working change.

Implementation and local QA completed 2026-10-05: all 7,636 catalog entries translated, locale tests/typecheck and catalog checks passed, and ERP/MES login pages returned HTTP 200 with actual Vietnamese text. Terminology approval remains OPEN. Evidence: `.ai/runs/2026-10-05-vietnamese.md`.
