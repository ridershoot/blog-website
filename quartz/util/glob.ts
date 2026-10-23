import path from "path"
import { FilePath } from "./path"
import { globby } from "globby"

export function toPosixPath(fp: string): string {
  return fp.split(path.sep).join("/")
}

export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: string[],
): Promise<FilePath[]> {
  // Site keeps prepared `content/` gitignored so Vault material is never committed.
  // Respect only Quartz ignorePatterns here; do not apply .gitignore or the tree is empty.
  const fps = (
    await globby(pattern, {
      cwd,
      ignore: ignorePatterns,
      gitignore: false,
    })
  ).map(toPosixPath)
  return fps as FilePath[]
}
