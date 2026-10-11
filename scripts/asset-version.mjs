import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

export const COPIED_ASSET_PATHS = Object.freeze(["ds-showcase/assets", "portfolio/assets"]);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Stable across build stages; local fallback hashes only the copied inputs. */
export function getAssetVersion(env = process.env, root = repoRoot) {
  const explicit = String(env.VITE_ASSET_VERSION || "").trim();
  const sha = String(env.GITHUB_SHA || "").trim();
  if (explicit || sha) return explicit || sha;

  const hash = createHash("sha256");
  const buffer = Buffer.alloc(64 * 1024);
  function visit(relative) {
    const absolute = path.join(root, relative);
    hash.update(`${relative}\0`);
    if (!fs.existsSync(absolute)) {
      hash.update("missing\0");
      return;
    }
    if (fs.statSync(absolute).isDirectory()) {
      for (const name of fs.readdirSync(absolute).sort()) visit(`${relative}/${name}`);
      return;
    }
    hash.update(`${fs.statSync(absolute).size}\0`);
    const fd = fs.openSync(absolute, "r");
    try {
      let count;
      while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) {
        hash.update(buffer.subarray(0, count));
      }
    } finally {
      fs.closeSync(fd);
    }
  }
  COPIED_ASSET_PATHS.forEach(visit);
  return hash.digest("hex").slice(0, 20);
}
