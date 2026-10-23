# 01: Content preparation seam + tests

**What to build:** Given a Vault root and the Publishable content whitelist, copy-mode preparation produces a content tree that includes `学习/`, `日常/`, and needed `assets/`, keeps a Site-owned homepage, and never includes `journals/`, `template/`, or `.obsidian/`. Fixture tests assert only that external tree shape.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Copy mode materializes only the Publishable content whitelist from a fixture Vault
- [x] Excluded Vault areas are absent from the prepared tree in copy mode
- [x] Site-owned homepage is present after preparation
- [x] Automated tests cover the content-preparation seam’s external behavior only

## Comments

- Implemented `prepareContent({ mode: "copy", ... })` in `src/prepare-content/`. Whitelist tops (`学习/`, `日常/`, `assets/`) are copied whole; content root is cleared first so stale excluded paths cannot linger. Site homepage is written from `templates/index.md`. Fixture tests cover top-level tree shape, nested whitelist files, exclusion absence (including pre-existing junk), and homepage template contents. CLI: `pnpm prepare-content --vault <path> --content <path>`.
