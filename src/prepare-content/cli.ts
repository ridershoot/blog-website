import path from "node:path";
import { prepareContent } from "./prepare-content.js";

function usage(): never {
  console.error(
    "Usage: prepare-content --vault <path> --content <path> [--homepage-template <path>]",
  );
  process.exit(1);
}

function readFlag(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vaultRoot = readFlag(args, "--vault");
  const contentRoot = readFlag(args, "--content");
  if (!vaultRoot || !contentRoot) usage();

  const homepageTemplate =
    readFlag(args, "--homepage-template") ??
    path.resolve(process.cwd(), "templates/index.md");

  await prepareContent({
    mode: "copy",
    vaultRoot: path.resolve(vaultRoot),
    contentRoot: path.resolve(contentRoot),
    homepageTemplate: path.resolve(homepageTemplate),
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
