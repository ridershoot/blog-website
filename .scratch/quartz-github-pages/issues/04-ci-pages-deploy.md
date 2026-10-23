# 04: CI build + GitHub Pages deploy

**What to build:** Pushing to `main` or running `workflow_dispatch` checks out the private Vault with a read-only secret, runs copy-mode preparation, builds Quartz, and deploys to `https://ridershoot.github.io/blog-website/`. Vault repository pushes do not trigger this workflow.

**Blocked by:** 01: Content preparation seam + tests; 03: Quartz Site scaffold (Personal blog)

**Status:** ready-for-agent

- [ ] Workflow runs on `main` push and `workflow_dispatch` only
- [ ] CI uses copy-mode preparation against the private Vault via read-only secret
- [ ] Successful run deploys a working Personal blog at the project Pages URL
- [ ] No rebuild is wired to Vault push events
