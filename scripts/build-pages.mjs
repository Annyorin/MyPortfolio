/**
 * Production build with GitHub Pages base `/MyPortfolio/`.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env, GITHUB_PAGES: "1" };

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["vite", "build"]);
run("node", ["scripts/copy-pages-assets.mjs"]);
