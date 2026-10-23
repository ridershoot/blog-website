# 05: Human setup wizard (Secret + Pages)

**What to build:** A guided human-only path to add the Vault read secret, enable GitHub Pages for the Site, and verify the Personal blog opens on a phone. Steps the agent cannot perform are concentrated here.

**Blocked by:** 04: CI build + GitHub Pages deploy

**Status:** ready-for-human

- [x] Owner can follow the wizard to create/store the Vault read-only secret
- [x] Owner can enable GitHub Pages for the public Site repo as required
- [x] Owner can confirm the live URL loads Publishable content on mobile

## Comments

- Added `scripts/setup-pages-wizard.sh` (wizard template library + 5 stages): ensure Site remote, create fine-grained Vault Contents:Read token → `VAULT_READ_TOKEN` (.env + `gh secret set`), Pages Source = GitHub Actions, first deploy, confirm `https://ridershoot.github.io/blog-website/`. Linked from `docs/local-setup.md`. `.env` gitignored.
- Run from Site repo root: `bash scripts/setup-pages-wizard.sh`. Agent cannot complete the browser/secret steps; owner must run the wizard once.
