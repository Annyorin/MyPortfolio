import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.js"],
  addons: [],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias || {}),
      "@ds-assets": path.resolve(dirname, "../ds-showcase/assets"),
    };
    return viteConfig;
  },
};

export default config;
