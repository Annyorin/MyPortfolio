/**
 * Resolves a Content Map asset key to a URL for the current entry.
 * Shared Content Map stores only AssetRef.pathFromDsRoot (no entry-relative paths).
 *
 * Note: Vite's `@ds-assets` resolve.alias (see vite.config.js / .storybook) works for
 * JS `import`, not for runtime `img.src` / CSS `url()`. In the browser we therefore
 * emit a real HTTP path under `/ds-showcase/assets/…` (repo root = Vite root).
 */

import { contentMap } from "../../shared/content.js";

/** Documented Vite alias name (imports only; not used as img.src). */
const DS_ASSETS_ALIAS = "@ds-assets";
void DS_ASSETS_ALIAS;

const DS_ASSETS_REPO_PREFIX = "ds-showcase/assets/";
const DS_ASSETS_BROWSER_PREFIX = "/ds-showcase/assets/";

/**
 * Detects whether the runtime prefers the Vite/Storybook alias or a repo-root path.
 *
 * @returns {"alias" | "repo"}
 */
function detectResolveMode() {
  // Vite / Storybook browser builds expose import.meta.env.
  try {
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      (import.meta.env.DEV === true ||
        import.meta.env.PROD === true ||
        typeof import.meta.env.MODE === "string")
    ) {
      return "alias";
    }
  } catch {
    // ignore — fall through to repo path
  }

  return "repo";
}

/**
 * Builds a URL from pathFromDsRoot for the given mode.
 *
 * @param {string} pathFromDsRoot
 * @param {"alias" | "repo"} mode
 * @returns {string}
 */
function buildUrl(pathFromDsRoot, mode) {
  const relative = String(pathFromDsRoot).replace(/^\/+/, "");
  if (mode === "alias") {
    // Browser-loadable path (img.src / CSS url). Alias string is not fetchable.
    return `${DS_ASSETS_BROWSER_PREFIX}${relative}`;
  }
  return `${DS_ASSETS_REPO_PREFIX}${relative}`;
}

/**
 * Resolves AssetRef from contentMap.assets to a usable URL string.
 * Unknown keys log a warning and return a safe non-throwing fallback.
 *
 * @param {string} key
 * @param {{ mode?: "alias" | "repo" }} [options]
 * @returns {string}
 */
export function resolveAsset(key, options = {}) {
  const assets = contentMap?.assets;
  const ref = assets && typeof assets === "object" ? assets[key] : undefined;
  const pathFromDsRoot =
    ref && typeof ref.pathFromDsRoot === "string" ? ref.pathFromDsRoot.trim() : "";

  if (!pathFromDsRoot) {
    console.warn(`[resolveAsset] unknown or empty asset key: ${String(key)}`);
    return DS_ASSETS_BROWSER_PREFIX;
  }

  const mode = options.mode ?? detectResolveMode();
  return buildUrl(pathFromDsRoot, mode);
}
