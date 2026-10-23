# 04: CI build + GitHub Pages deploy

**What to build:** Pushing to `main` or running `workflow_dispatch` checks out the private Vault with a read-only secret, runs copy-mode preparation, builds Quartz, and deploys to `https://ridershoot.github.io/blog-website/`. Vault repository pushes do not trigger this workflow.

**Blocked by:** 01: Content preparation seam + tests; 03: Quartz Site scaffold (Personal blog)

**Status:** ready-for-human

- [x] Workflow runs on `main` push and `workflow_dispatch` only
- [x] CI uses copy-mode preparation against the private Vault via read-only secret
- [ ] Successful run deploys a working Personal blog at the project Pages URL
- [x] No rebuild is wired to Vault push events

## Comments

- Added `.github/workflows/deploy-pages.yml`: `on.push.branches: [main]` + `workflow_dispatch` only (no Vault/`repository_dispatch` triggers). Checks out `ridershoot/Blog` into `vault/` with `secrets.VAULT_READ_TOKEN`, runs `pnpm prepare-content --mode copy`, `pnpm build`, uploads `public/`, then `actions/deploy-pages`. Local branch renamed to `main` to match CI/ADR.
- Live URL proof still needs human: store `VAULT_READ_TOKEN`, set Pages source to GitHub Actions, push/dispatch once — covered by ticket 05 wizard.
