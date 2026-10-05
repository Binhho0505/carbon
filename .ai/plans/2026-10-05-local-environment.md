# Local Carbon environment — 2026-10-05
Status: LOCAL_READY
Scope: fork crbnos/carbon into authenticated personal account; local development setup only.
Source: upstream commit d4fd55db19344a4d2a6d84352a41f0b61fc77616 (shallow checkout).
Odoo alignment: N/A — independent upstream environment setup; no CC1 integration, business-field design or ERP mapping changes.
- [x] Create fork https://github.com/Binhho0505/carbon
- [x] Checkout D:/Code/carbon; origin fork; upstream crbnos/carbon
- [x] Read repository instructions and bind cc1-agentic-build method
- [x] Prepare pinned pnpm 10.33.4 and ignored .env template
- [x] Install frozen dependencies using Git Bash; preserve lockfile
- [x] Install/verify Docker engine; report system prerequisites accurately
- [x] Run relevant dev tests/build and verify actual loopback endpoints (CLI suite retains documented Windows symlink failure; Sales tests and final build passed)
Subsequent user instruction on 2026-10-05: commit and push to Binhho0505/carbon. No production deployment. Git hooks remain unactivated pending verified activation.
