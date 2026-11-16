# Quy tắc CI/CD — fork Binhho0505/carbon

Fork của `crbnos/carbon` (ERP + MES + QMS), có thêm: **quy trình kế toán TT99** và **bộ dữ liệu giả lập FMCG tiếng Việt** (`packages/database/src/datasets/data/fmcg`).

## 1. Nơi code và chạy

Carbon chỉ hỗ trợ Linux/macOS (script bash, turbo, supabase). Trên Windows **code và chạy trong WSL Ubuntu**:

| Việc | Ở đâu |
|---|---|
| Thư mục code | `~/src/carbon` trong Ubuntu-24.04 (mở bằng VS Code: `code ~/src/carbon` trong Ubuntu, hoặc *Remote-WSL*) |
| Chạy local | `pnpm dev` → ERP http://localhost:3000, MES http://localhost:3001, API http://localhost:54321 |
| Docker | Backend (Postgres, auth, storage, realtime, Inngest, Redis…) do `pnpm dev` dựng trong Docker Desktop, tách riêng compose project của Carbon |

Không build/chạy Carbon từ thư mục Windows (`C:\Users\...\carbon`): Git trên Windows đổi xuống dòng sang CRLF làm hỏng script và test mã băm migration.

## 2. Nhánh

| Nhánh | Vai trò | Quy tắc |
|---|---|---|
| `main` | Bản chạy được, luôn xanh CI. Máy local chạy theo nhánh này | **Không commit thẳng.** Chỉ nhận qua Pull Request đã qua CI |
| `tt99/<mo-ta>` | Kế toán TT99, báo cáo, hệ thống tài khoản | Tách từ `main` |
| `demo/<mo-ta>` | Dữ liệu giả lập (FMCG…) | Tách từ `main` |
| `feature/<mo-ta>`, `fix/<mo-ta>` | Việc khác | Tách từ `main` |
| `sync/upstream-YYYY-MM-DD` | Ghép bản mới của dự án gốc | Xử lý xung đột, PR vào `main` |

## 3. Commit

- **Conventional Commits**: `feat(accounting): ...`, `fix(datasets): ...`, `chore:`, `ci:`, `docs:`.
- Không commit `.env`, `.env.local`, khóa API, dữ liệu khách hàng thật.
- Đổi cấu trúc dữ liệu giả lập → phải chạy `pnpm --filter @carbon/database exec vitest run src/datasets` trước khi đẩy.

## 4. Pull Request → `main`

1. `git push -u origin <nhánh>`
2. `gh pr create --base main --repo Binhho0505/carbon` (PR vào **fork**, không phải repo gốc)
3. **Fork CI** phải xanh: Lint, typecheck (`@carbon/database`, ERP), test dữ liệu giả lập, test phân quyền, test hạch toán thuế GTGT đầu vào, build image ERP + MES.
4. Tự review diff → **Squash merge** (riêng PR `sync/upstream-*` dùng **Merge commit** để giữ lịch sử bản gốc).

Khuyến nghị bật Branch protection cho `main`: bắt buộc PR + bắt buộc check `Fork CI`.

## 5. CD — đưa code mới về máy local

Sau khi PR được merge vào `main`:

```powershell
C:\Users\Admin\source\repos\_ops\deploy-local.ps1 -Project carbon
```

Script chỉ chạy khi CI của commit mới nhất trên `main` đã xanh, rồi trong Ubuntu: `git pull --ff-only` → `pnpm install` → khởi động lại `pnpm dev`, chờ ERP phản hồi ở cổng 3000.

## 6. Đồng bộ với dự án gốc (mỗi 1–2 tuần)

```bash
git fetch upstream
git switch -c sync/upstream-$(date +%F) origin/main
git merge upstream/main
# Ưu tiên giữ: TT99 (invoicing.service, AccountDefaultsForm), datasets/fmcg, datasets/index.ts + types.ts (khóa "fmcg")
pnpm --filter @carbon/database exec tsc --noEmit -p . && pnpm --filter @carbon/database exec vitest run src/datasets
git push -u origin HEAD && gh pr create --base main
```

## 7. Các workflow của dự án gốc

`deploy.yml`, `build-images.yml`, `supabase.yml`, `functions.yml`… cần secret/hạ tầng của Carbon → **tắt trên fork**, chỉ giữ `fork-ci.yml`.

## 8. Giấy phép

AGPL-3.0: fork phải công khai; muốn để riêng tư cần giấy phép thương mại của Carbon.
