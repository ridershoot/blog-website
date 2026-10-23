# Quartz + GitHub Pages personal blog

Status: ready-for-agent

## Problem Statement

The owner writes notes in an Obsidian Vault on desktop, but often only has a phone or another machine and still wants to read those notes in a browser. There is no always-on web surface for Publishable content today; copying notes by hand or opening the private Vault remotely is awkward.

## Solution

A public Personal blog Site built with Quartz, deployed to GitHub Pages at the project URL. The private Vault remains the Source of truth for notes. The Site repo holds Quartz config and deploy only. Locally, Publishable content is prepared into Quartz’s content tree via symlinks; in CI, the same whitelist is copied from the Vault using a read-only secret. Rebuilds run on Site pushes or manual workflow dispatch—not on every Vault sync.

## User Stories

1. As the owner on a phone, I want to open a public HTTPS URL for the Personal blog, so that I can read Publishable content without Obsidian.
2. As the owner on a Mac or Windows PC, I want the same URL to work in a desktop browser, so that I am not locked to one device.
3. As the owner, I want the site titled 「个人博客」 and presented in zh-CN, so that the surface matches how I think about it.
4. As the owner, I want a Site-owned homepage that briefly explains the blog and points into the note tree, so that visitors (including me) land somewhere intentional.
5. As the owner writing in Obsidian, I want `学习/` notes to appear on the Site after a deploy, so that study notes are readable on the go.
6. As the owner writing in Obsidian, I want `日常/` notes to appear on the Site after a deploy, so that practical notes are available remotely.
7. As the owner, I want Vault `assets/` needed by Publishable content to resolve on the Site, so that images and attachments are not broken.
8. As the owner, I want `journals/` never published, so that diary content stays out of the public Personal blog.
9. As the owner, I want `template/` never published, so that scaffolding notes are not mistaken for real content.
10. As the owner, I want `.obsidian/` never published or shipped in Site git, so that editor config and plugins stay private and local.
11. As the owner, I want the Vault to remain a separate private GitHub repository, so that the full note corpus is not exposed as a public git history.
12. As the owner, I want the Site repository to be public for free GitHub Pages, so that hosting stays simple and cheap.
13. As the owner, I want Publishable content never committed into the Site repository, so that private Vault text does not leak into the public repo.
14. As the owner developing on Mac, I want local symlinks from the content tree to the Vault whitelist, so that I maintain one copy of notes while previewing Quartz.
15. As the owner developing on Windows, I want an equivalent symlink setup script (Developer Mode or elevated `mklink` / PowerShell), so that local preview works on my non-Mac machine.
16. As the owner browsing only the deployed Personal blog, I want no requirement to create symlinks, so that reading on mobile never depends on local Site setup.
17. As CI, I want to check out the private Vault with a read-only secret and copy the whitelist into the content tree, so that builds do not rely on machine-local symlinks.
18. As the owner, I want the same whitelist rules for local link mode and CI copy mode, so that preview and production do not diverge on what is publishable.
19. As the owner, I want content preparation to be the single automated test seam, so that regressions in publish filtering are caught without testing Quartz internals.
20. As the owner, I want `quartz build` (or the project’s documented build command) to succeed after content preparation, so that a static site artifact exists for deploy.
21. As the owner, I want GitHub Pages to serve the Site at `https://ridershoot.github.io/blog-website/`, so that the URL is stable and bookmarkable.
22. As the implementer, I want Quartz `baseUrl` (or equivalent) set for that project Pages path, so that asset and link paths work off the subdirectory.
23. As the owner, I want a GitHub Actions workflow that builds and deploys on push to `main`, so that Site config changes go live automatically.
24. As the owner, I want `workflow_dispatch` on that workflow, so that I can refresh the Personal blog after Vault edits without changing Site code.
25. As the owner, I do not want Vault pushes to auto-trigger Site builds, so that Obsidian Git’s ~1-minute auto-sync does not thrash CI.
26. As the owner, I want first-version Quartz default theme and plugins, so that shipping is not blocked on visual customization.
27. As the owner, I want the Site default branch to be `main`, so that it matches the Vault and CI conventions.
28. As the owner setting up for the first time, I want clear steps (including a human wizard later) to add the Vault read secret, so that private checkout works in Actions.
29. As the owner, I want wikilinks and normal Markdown from Publishable content to render via Quartz’s defaults, so that Obsidian-flavored notes remain readable on the web.
30. As a future maintainer, I want ADR-0001 and glossary terms respected, so that dual-repo and symlink/copy choices are not “fixed” away casually.
31. As the owner, I want local `content/` (including symlinks) gitignored, so that accidental commits of Vault material are hard.
32. As the owner after changing only Vault notes, I want a documented “run workflow_dispatch” habit, so that I know when the phone will see updates.
33. As the owner, I want excluded paths absent from the prepared content tree in copy mode even if present in the Vault fixture, so that filtering is enforceable in tests.
34. As the owner, I want link mode to create directory symlinks only for whitelist tops (plus keep Site-owned homepage file), so that journals cannot appear via a whole-Vault link by mistake.

## Implementation Decisions

- Dual repository: Vault = Source of truth for notes (private); Site = Quartz + GitHub Pages (public). Per ADR-0001.
- Publishable content whitelist: `学习/`, `日常/`, and `assets/` as used by those notes; exclude `journals/`, `template/`, `.obsidian/`.
- Single content-preparation seam with two modes: `link` (local symlinks) and `copy` (CI materialization from a Vault root). Same whitelist for both.
- Site-owned homepage file lives in the content tree and is not replaced by a Vault symlink; whitelist folders are linked or copied beside it.
- Quartz initialized in the Site repo with defaults; configure Personal blog title 「个人博客」, language zh-CN, and project Pages base path for `ridershoot.github.io/blog-website`.
- `content/` tree (prepared output and symlinks) is not tracked in git.
- CI: on `main` push and `workflow_dispatch`, authenticate to private Vault with a read-only secret, run copy-mode preparation, build Quartz, deploy to GitHub Pages.
- No rebuild trigger from Vault repository events in v1.
- Default branch for the Site remote and CI is `main`.
- Windows symlink support is part of the local setup story (script + short docs), not a separate product feature.
- Secrets and GitHub Pages UI enablement are human-in-the-loop (`/wizard` when implementing), not inventible by the agent alone.
- Automated tests target only content preparation external behavior (resulting tree shape / exclusions / homepage presence), not Quartz or Actions internals.

## Testing Decisions

- A good test asserts observable results of content preparation only: which top-level paths exist under the prepared content tree, that excluded Vault areas are absent in copy mode, and that the Site-owned homepage is present. It does not assert Quartz plugin graphs, HTML snapshots of the whole site, or GitHub API deploy status.
- The module under test is the content-preparation entrypoint (link/copy over a whitelist). Prefer a temporary fixture Vault directory as input.
- Prior art: none in this repo yet (greenfield Site); establish the first small fixture-based tests beside that entrypoint.
- Manual acceptance: local Quartz preview after link mode; one successful Actions deploy after secrets are set; phone browser open of the project Pages URL.

## Out of Scope

- Publishing `journals/`, `template/`, or selective per-note frontmatter/tag gates beyond the folder whitelist.
- Auto-deploy on every Vault push or Obsidian Git sync.
- Custom domains, `ridershoot.github.io` user-site repo, or private GitHub Pages.
- Custom Quartz themes, heavy plugin customization, search/analytics/telemetry, auth/paywall.
- Merging Vault and Site into one repository; git submodules as the primary sync mechanism.
- Editing notes on the Personal blog (read-only surface).
- Guaranteeing Windows Developer Mode is already enabled (document and script only).
- Migrating or rewriting existing Vault note structure.

## Further Notes

- Glossary terms to prefer: Vault, Site, Publishable content, Source of truth, Personal blog.
- Governing ADR: dual repo, local symlink vs CI copy, Windows symlink caveat, deploy triggers.
- After this spec: `/to-tickets` should split tracer bullets (scaffold Quartz → content preparation + tests → local link scripts → CI/Pages → human secret/Pages wizard).
- Owner habit: after Vault-only edits, run `workflow_dispatch` when the phone should see fresh content.
