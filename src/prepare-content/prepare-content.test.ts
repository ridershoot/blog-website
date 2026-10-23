import {
	lstat,
	mkdtemp,
	mkdir,
	readFile,
	readdir,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PUBLISHABLE_TOP_LEVEL, prepareContent } from "./prepare-content.js";

const HOMEPAGE_TEMPLATE = path.resolve(import.meta.dirname, "../../templates/index.md");

async function seedVault(vaultRoot: string): Promise<void> {
	await mkdir(path.join(vaultRoot, "学习"), { recursive: true });
	await mkdir(path.join(vaultRoot, "日常"), { recursive: true });
	await mkdir(path.join(vaultRoot, "assets"), { recursive: true });
	await mkdir(path.join(vaultRoot, "journals"), { recursive: true });
	await mkdir(path.join(vaultRoot, "template"), { recursive: true });
	await mkdir(path.join(vaultRoot, ".obsidian"), { recursive: true });

	await writeFile(path.join(vaultRoot, "学习", "note.md"), "# study\n");
	await writeFile(path.join(vaultRoot, "日常", "note.md"), "# daily\n");
	await writeFile(path.join(vaultRoot, "assets", "img.png"), "png");
	await writeFile(path.join(vaultRoot, "journals", "secret.md"), "# journal\n");
	await writeFile(path.join(vaultRoot, "template", "t.md"), "# template\n");
	await writeFile(path.join(vaultRoot, ".obsidian", "app.json"), "{}");
}

describe("prepareContent copy mode", () => {
	let vaultRoot: string;
	let contentRoot: string;

	beforeEach(async () => {
		vaultRoot = await mkdtemp(path.join(tmpdir(), "vault-"));
		contentRoot = await mkdtemp(path.join(tmpdir(), "content-"));
		await seedVault(vaultRoot);
	});

	afterEach(async () => {
		await rm(vaultRoot, { recursive: true, force: true });
		await rm(contentRoot, { recursive: true, force: true });
	});

	async function runCopy(): Promise<void> {
		await prepareContent({
			mode: "copy",
			vaultRoot,
			contentRoot,
			homepageTemplate: HOMEPAGE_TEMPLATE,
		});
	}

	it("materializes only the Publishable content whitelist", async () => {
		await runCopy();

		const entries = await readdir(contentRoot);
		expect(entries.sort()).toEqual(["assets", "index.md", "学习", "日常"].sort());
		await expect(readFile(path.join(contentRoot, "学习", "note.md"), "utf8")).resolves.toBe(
			"# study\n"
		);
		await expect(readFile(path.join(contentRoot, "日常", "note.md"), "utf8")).resolves.toBe(
			"# daily\n"
		);
		await expect(readFile(path.join(contentRoot, "assets", "img.png"), "utf8")).resolves.toBe(
			"png"
		);
	});

	it("keeps excluded Vault areas out of the prepared tree", async () => {
		await mkdir(path.join(contentRoot, "journals"), { recursive: true });
		await writeFile(path.join(contentRoot, "journals", "stale.md"), "stale");

		await runCopy();

		const entries = new Set(await readdir(contentRoot));
		expect(entries.has("journals")).toBe(false);
		expect(entries.has("template")).toBe(false);
		expect(entries.has(".obsidian")).toBe(false);
	});

	it("writes the Site-owned homepage from the Site template", async () => {
		await runCopy();

		const expected = await readFile(HOMEPAGE_TEMPLATE, "utf8");
		const actual = await readFile(path.join(contentRoot, "index.md"), "utf8");
		expect(actual).toBe(expected);
	});
});

describe("prepareContent link mode", () => {
	let vaultRoot: string;
	let contentRoot: string;

	beforeEach(async () => {
		vaultRoot = await mkdtemp(path.join(tmpdir(), "vault-"));
		contentRoot = await mkdtemp(path.join(tmpdir(), "content-"));
		await seedVault(vaultRoot);
	});

	afterEach(async () => {
		await rm(contentRoot, { recursive: true, force: true });
		await rm(vaultRoot, { recursive: true, force: true });
	});

	async function runLink(): Promise<void> {
		await prepareContent({
			mode: "link",
			vaultRoot,
			contentRoot,
			homepageTemplate: HOMEPAGE_TEMPLATE,
		});
	}

	it("creates directory symlinks for whitelist tops beside the Site-owned homepage", async () => {
		await runLink();

		const entries = await readdir(contentRoot);
		expect(entries.sort()).toEqual(["assets", "index.md", "学习", "日常"].sort());

		const expectedFiles: Record<(typeof PUBLISHABLE_TOP_LEVEL)[number], { file: string; body: string }> = {
			学习: { file: "note.md", body: "# study\n" },
			日常: { file: "note.md", body: "# daily\n" },
			assets: { file: "img.png", body: "png" },
		};

		for (const name of PUBLISHABLE_TOP_LEVEL) {
			const linkPath = path.join(contentRoot, name);
			const stat = await lstat(linkPath);
			expect(stat.isSymbolicLink()).toBe(true);
			await expect(realpath(linkPath)).resolves.toBe(await realpath(path.join(vaultRoot, name)));
			const { file, body } = expectedFiles[name];
			await expect(readFile(path.join(linkPath, file), "utf8")).resolves.toBe(body);
		}

		const homepageStat = await lstat(path.join(contentRoot, "index.md"));
		expect(homepageStat.isSymbolicLink()).toBe(false);
		const expected = await readFile(HOMEPAGE_TEMPLATE, "utf8");
		await expect(readFile(path.join(contentRoot, "index.md"), "utf8")).resolves.toBe(expected);
	});

	it("does not link excluded Vault areas into the prepared tree", async () => {
		await mkdir(path.join(contentRoot, "journals"), { recursive: true });
		await writeFile(path.join(contentRoot, "journals", "stale.md"), "stale");

		await runLink();

		const entries = new Set(await readdir(contentRoot));
		expect(entries.has("journals")).toBe(false);
		expect(entries.has("template")).toBe(false);
		expect(entries.has(".obsidian")).toBe(false);
	});
});
