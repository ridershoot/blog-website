# 03: Quartz Site scaffold (Personal blog)

**What to build:** The Site repo runs default Quartz configured as the Personal blog (title 「个人博客」, zh-CN, project Pages base path for `ridershoot.github.io/blog-website`). After content preparation from ticket 01, local preview shows Publishable content.

**Blocked by:** 01: Content preparation seam + tests

**Status:** done

- [x] Quartz initializes and builds successfully in the Site repo with default theme/plugins
- [x] Site title is 「个人博客」 and language is zh-CN
- [x] Base path matches the GitHub project Pages URL subdirectory
- [x] Local preview works once the content tree is prepared

## Comments

- Scaffolded Quartz 5 into the Site repo (default template/plugins). Config: `pageTitle: 个人博客`, `locale: zh-CN`, `baseUrl: ridershoot.github.io/blog-website`. CNAME emitter disabled (project Pages, not a custom domain). `quartz/util/glob.ts` ignores `.gitignore` so prepared `content/` can build while staying untracked. Scripts: `pnpm build`, `pnpm preview` (`--baseDir blog-website`). Verified: link-mode prepare from Vault → build (33 md) → preview at `http://localhost:8080/blog-website` with title/lang/basepath in HTML.
