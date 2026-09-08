/**
 * Storybook DS inventory check (full stories, not stubs) — task 3.3.
 *
 * TC-E2E-01: required component *.stories.js files Chip…Media exist (no stubs)
 * TC-E2E-02: Chip exports Default+Active; Card exports Default+Hover
 * TC-E2E-03: Storybook main.js stories glob resolves (files on disk + syntax)
 * Media / Sidebar / contentMap checks: regression from prior inventory work
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { after, before, describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const STORY_GROUPS = [
  "Chip",
  "Link",
  "Card",
  "Sidebar",
  "Tapper",
  "Tooltip",
  "Stiker",
  "Hover",
  "Avatar",
  "Profile",
  "Icons",
  "Media",
];

/** Groups that must import Content Map for demo strings. */
const CONTENT_STORY_GROUPS = [
  "Chip",
  "Link",
  "Card",
  "Sidebar",
  "Tapper",
  "Tooltip",
  "Stiker",
  "Hover",
  "Avatar",
  "Profile",
];

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

/**
 * @param {string} relativePath
 * @returns {string}
 */
function read(relativePath) {
  return fs.readFileSync(abs(relativePath), "utf8");
}

/**
 * Minimal DOM for CSF render() under node:test.
 * @returns {{ document: { createElement: Function } }}
 */
function createDomShim() {
  /** @type {WeakMap<object, Map<string, string>>} */
  const attrs = new WeakMap();

  /**
   * @param {object} el
   * @returns {Map<string, string>}
   */
  function attrMap(el) {
    let m = attrs.get(el);
    if (!m) {
      m = new Map();
      attrs.set(el, m);
    }
    return m;
  }

  /**
   * @param {string} tagName
   */
  function createElement(tagName) {
    const children = [];
    /** @type {Record<string, string>} */
    const style = {};
    /** @type {Record<string, string>} */
    const dataset = {};
    const classSet = new Set();
    let classNameValue = "";
    let textValue = "";

    /**
     * @param {string} value
     */
    function setClassName(value) {
      classNameValue = String(value);
      classSet.clear();
      for (const part of classNameValue.split(/\s+/).filter(Boolean)) {
        classSet.add(part);
      }
    }

    const el = {
      tagName: String(tagName).toUpperCase(),
      children,
      style,
      dataset,
      parentNode: null,
      get textContent() {
        if (children.length === 0) {
          return textValue;
        }
        return children.map((c) => c.textContent || "").join("");
      },
      set textContent(value) {
        textValue = String(value);
        children.length = 0;
      },
      get className() {
        return classNameValue;
      },
      set className(value) {
        setClassName(value);
      },
      get classList() {
        return {
          contains(name) {
            return classSet.has(name);
          },
        };
      },
      setAttribute(name, value) {
        attrMap(el).set(String(name), String(value));
        if (name.startsWith("data-")) {
          const key = name
            .slice(5)
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          dataset[key] = String(value);
        }
      },
      getAttribute(name) {
        if (name === "class") {
          return classNameValue || null;
        }
        if (name === "src") {
          return attrMap(el).get("src") ?? null;
        }
        return attrMap(el).has(String(name))
          ? attrMap(el).get(String(name))
          : null;
      },
      appendChild(child) {
        child.parentNode = el;
        children.push(child);
        return child;
      },
      append(...nodes) {
        for (const n of nodes) {
          el.appendChild(n);
        }
      },
      querySelector(selector) {
        return queryAll(el, selector)[0] || null;
      },
      querySelectorAll(selector) {
        return queryAll(el, selector);
      },
    };

    Object.defineProperty(el, "src", {
      get() {
        return attrMap(el).get("src") ?? "";
      },
      set(v) {
        attrMap(el).set("src", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "alt", {
      get() {
        return attrMap(el).get("alt") ?? "";
      },
      set(v) {
        attrMap(el).set("alt", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "href", {
      get() {
        return attrMap(el).get("href");
      },
      set(v) {
        attrMap(el).set("href", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "type", {
      get() {
        return attrMap(el).get("type");
      },
      set(v) {
        attrMap(el).set("type", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "width", {
      get() {
        return Number(attrMap(el).get("width") || 0);
      },
      set(v) {
        attrMap(el).set("width", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "height", {
      get() {
        return Number(attrMap(el).get("height") || 0);
      },
      set(v) {
        attrMap(el).set("height", String(v));
      },
      configurable: true,
    });

    return el;
  }

  /**
   * @param {object} root
   * @param {string} selector
   * @returns {object[]}
   */
  function queryAll(root, selector) {
    const out = [];
    /**
     * @param {object} node
     */
    function walk(node) {
      for (const child of node.children || []) {
        if (matchOne(child, selector)) {
          out.push(child);
        }
        walk(child);
      }
    }
    walk(root);
    return out;
  }

  /**
   * @param {object} el
   * @param {string} sel
   */
  function matchOne(el, sel) {
    if (sel === "img") {
      return el.tagName === "IMG";
    }
    if (sel.startsWith(".")) {
      return el.classList.contains(sel.slice(1));
    }
    return false;
  }

  return { document: { createElement } };
}

/**
 * @param {string} group
 * @returns {Promise<Record<string, any>>}
 */
async function loadStoryModule(group) {
  return import(pathToFileURL(abs(`stories/${group}.stories.js`)).href);
}

describe("storybook DS inventory", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;

  before(() => {
    previousDocument = globalThis.document;
    const shim = createDomShim();
    globalThis.document = /** @type {any} */ (shim.document);
  });

  after(() => {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  });

  it("TC-E2E-01: each required component has *.stories.js under stories/", () => {
    assert.ok(fs.existsSync(abs("stories")), "missing stories/");
    for (const group of STORY_GROUPS) {
      const rel = `stories/${group}.stories.js`;
      assert.ok(fs.existsSync(abs(rel)), `missing ${rel}`);
      const src = read(rel);
      assert.doesNotMatch(
        src,
        /Placeholder|textContent\s*=\s*["']stub["']/,
        `${rel} must not be a placeholder stub`
      );
    }
    assert.ok(
      !fs.existsSync(abs("stories/_inventory.stub.stories.js")),
      "legacy inventory stub file must not exist"
    );
  });

  it("TC-E2E-02: Chip exports Default and Active; Card exports Default and Hover", async () => {
    const chip = await loadStoryModule("Chip");
    assert.equal(typeof chip.Default?.render, "function", "Chip.Default required");
    assert.equal(typeof chip.Active?.render, "function", "Chip.Active required");
    assert.equal(chip.Stub, undefined, "Chip.Stub must be removed");

    const card = await loadStoryModule("Card");
    assert.equal(typeof card.Default?.render, "function", "Card.Default required");
    assert.equal(typeof card.Hover?.render, "function", "Card.Hover required");
    assert.equal(card.Stub, undefined, "Card.Stub must be removed");

    const chipDefault = chip.Default.render();
    const chipActive = chip.Active.render();
    assert.ok(
      chipDefault.classList.contains("ds-chip--default"),
      "Chip Default uses ds-chip--default"
    );
    assert.ok(
      chipActive.classList.contains("ds-chip--active"),
      "Chip Active uses ds-chip--active"
    );

    const cardDefault = card.Default.render();
    const cardHover = card.Hover.render();
    assert.ok(
      cardDefault.classList.contains("ds-card--default"),
      "Card Default uses ds-card--default"
    );
    assert.ok(
      cardHover.classList.contains("ds-card--hover"),
      "Card Hover uses ds-card--hover"
    );
  });

  it("TC-E2E-03: Storybook main.js stories glob resolves (files + syntax)", () => {
    const mainRel = ".storybook/main.js";
    assert.ok(fs.existsSync(abs(mainRel)), "missing .storybook/main.js");
    const mainCfg = read(mainRel);
    assert.match(
      mainCfg,
      /stories\/\*\*\/\*\.stories\.js/,
      "stories glob required"
    );
    assert.match(mainCfg, /@ds-assets/, "@ds-assets alias required");
    assert.match(
      mainCfg,
      /@storybook\/html-vite/,
      "framework @storybook/html-vite required"
    );

    const mainCheck = spawnSync(
      process.execPath,
      ["--check", abs(mainRel)],
      { encoding: "utf8" }
    );
    assert.equal(
      mainCheck.status,
      0,
      `node --check ${mainRel} failed: ${mainCheck.stderr || mainCheck.stdout}`
    );

    const storiesDir = abs("stories");
    const onDisk = fs
      .readdirSync(storiesDir)
      .filter((name) => name.endsWith(".stories.js"))
      .sort();
    const expected = STORY_GROUPS.map((g) => `${g}.stories.js`).sort();
    assert.deepEqual(
      onDisk,
      expected,
      "stories/**/*.stories.js must match Chip…Media inventory exactly"
    );

    for (const file of onDisk) {
      const rel = path.join("stories", file);
      const checked = spawnSync(
        process.execPath,
        ["--check", abs(rel)],
        { encoding: "utf8" }
      );
      assert.equal(
        checked.status,
        0,
        `node --check ${rel} failed: ${checked.stderr || checked.stdout}`
      );
    }
  });

  it("Media story references existing assets via @ds-assets or resolveAsset", async () => {
    const mediaMod = await loadStoryModule("Media");
    assert.equal(typeof mediaMod.Default?.render, "function");
    const root = mediaMod.Default.render();
    const imgs = [...root.querySelectorAll("img")];
    assert.equal(imgs.length, 7, "Media must render IMG_BG…Comp + me + Macbook");

    const mediaSrc = read("stories/Media.stories.js");
    assert.match(
      mediaSrc,
      /resolveAsset|@ds-assets/,
      "Media story must use resolveAsset or @ds-assets"
    );

    for (const img of imgs) {
      const src = img.getAttribute("src") || "";
      assert.ok(
        src.includes("@ds-assets/") || src.includes("ds-showcase/assets/"),
        `unexpected media src: ${src}`
      );
      const relative = src
        .replace(/^@ds-assets\//, "")
        .replace(/^ds-showcase\/assets\//, "");
      const filePath = abs(path.join("ds-showcase", "assets", relative));
      assert.ok(fs.existsSync(filePath), `missing asset file for ${src}: ${filePath}`);
    }
  });

  it("Sidebar story contains profile.name / contact.cv from contentMap", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    const sidebarMod = await loadStoryModule("Sidebar");
    const el = sidebarMod.Default.render();
    const nameEl = el.querySelector(".ds-profile__name");
    assert.ok(nameEl, "Sidebar profile name node required");
    assert.equal(nameEl.textContent, contentMap["profile.name"]);

    const actions = el.querySelector(".ds-sidebar__skills");
    assert.ok(actions, "Sidebar actions required");
    const contactTexts = [...actions.querySelectorAll(".ds-button")].map(
      (c) => (c.textContent || "").trim()
    );
    assert.ok(
      contactTexts.includes(contentMap["contact.cv"]),
      "Sidebar must include contact.cv"
    );
    assert.ok(el.querySelector(".ds-sidebar__bio"), "Sidebar bio required");
    assert.ok(el.querySelector(".ds-sidebar__copyright"), "Sidebar copyright required");
  });

  it("no duplicate string dictionary inside stories; only shared import", () => {
    for (const group of CONTENT_STORY_GROUPS) {
      const rel = `stories/${group}.stories.js`;
      const src = read(rel);
      assert.match(
        src,
        /from\s+["']\.\.\/shared\/content\.js["']/,
        `${rel} must import shared/content.js`
      );
      assert.doesNotMatch(
        src,
        /contentMap\s*=\s*\{/,
        `${rel} must not redefine contentMap`
      );
      assert.doesNotMatch(
        src,
        /["']profile\.name["']\s*:/,
        `${rel} must not embed a local content dictionary`
      );
    }
  });
});
