# blog-website

Personal static site that publishes a filtered slice of an Obsidian vault to the web.

## Language

**Vault**:
The Obsidian note repository at `Blog` (`ridershoot/Blog`). It is the source of truth for note content.
_Avoid_: notebook, knowledge base, content repo (when referring to the notes themselves)

**Site**:
The Quartz project in this repository that builds and hosts the public HTML.
_Avoid_: blog, website repo (when referring to the running pages)

**Publishable content**:
The subset of the Vault that may appear on the Site: currently `学习/`, `日常/`, and assets they reference. Excludes `journals/`, `template/`, and `.obsidian/`.
_Avoid_: all notes, the whole vault

**Source of truth**:
Where a given kind of data is edited and from which other copies are derived. For notes, that is the Vault; for Site config and deploy, that is this repository.
_Avoid_: master copy, canonical store

**Personal blog**:
The public name of the Site (page title / brand string). It is a personal reading surface for Publishable content, not a separate editorial product.
_Avoid_: 学习笔记 (as the site title), knowledge base site
