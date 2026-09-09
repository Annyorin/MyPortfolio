/**
 * Copy static assets into dist after `vite build` for GitHub Pages / preview.
 * Runtime img.src and CV links are not bundled by Vite.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(rootDir, "..");
const dist = path.join(repoRoot, "dist");

/**
 * @param {string} src
 * @param {string} dest
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-pages-assets] skip missing: ${src}`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`[copy-pages-assets] ${path.relative(repoRoot, src)} → ${path.relative(repoRoot, dest)}`);
}

if (!fs.existsSync(dist)) {
  console.error("[copy-pages-assets] dist/ missing — run vite build first");
  process.exit(1);
}

copyRecursive(
  path.join(repoRoot, "ds-showcase", "assets"),
  path.join(dist, "ds-showcase", "assets")
);
copyRecursive(
  path.join(repoRoot, "portfolio", "assets"),
  path.join(dist, "portfolio", "assets")
);

const indexHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Аня Ясинская — Продуктовый дизайнер · UX/UI дизайнер</title>
  <link rel="icon" href="ds-showcase/assets/images/avatar.png" type="image/png" sizes="90x90">
  <link rel="apple-touch-icon" href="ds-showcase/assets/images/avatar.png">
  <link rel="canonical" href="portfolio/main.html">
  <meta http-equiv="refresh" content="0; url=portfolio/main.html">
  <script>location.replace("portfolio/main.html" + location.search + location.hash);</script>
</head>
<body>
  <p><a href="portfolio/main.html">Открыть портфолио</a></p>
</body>
</html>
`;
fs.writeFileSync(path.join(dist, "index.html"), indexHtml, "utf8");
console.log("[copy-pages-assets] wrote dist/index.html");
