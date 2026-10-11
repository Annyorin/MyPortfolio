/** Compute once, then share the version with Vite and the static copy stage. */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAssetVersion } from "./asset-version.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env, VITE_ASSET_VERSION: getAssetVersion() };

for (const args of [
  ["node_modules/vite/bin/vite.js", "build"],
  ["scripts/copy-pages-assets.mjs"],
]) {
  const result = spawnSync(process.execPath, args, { cwd: repoRoot, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
