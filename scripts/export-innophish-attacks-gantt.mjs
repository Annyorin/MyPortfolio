import { chromium } from "playwright-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(
  root,
  "design/04-prototype/wireframes/innophish-dashboard-wireframes.html"
);
const outDir = path.join(
  root,
  "design/04-prototype/outputs/innophish-wireframes"
);

fs.mkdirSync(outDir, { recursive: true });
const fileUrl = "file:///" + htmlPath.replace(/\\/g, "/");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1400, height: 1000 },
  deviceScaleFactor: 2,
});

await page.goto(fileUrl, { waitUntil: "load" });

const cell = page.locator('.cell.desk[data-export="01-tab-attacks"]');
await cell.scrollIntoViewIfNeeded();
await cell.locator(".desk-frame").screenshot({
  path: path.join(outDir, "01-tab-attacks.png"),
  type: "png",
});
await cell.locator(".desk-frame").screenshot({
  path: path.join(outDir, "01-tab-attacks-gantt.png"),
  type: "png",
});

await browser.close();
console.log("Exported 01-tab-attacks.png + 01-tab-attacks-gantt.png →", outDir);
