/**
 * Infinite FigJam-style dotted bg (world-locked scale/pan).
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

describe("infinite FigJam bg", () => {
  it("period and dot radius scale with camera; pan offsets position", async () => {
    const { infiniteBgStyles, INFINITE_BG } = await import(
      pathToFileURL(path.join(REPO_ROOT, "portfolio/js/infiniteBg.js")).href
    );

    const idle = infiniteBgStyles({ scale: 1, translateX: 0, translateY: 0 });
    assert.equal(idle.backgroundSize, "20px 20px");
    assert.equal(idle.backgroundPosition, "8px 8px");
    assert.match(idle.backgroundImage, /circle 2px/);

    const zoomed = infiniteBgStyles({
      scale: 2,
      translateX: 40,
      translateY: -10,
    });
    assert.equal(zoomed.backgroundSize, "40px 40px");
    assert.equal(
      zoomed.backgroundPosition,
      `${40 + INFINITE_BG.worldPad * 2}px ${-10 + INFINITE_BG.worldPad * 2}px`
    );
    assert.match(zoomed.backgroundImage, /circle 4px/);

    const out = infiniteBgStyles({ scale: 0.5, translateX: 0, translateY: 0 });
    assert.equal(out.backgroundSize, "10px 10px");
    assert.match(out.backgroundImage, /circle 1px/);
  });
});
