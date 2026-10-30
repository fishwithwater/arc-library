/** Rebuild install payloads after editing registry source, preserving Arc's install layout. */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { importSpecifiers, withRelativeImports } from "./registry-install.mjs";

const registry = JSON.parse(await readFile("registry.json", "utf8"));
async function resolveFile(file, specifier) {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return null;
  const base = specifier.startsWith("@/") ? specifier.slice(2) : path.join(path.dirname(file), specifier);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.css`, `${base}.module.css`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
    }
  }
  throw new Error(`${file}: cannot resolve local import ${specifier}`);
}

await mkdir("public/r", { recursive: true });
for (const item of registry.items) {
  const files = [];
  for (const file of item.files) {
    const source = await readFile(file.path, "utf8");
    const content = /\.(?:tsx?|css)$/.test(file.path)
      ? await withRelativeImports(file.path, source, importSpecifiers(file.path, source), specifier => resolveFile(file.path, specifier))
      : source;
    files.push({ ...file, content });
  }
  const built = { $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item, files };
  await writeFile(`public/r/${item.name}.json`, JSON.stringify(built));
}
console.log(`Built ${registry.items.length} registry items.`);
