# Root-Cause Brief — ERP cold-start model import
Status: VERIFIED_LOCAL, 2026-10-05. Local setup, followed by explicit user request to commit/push to the personal fork on 2026-10-05.
Bug: ERP /login returns HTTP500 in Vite dev; z.enum(incoterms) sees undefined in sales.models.ts.
Observed: MES /login and auth API HTTP200; ERP build passed; ERP development imports fail.
Proven static cycle: sales.models -> accounting barrel -> accounting.service -> settings barrel -> settings UI -> ApiKeysForm -> Form barrel -> Customer -> CustomerForm -> sales.models.
Confidence: HIGH for this circular dependency; its contribution to observed enum order must be validated by HTTP reproduction.
Change: import currencyCodes directly from accounting/types.ts. No new enum values, schema, authentication or permission changes.
Verification: HTTP reproduction before and after; focused Biome check; rerun ERP build after source change. Existing dev CLI test suite remains failed due Windows symlink EPERM; do not hide it.
No new standalone BMad install required for upstream environment setup; kit binding records BMad6.12.0/TEA1.27.2.


Results:
- Focused Biome check: PASS (line endings normalized on the changed file; Git diff remains one import line).
- Existing sales.models.test.ts: 10/10 PASS.
- ERP /login: HTTP200 (17,061 bytes) after correcting the currencyCodes import; MES /login: HTTP200.
- Auth health and Studio: HTTP200.
- Final ERP build after source change: exit 0; all 5 Turbo tasks passed (erp-build-final.log).
