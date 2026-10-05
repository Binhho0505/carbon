# Vietnamese ERP/MES local verification — 2026-10-05

User confirmed all ERP and MES UI strings. Independent Carbon application; CC1 Odoo schema applicability N/A. Implemented existing Lingui locale `vi` and native picker label `Tiếng Việt`; English default remains unchanged. No database, authorization or business logic changes.

Catalog coverage: ERP 7,026/7,026 and MES 610/610 translated; zero missing entries. The standalone catalog validator passed with zero issues, including source IDs, ICU argument/branch/style preservation, rich-text nesting, boundary whitespace and 323 shared messages. `Failed` intentionally differs by context: ERP `Thất bại`, MES inspection `Không đạt`.

Completed checks:

- Existing translation merger: 7,636 filled, zero unmatched or remaining empty.
- `linguito check`: exit 0; catalogs complete.
- Strict Lingui compilation scoped to English/Vietnamese: exit 0. Compiled runtime checks passed for all catalog entries, including 547 interpolated ERP and 91 interpolated MES messages.
- Locale package Vitest: 3 tests passed (locale resolution, native picker labels and extraction/runtime locale parity).
- Locale package typecheck: exit 0.
- Biome on changed TypeScript files: passed. New validator syntax and scoped license-header check: passed.
- `node packages/locale/scripts/verify-catalogs.mjs vi`: zero issues.
- Existing `/api/locale` POST with `vi`: HTTP 200 and locale cookie returned.
- Final localhost `/login` with `locale=vi`: ERP port 3000 HTTP 200, HTML language `vi`, actual `Đăng nhập`, `Tiếp tục`, `tài khoản`; MES port 3001 HTTP 200, HTML language `vi`, actual `Đăng nhập`, `Tiếp tục`.

New catalogs required restarting the local application processes because the existing server caches loaded messages. ERP's first cold start encountered a Vite 60-second module transport timeout; restarting its supervised process with warmed dependencies restored HTTP 200. No Vite configuration, vendor dependencies or package pins were changed to recover it.

Limitations: no browser automation adapter was available; authenticated browser navigation was not verified. Coverage includes every extracted Lingui message, not upstream unmarked strings, user-entered records, external service UI or other applications. Vietnamese terminology is DRAFT in `.ai/docs/vietnamese-terminology.draft.json`; the approved upstream glossary has no Vietnamese translations and was not changed. The glossary checker reported nothing approved to compare against.

No commit, GitHub push or production deployment was performed. The earlier fork push remains blocked by the separate incomplete full ERP typecheck (resource limits); the prior whole ERP test run also had three pre-existing CRLF-sensitive KB test failures. Locale-specific checks passing do not imply those broader checks passed. Temporary translation chunks and runtime HTML remain in ignored `.ai/scratch/translate`: the cleanup command was rejected by automatic execution policy. Compiled catalogs remain ignored artifacts. Working and staged `git diff --check` passed; English catalogs, approved glossary and Vite entry/config content were unchanged.
