/**
 * Content Map, Scene Layout, resolveAsset (task 2.1).
 *
 * TC-E2E-01: contentMap profile.role / card.title
 * TC-E2E-02: seven layout slots, zIndex paint order BG→…→Tapper
 * TC-E2E-03: resolveAsset('avatar') → file under ds-showcase/assets/
 * TC-UNIT-01: computeContentAABB covers cards+about (not chrome/tapper)
 * TC-UNIT-02: chipVariants active/default matrix
 * TC-UNIT-03: contact keys have no url field
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

const PAINT_ORDER_IDS = [
  "bg",
  "sidebar",
  "cardA",
  "cardB",
  "cardC",
  "about",
  "tapper",
];

const EXPECTED_SLOTS = {
  bg: { kind: "bg", x: -48, y: -35, width: 1120, height: 680, zIndex: 0 },
  sidebar: { kind: "sidebar", x: 24, y: 24, width: 310, height: 561, zIndex: 1 },
  cardA: { kind: "card", x: 358, y: 28, width: 310, height: 310, zIndex: 2 },
  cardB: { kind: "card", x: 690, y: 169, width: 310, height: 310, zIndex: 2 },
  cardC: { kind: "card", x: 358, y: 362, width: 310, height: 310, zIndex: 2 },
  about: {
    kind: "about",
    x: 763,
    y: 16,
    width: 209.61,
    height: 116.01,
    zIndex: 3,
  },
  tapper: { kind: "tapper", x: 1008, y: 324, width: 40, height: 104, zIndex: 5 },
};

describe("content map / scene layout / resolveAsset", () => {
  it("TC-E2E-01: contentMap has profile.role and card.title from content-package", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    assert.equal(contentMap["profile.role"], "Подуктовый дизайнер");
    assert.equal(contentMap["card.title"], "InnoDragon");
  });

  it("TC-E2E-02: layout has 7 slots with zIndex paint order BG→…→Tapper", async () => {
    const { sceneGraph, nodes } = await import(
      pathToFileURL(abs("shared/layout.js")).href
    );
    assert.equal(nodes.length, 7);
    assert.strictEqual(nodes, sceneGraph.nodes);

    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    for (const id of PAINT_ORDER_IDS) {
      assert.ok(byId[id], `missing slot ${id}`);
      const expected = EXPECTED_SLOTS[id];
      assert.equal(byId[id].kind, expected.kind);
      assert.equal(byId[id].x, expected.x);
      assert.equal(byId[id].y, expected.y);
      assert.equal(byId[id].width, expected.width);
      assert.equal(byId[id].height, expected.height);
      assert.equal(byId[id].zIndex, expected.zIndex);
    }

    const about = byId.about;
    assert.ok(Array.isArray(about.children));
    assert.deepEqual(
      about.children.map((c) => c.kind),
      ["macbook", "me", "stiker"]
    );

    const tapper = byId.tapper;
    assert.equal(tapper.sceneTransform?.portrait, true);

    const sorted = [...nodes].sort((a, b) => a.zIndex - b.zIndex || 0);
    assert.deepEqual(
      sorted.map((n) => n.id),
      PAINT_ORDER_IDS,
      "paint order by ascending zIndex must be BG→Sidebar→Cards→About→Tapper"
    );
    for (let i = 1; i < sorted.length; i += 1) {
      assert.ok(
        sorted[i].zIndex >= sorted[i - 1].zIndex,
        "zIndex must be non-decreasing in paint order"
      );
    }
  });

  it("TC-E2E-03: resolveAsset('avatar') points at existing ds-showcase/assets file", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    const { resolveAsset } = await import(
      pathToFileURL(abs("portfolio/js/resolveAsset.js")).href
    );

    const ref = contentMap.assets.avatar;
    assert.ok(ref && typeof ref.pathFromDsRoot === "string");
    assert.equal(ref.pathFromDsRoot, "images/avatar.png");

    const diskPath = abs(path.join("ds-showcase/assets", ref.pathFromDsRoot));
    assert.ok(fs.existsSync(diskPath), `missing ${diskPath}`);
    assert.ok(fs.statSync(diskPath).size > 0, "avatar.png must be non-empty");

    const url = resolveAsset("avatar");
    assert.equal(typeof url, "string");
    assert.ok(url.includes(ref.pathFromDsRoot), `url ${url} must include pathFromDsRoot`);
    assert.match(
      url,
      /(@ds-assets\/|ds-showcase\/assets\/)/,
      "resolveAsset must use alias or repo-root assets path"
    );
    assert.ok(
      !url.includes("../ds-showcase"),
      "shared/content must not force entry-relative ../ds-showcase paths"
    );

    const unknown = resolveAsset("missing.asset.key");
    assert.equal(typeof unknown, "string");
  });

  it("TC-UNIT-01: computeContentAABB covers canvas cards+about (not chrome/tapper)", async () => {
    const { nodes, computeContentAABB, layout1366, FIXED_CHROME_KINDS } =
      await import(pathToFileURL(abs("shared/layout.js")).href);
    const aabb = computeContentAABB(nodes);
    const cardA = nodes.find((n) => n.id === "cardA");
    const cardB = nodes.find((n) => n.id === "cardB");
    const about = nodes.find((n) => n.id === "about");
    assert.ok(cardA && cardB && about);

    assert.ok(aabb.minX <= cardA.x);
    assert.ok(aabb.minY <= cardA.y);
    assert.ok(aabb.maxX >= cardB.x + cardB.width);
    assert.ok(aabb.maxY >= cardA.y + cardA.height);
    assert.ok(aabb.maxX >= about.x + about.width);
    assert.ok(aabb.minY <= about.y);

    assert.ok(FIXED_CHROME_KINDS.has("sidebar"));
    assert.ok(FIXED_CHROME_KINDS.has("tapper"));

    // KEY_CONTENT is card+about only — fixed tapper excluded from AABB.
    const aabb1366 = computeContentAABB(layout1366.nodes);
    const tapper1366 = layout1366.nodes.find((n) => n.id === "tapper");
    assert.ok(tapper1366);
    assert.ok(
      aabb1366.maxX < tapper1366.x || tapper1366.x > 0,
      "AABB must not be driven by fixed chrome tapper"
    );
  });

  it("TC-UNIT-02: chipVariants b2b/b2c active; design_system/ai_prototyping default", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    assert.equal(contentMap.chipVariants["chip.b2b"], "active");
    assert.equal(contentMap.chipVariants["chip.b2c"], "active");
    assert.equal(contentMap.chipVariants["chip.design_system"], "default");
    assert.equal(contentMap.chipVariants["chip.ai_prototyping"], "default");
  });

  it("TC-UNIT-03: contact labels stay text; URLs live in contactUrls", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    const contactKeys = [
      "contact.cv",
      "contact.telegram",
      "contact.linkedin",
      "contact.behance",
    ];
    for (const key of contactKeys) {
      assert.equal(typeof contentMap[key], "string");
      assert.ok(contentMap[key].length > 0);
    }
    assert.equal(contentMap["contact.cv"], "CV");
    assert.equal(Object.hasOwn(contentMap, "contact.cv.url"), false);
    assert.equal(contentMap.url, undefined);
    for (const key of contactKeys) {
      const value = contentMap[key];
      assert.equal(typeof value, "string");
      assert.ok(!/https?:\/\//i.test(value), `${key} must not embed a URL`);
    }
    assert.equal(typeof contentMap.contactUrls, "object");
    assert.equal(contentMap.contactUrls["contact.telegram"], "https://t.me/Annyorina");
    assert.equal(contentMap.contactUrls["contact.cv"], "assets/cv.pdf");
    assert.ok(fs.existsSync(abs("portfolio/assets/cv.pdf")));
  });

  it("shared content has no entry-relative ds-showcase path strings", async () => {
    const source = fs.readFileSync(abs("shared/content.js"), "utf8");
    assert.ok(!source.includes("../ds-showcase"));
    assert.ok(!source.includes("ds-showcase/assets/"));
  });

  it("selectSceneLayout: <1024 → 41:1416; ≥1024 → 51:4107", async () => {
    const { selectSceneLayout, layout1024, layout1366 } = await import(
      pathToFileURL(abs("shared/layout.js")).href
    );

    assert.equal(selectSceneLayout({ width: 1023, height: 609 }).id, "41:1416");
    assert.equal(selectSceneLayout({ width: 1024, height: 609 }).id, "51:4107");
    assert.equal(selectSceneLayout({ width: 1365, height: 768 }).id, "51:4107");
    assert.equal(selectSceneLayout({ width: 1366, height: 768 }).id, "51:4107");
    assert.equal(layout1024.nodes.find((n) => n.id === "cardA").x, 358);
    assert.equal(layout1024.nodes.find((n) => n.id === "about").x, 763);
    assert.equal(layout1366.nodes.find((n) => n.id === "cardA").x, 475);
    assert.equal(layout1366.nodes.find((n) => n.id === "cardB").x, 907);
    assert.equal(layout1366.nodes.find((n) => n.id === "cardC").x, 565);
    assert.equal(layout1366.nodes.find((n) => n.id === "about").x, 1081);
    assert.equal(layout1366.nodes.find((n) => n.id === "sidebar").height, 720);
    assert.equal(layout1366.nodes.find((n) => n.id === "tapper").width, 40);
    assert.equal(layout1366.nodes.find((n) => n.id === "tapper").height, 104);
  });
});
