# Local content setup (link mode)

Local preview uses **link mode**: the Site `content/` tree gets directory symlinks to the Vault’s Publishable content tops (`学习/`, `日常/`, `assets/`), beside a Site-owned `index.md`. The same whitelist is used in CI **copy mode**. Browsing the deployed Personal blog does not require any local links.

`content/` (including symlinks) is gitignored and must not be committed.

## macOS / Linux

Preferred: from the Site repo root, point `--vault` at your local Vault clone:

```bash
pnpm prepare-content --mode link --vault /path/to/Blog --content content
```

Manual equivalent (whitelist tops only; keep a Site-owned `content/index.md` beside them):

```bash
mkdir -p content
ln -s /path/to/Blog/学习 content/学习
ln -s /path/to/Blog/日常 content/日常
ln -s /path/to/Blog/assets content/assets
# then copy or write Site templates/index.md → content/index.md
```

Then run Quartz preview as documented once Quartz is scaffolded.

## Windows

Creating directory symlinks on Windows needs either:

1. **Developer Mode** enabled (**Settings → System → For developers → Developer Mode**), or
2. An **elevated** PowerShell / Command Prompt (Run as administrator).

Preferred: run the Node CLI (same flags as macOS/Linux) or the helper script from the Site repo root:

```powershell
# Developer Mode, or elevated shell
.\scripts\prepare-content-link.ps1 -VaultPath "C:\path\to\Blog"
```

The script calls `pnpm prepare-content --mode link` so whitelist and homepage behavior stay identical to macOS/Linux.

Manual equivalents (whitelist tops only):

```powershell
# PowerShell (Developer Mode or elevated)
New-Item -ItemType SymbolicLink -Path "content\学习" -Target "C:\path\to\Blog\学习"
New-Item -ItemType SymbolicLink -Path "content\日常" -Target "C:\path\to\Blog\日常"
New-Item -ItemType SymbolicLink -Path "content\assets" -Target "C:\path\to\Blog\assets"
```

```bat
REM Elevated cmd.exe
mklink /D content\学习 C:\path\to\Blog\学习
mklink /D content\日常 C:\path\to\Blog\日常
mklink /D content\assets C:\path\to\Blog\assets
```

If symlink creation fails with a privilege error, enable Developer Mode or re-run in an elevated shell—do not fall back to copying the whole Vault into `content/` for local preview.
