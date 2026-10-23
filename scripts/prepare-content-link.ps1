# Requires Developer Mode or an elevated shell so Node can create directory symlinks.
# Usage (from Site repo root):
#   .\scripts\prepare-content-link.ps1 -VaultPath "C:\path\to\Blog"

param(
	[Parameter(Mandatory = $true)]
	[string]$VaultPath,
	[string]$ContentPath = "content"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path -LiteralPath $VaultPath)) {
	Write-Error "Vault path not found: $VaultPath"
}

Write-Host "Preparing content in link mode (Developer Mode or elevated shell required on Windows)..."
pnpm prepare-content --mode link --vault $VaultPath --content $ContentPath
if ($LASTEXITCODE -ne 0) {
	Write-Error @"
prepare-content failed (exit $LASTEXITCODE).
If the error mentions privileges or symbolic links, enable Developer Mode
(Settings → System → For developers) or re-run this script in an elevated PowerShell.
"@
}

Write-Host "Done. Whitelist tops under '$ContentPath' are directory symlinks into the Vault."
