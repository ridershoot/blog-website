# 02: Local link mode (macOS + Windows)

**What to build:** The same whitelist can be prepared in link mode so local Obsidian and Quartz share one note copy via directory symlinks. macOS/Linux and Windows each have a working setup path; prepared content (including symlinks) is not committed to the Site repo. Browsing the deployed Personal blog still requires no local links.

**Blocked by:** 01: Content preparation seam + tests

**Status:** ready-for-agent

- [x] Link mode creates directory symlinks for whitelist tops beside the Site-owned homepage
- [x] Windows symlink setup is scripted or documented (Developer Mode or elevated commands)
- [x] Prepared content tree remains untracked by git
- [x] Link and copy modes share the same Publishable content whitelist

## Comments

- Extended `prepareContent` with `mode: "link"` using shared `PUBLISHABLE_TOP_LEVEL`. CLI `--mode copy|link`. Fixture tests assert directory symlinks, homepage file, and exclusions. Windows: `scripts/prepare-content-link.ps1` + `docs/local-setup.md` (Developer Mode / elevated, plus `ln -s` / `mklink` / `New-Item` manual examples). `content/` already gitignored.
