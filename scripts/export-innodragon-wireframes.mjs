/**
 * Export InnoDragon notification wireframe frames to PNG for portfolio.
 * Usage: node scripts/export-innodragon-wireframes.mjs
 */
import { chromium } from "playwright-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(
  root,
  "design/04-prototype/wireframes/innodragon-notifications-wireframes.html"
);
const outDir = path.join(
  root,
  "ds-showcase/assets/images/case-dragon-wireframes"
);

fs.mkdirSync(outDir, { recursive: true });

const fileUrl = "file:///" + htmlPath.replace(/\\/g, "/");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 2,
});

await page.goto(fileUrl, { waitUntil: "load" });

// Full board overview
await page.screenshot({
  path: path.join(outDir, "wireframes-board-full.png"),
  fullPage: true,
  type: "png",
});

const cells = page.locator(".cell.desk");
const count = await cells.count();
const names = [];

for (let i = 0; i < count; i++) {
  const cell = cells.nth(i);
  const title =
    (await cell.locator(".cap .t").innerText().catch(() => `frame-${i + 1}`)) ||
    `frame-${i + 1}`;
  const codeMatch = title.match(/NTF-?\s*(\d+)/i);
  const codeNum = codeMatch ? codeMatch[1] : String(i + 1);
  const asciiSlugs = {
    1: "feed",
    2: "matrix",
    3: "tg-disconnected",
    4: "connect-telegram",
    5: "indeterminate",
    6: "undo-toast",
    7: "empty",
    8: "network-error",
    9: "align-column",
  };
  const slug = asciiSlugs[Number(codeNum)] || `frame-${codeNum}`;
  const fileName = `${String(i + 1).padStart(2, "0")}-ntf-${codeNum}-${slug}.png`;

  await cell.scrollIntoViewIfNeeded();
  await cell.locator(".desk-frame").screenshot({
    path: path.join(outDir, fileName),
    type: "png",
  });
  names.push({ fileName, title });
}

// Also export each section as one strip
const sections = page.locator("section");
const secCount = await sections.count();
for (let i = 0; i < secCount; i++) {
  const sec = sections.nth(i);
  const h2 = await sec.locator("h2").innerText().catch(() => `section-${i + 1}`);
  const slug = h2
    .replace(/[^\wа-яёА-ЯЁ0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  await sec.scrollIntoViewIfNeeded();
  await sec.screenshot({
    path: path.join(
      outDir,
      `section-${String(i + 1).padStart(2, "0")}-${slug}.png`
    ),
    type: "png",
  });
}

await browser.close();

const manifest = {
  generated: new Date().toISOString(),
  source: "design/04-prototype/wireframes/innodragon-notifications-wireframes.html",
  frames: names,
};
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log(`Exported ${names.length} frames + sections → ${outDir}`);
for (const n of names) console.log(" -", n.fileName, "←", n.title);
