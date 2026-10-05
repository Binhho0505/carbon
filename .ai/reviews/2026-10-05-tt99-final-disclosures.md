# TT99 disclosure and fiscal-boundary review

Status: DRAFT technical review. Date: 2026-10-05. This is not accountant approval, a statutory release or a compliance certificate.

The B09 save/read/export path preserves company-private document versions, binds them to company, report period and ledger/classification digest, and rejects stale expected digests. Session edits do not qualify as persisted management disclosures. Management and demo CSV are marked against statutory submission. A stored DRAFT never qualifies for standard statutory export; annual scope follows the company's fiscal start month. Source publication does not promote financial content to APPROVED.

The native closing path defaults to the fiscal-year start for its end date, rejects cross-year closing, and separately checks nonzero prior-year Income Statement balances. It does not automatically move prior-year results into 4212 or roll 4212 into 4211. The preview fingerprint includes fiscal settings and prior-year balances.

Article 31 was checked directly in the pinned official part-0 extracted text (`.cc1-agentic/tt99-official-0.txt`, lines 1257–1259; PDF SHA256 in `.ai/docs/fmcg-tt99-source-manifest.json`). TT99 applies to fiscal years beginning on or after 01/01/2026. The native closing guard consequently blocks an explicitly selected January–June 2026 window when it belongs to the July-2025 fiscal year; the July-2026 fiscal year remains eligible. This check does not authorize posting under the previous accounting regime.

Verification: 33 focused closing tests passed, including actual local authenticated fixture/RLS and native PostgreSQL posting triggers inside an always-rolled-back transaction. The integration check confirms balanced Posted journals, zero remaining income/911 closing balances, unchanged B02, unchanged period close statuses, 4212 movement equal to preview result, idempotent repeat and no persisted test journals. Scoped Biome passed. Full ERP typecheck/build/repository publication gates are owned and recorded by the root agent separately.

Earlier read-only disclosure review found no release blocker in company scoping, immutable version creation, digest freshness or DRAFT export boundaries. A document-size metadata observation was forwarded to the owning agent; this review does not assert its final disposition. Interim/non-going-concern forms and human financial-statement approval remain outside the implemented release boundary.
