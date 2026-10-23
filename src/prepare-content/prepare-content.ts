import { cp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

/** Top-level Vault folders that may appear as Publishable content. */
export const PUBLISHABLE_TOP_LEVEL = ["学习", "日常", "assets"] as const;

export type PrepareContentOptions = {
	mode: "copy" | "link";
	vaultRoot: string;
	contentRoot: string;
	homepageTemplate: string;
};

export async function prepareContent(options: PrepareContentOptions): Promise<void> {
	await rm(options.contentRoot, { recursive: true, force: true });
	await mkdir(options.contentRoot, { recursive: true });

	for (const name of PUBLISHABLE_TOP_LEVEL) {
		const source = path.join(options.vaultRoot, name);
		const destination = path.join(options.contentRoot, name);
		if (options.mode === "link") {
			await symlink(source, destination, "dir");
		} else {
			await cp(source, destination, { recursive: true });
		}
	}

	const homepage = await readFile(options.homepageTemplate, "utf8");
	await writeFile(path.join(options.contentRoot, "index.md"), homepage);
}
