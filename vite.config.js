import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Shared Vite config for portfolio:dev / production build / GitHub Pages.
 * Alias `@ds-assets` → `ds-showcase/assets` (architecture §3.2 / §10.3).
 *
 * GitHub Pages: set `GITHUB_PAGES=1` so `base` is `/MyPortfolio/`.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const pages =
    env.GITHUB_PAGES === "1" || process.env.GITHUB_PAGES === "1";

  return {
    base: pages ? "/MyPortfolio/" : "/",
    resolve: {
      alias: {
        "@ds-assets": path.resolve(rootDir, "ds-showcase/assets"),
      },
    },
    server: {
      fs: {
        allow: [rootDir],
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          portfolio: path.resolve(rootDir, "portfolio/main.html"),
        },
      },
    },
  };
});
