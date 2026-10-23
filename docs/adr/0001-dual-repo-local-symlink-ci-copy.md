# Dual repo: local symlinks, CI copy from private Vault

The Vault (`ridershoot/Blog`, private) stays the source of truth for notes; this Site repo owns Quartz config and GitHub Pages deploy. Publishable content is `学习/`, `日常/`, and needed `assets/` only.

Locally, those paths are symlinked into `content/` so Obsidian and Quartz share one copy. CI never uses machine-local symlinks: it checks out the Vault with a read-only secret and copies the same whitelist into `content/` before build. `content/` (including symlinks) is not committed, so private notes never enter this (public) repo’s git history.

**Windows:** creating symlinks needs Developer Mode or an elevated shell. Document and script both `ln -s` (macOS/Linux) and an equivalent Windows path (e.g. `mklink /D` or `New-Item -ItemType SymbolicLink`) so a non-Mac machine can set up local preview the same way. Browsing the deployed site does not require symlinks.

Deploy only on push to this repo or manual `workflow_dispatch`. Do not rebuild on every Vault push: Obsidian Git auto-sync can fire about once a minute and would thrash CI.
