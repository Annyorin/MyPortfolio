import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Shared Vite config for portfolio:dev and alias parity with Storybook.
 * Alias `@ds-assets` → `ds-showcase/assets` (architecture §3.2 / §10.3).
 */
export default defineConfig({
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
});
