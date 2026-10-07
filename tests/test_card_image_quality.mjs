/**
 * Regression: portfolio card covers keep today's (2026-10-04) Figma visual at
 * card @3× 924×570 with healthy PNG weight, and main serves full PNG — not
 * soft q40 `lq/*.webp` twins.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { contentMap } from "../shared/content.js";
import { LOW_RES_IMAGES } from "../shared/lowResImages.js";
import { previewUrlFor } from "../portfolio/js/progressiveImages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const IMAGES = path.join(REPO_ROOT, "ds-showcase/assets/images");

/** @param {Buffer} buf */
function pngSize(buf) {
  assert.equal(buf.toString("ascii", 1, 4), "PNG", "not a PNG");
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const CARD_COVERS = [
  "img-1.png",
  "img-2.png",
  "phish.png",
  "dragon.png",
  "card-innophish.png",
  "card-innodragon.png",
];

/** Pre-Oct4 HEAD weights (old visual). Today's regenerates must differ. */
const PRE_OCT4_BYTES = {
  "phish.png": 126251,
  "img-2.png": 126251,
  "card-innophish.png": 126251,
  "dragon.png": 129850,
  "img-1.png": 129850,
  "card-innodragon.png": 129850,
};

describe("card image quality (Oct4 visual @ 924×570)", () => {
  for (const name of CARD_COVERS) {
    it(`${name} is 924×570 PNG with healthy weight`, () => {
      const abs = path.join(IMAGES, name);
      assert.ok(fs.existsSync(abs), `${name} missing`);
      const buf = fs.readFileSync(abs);
      const { w, h } = pngSize(buf);
      assert.equal(w, 924, `${name} width`);
      assert.equal(h, 570, `${name} height`);
      assert.ok(buf.length >= 100_000, `${name} too small (${buf.length}) — likely overcompressed`);
      assert.notEqual(
        buf.length,
        PRE_OCT4_BYTES[name],
        `${name} still matches pre-Oct4 HEAD byte size (old visual)`,
      );
    });
  }

  it("phish aliases share identical bytes; dragon aliases share identical bytes", () => {
    const phish = fs.readFileSync(path.join(IMAGES, "phish.png"));
    assert.ok(phish.equals(fs.readFileSync(path.join(IMAGES, "img-2.png"))));
    assert.ok(phish.equals(fs.readFileSync(path.join(IMAGES, "card-innophish.png"))));
    const dragon = fs.readFileSync(path.join(IMAGES, "dragon.png"));
    assert.ok(dragon.equals(fs.readFileSync(path.join(IMAGES, "img-1.png"))));
    assert.ok(dragon.equals(fs.readFileSync(path.join(IMAGES, "card-innodragon.png"))));
  });

  it("contentMap card/cover intrinsics match 924×570", () => {
    const assets = contentMap.assets;
    for (const key of ["card.image.a", "card.image.b", "dragon", "phish"]) {
      const a = assets[key];
      assert.ok(a, `missing asset ${key}`);
      assert.equal(a.intrinsicWidth, 924, `${key}.intrinsicWidth`);
      assert.equal(a.intrinsicHeight, 570, `${key}.intrinsicHeight`);
    }
    assert.equal(
      assets["case.phish.hero"]?.pathFromDsRoot,
      "images/case-phish-hero.png"
    );
    assert.equal(assets["case.phish.hero"]?.intrinsicWidth, 572);
    assert.equal(assets["case.phish.hero"]?.intrinsicHeight, 357);
  });

  it("card.a/b still point at img-2 / img-1", () => {
    assert.equal(contentMap.assets["card.image.a"].pathFromDsRoot, "images/img-2.png");
    assert.equal(contentMap.assets["card.image.b"].pathFromDsRoot, "images/img-1.png");
  });

  it("card covers are not progressive lq twins", () => {
    for (const name of CARD_COVERS) {
      const key = `images/${name}`;
      assert.equal(LOW_RES_IMAGES[key], undefined, `${key} must not use lq webp`);
      assert.equal(
        previewUrlFor(`/ds-showcase/assets/${key}`),
        null,
        `${key} must resolve to full PNG`,
      );
    }
  });

  it("lq previews exist for card covers (moderate weight, not ultra-low)", () => {
    for (const name of ["img-1", "img-2", "phish", "dragon", "card-innophish", "card-innodragon"]) {
      const abs = path.join(IMAGES, "lq", `${name}.webp`);
      assert.ok(fs.existsSync(abs), `missing lq/${name}.webp`);
      const size = fs.statSync(abs).size;
      assert.ok(size > 12_000, `lq/${name}.webp too small (${size})`);
    }
  });
});
