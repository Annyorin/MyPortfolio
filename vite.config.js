import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite `/` is not a page — send people to the portfolio entry.
 * @returns {import("vite").Plugin}
 */
function redirectRootToPortfolio() {
  /**
   * @param {import("vite").ViteDevServer | import("vite").PreviewServer} server
   */
  function attach(server) {
    server.middlewares.use((req, res, next) => {
      const pathOnly = String(req.url || "").split("?")[0];
      if (pathOnly !== "/" && pathOnly !== "/index.html") {
        next();
        return;
      }
      const base = String(server.config.base || "/").replace(/\/?$/, "/");
      res.statusCode = 302;
      res.setHeader("Location", `${base}portfolio/index.html`);
      res.end();
    });
  }

  return {
    name: "redirect-root-to-portfolio",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

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
    plugins: [redirectRootToPortfolio()],
    resolve: {
      alias: {
        "@ds-assets": path.resolve(rootDir, "ds-showcase/assets"),
      },
    },
    server: {
      fs: {
        allow: [rootDir],
      },
      // Windows often locks files under .tmp-frames; watching them crashes Vite (EBUSY).
      watch: {
        ignored: ["**/.tmp-frames/**", "**/.tmp-macbook-assets/**"],
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          portfolio: path.resolve(rootDir, "portfolio/index.html"),
          caseDragon: path.resolve(rootDir, "portfolio/case-dragon.html"),
          casePhish: path.resolve(rootDir, "portfolio/case-phish.html"),
        },
      },
    },
  };
});
