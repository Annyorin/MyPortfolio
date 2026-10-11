import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { getAssetVersion } from "../scripts/asset-version.mjs";
import { versionAssetUrl } from "../shared/assetUrl.js";
import { contentMap } from "../shared/content.js";

const moduleWithEnv = (source, env) =>
  `data:text/javascript,${encodeURIComponent(`import.meta.env = ${JSON.stringify(env)};\n${source}`)}`;

describe("deployment asset URLs", () => {
  it("versions root and entry-relative URLs, preserving query and PDF fragments", () => {
    assert.equal(versionAssetUrl("/MyPortfolio/ds-showcase/assets/icons/mail.svg", "sha"),
      "/MyPortfolio/ds-showcase/assets/icons/mail.svg?v=sha");
    assert.equal(versionAssetUrl("assets/Резюме.pdf?download=0&name=a%20b#page=2", "release /2"),
      "assets/Резюме.pdf?download=0&name=a%20b&v=release%20%2F2#page=2");
  });

  it("is idempotent and replaces old or duplicate versions", () => {
    const url = "images/a.png?quality=90&v=old&v=older#crop";
    const versioned = versionAssetUrl(url, "new");
    assert.equal(versioned, "images/a.png?quality=90&v=new#crop");
    assert.equal(versionAssetUrl(versioned, "new"), versioned);
    assert.equal(versionAssetUrl("images/a.png?%76=old", "new"), "images/a.png?v=new");
  });

  it("leaves navigation fragments, external links and non-HTTP schemes alone", () => {
    for (const url of ["#", "#section", "?page=2", "https://example.com/a.png", "//cdn.example/a.png",
      "mailto:a@example.com", "data:image/png;base64,abc", "blob:https://example.com/id", ""]) {
      assert.equal(versionAssetUrl(url, "sha"), url);
    }
  });

  it("does nothing without a build version, including direct Node imports", () => {
    const url = "assets/cv.pdf?download=0#page=1";
    assert.equal(versionAssetUrl(url, ""), url);
    assert.equal(versionAssetUrl(url), url);
  });

  it("uses the injected production version but leaves development URLs alone", async () => {
    const source = fs.readFileSync(new URL("../shared/assetUrl.js", import.meta.url), "utf8");
    for (const dev of [false, true]) {
      const env = { DEV: dev, VITE_ASSET_VERSION: "deployment" };
      const moduleUrl = moduleWithEnv(source, env);
      const { versionAssetUrl: versioned } = await import(moduleUrl);
      assert.equal(versioned("assets/cv.pdf"), dev ? "assets/cv.pdf" : "assets/cv.pdf?v=deployment");
    }
  });

  it("resolves regular and full-size content assets with the same version under either Vite base", async () => {
    const urlSource = fs.readFileSync(new URL("../shared/assetUrl.js", import.meta.url), "utf8");
    const resolverSource = fs.readFileSync(new URL("../portfolio/js/resolveAsset.js", import.meta.url), "utf8");
    const [key, ref] = Object.entries(contentMap.assets).find(([, asset]) => asset.fullPathFromDsRoot);
    for (const base of ["/", "/MyPortfolio/"]) {
      const env = { DEV: false, PROD: true, BASE_URL: base, VITE_ASSET_VERSION: "sha" };
      // Link the actual runtime modules and inject the environment normally supplied by Vite.
      const source = resolverSource
        .replace('"../../shared/content.js"', JSON.stringify(new URL("../shared/content.js", import.meta.url).href))
        .replace('"../../shared/assetUrl.js"', JSON.stringify(moduleWithEnv(urlSource, env)));
      const { resolveAsset } = await import(moduleWithEnv(source, env));
      assert.equal(resolveAsset("avatar"), `${base}ds-showcase/assets/images/avatar.png?v=sha`);
      assert.equal(resolveAsset(key, { full: true }), `${base}ds-showcase/assets/${ref.fullPathFromDsRoot}?v=sha`);
      assert.equal(resolveAsset(key), `${base}ds-showcase/assets/${ref.pathFromDsRoot}?v=sha`);
    }
  });
});

describe("shared build version", () => {
  it("prefers an explicit version, then the deployment SHA", () => {
    assert.equal(getAssetVersion({ VITE_ASSET_VERSION: " release-2 ", GITHUB_SHA: "sha" }), "release-2");
    assert.equal(getAssetVersion({ GITHUB_SHA: "sha" }), "sha");
  });

  it("is deterministic locally and changes with copied bytes, filenames, additions and removals", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-asset-version-"));
    try {
      const assets = path.join(root, "portfolio/assets");
      fs.mkdirSync(assets, { recursive: true });
      const file = path.join(assets, "cv.pdf");
      fs.writeFileSync(file, "first");
      const initial = getAssetVersion({}, root);
      assert.equal(getAssetVersion({}, root), initial);
      fs.writeFileSync(path.join(root, "unrelated.md"), "not a copied input");
      assert.equal(getAssetVersion({}, root), initial);
      fs.writeFileSync(file, "other"); // same length, different bytes
      const changed = getAssetVersion({}, root);
      assert.notEqual(changed, initial);
      fs.renameSync(file, path.join(assets, "resume.pdf"));
      const renamed = getAssetVersion({}, root);
      assert.notEqual(renamed, changed);
      fs.writeFileSync(file, "additional");
      assert.notEqual(getAssetVersion({}, root), renamed);
      fs.unlinkSync(file);
      assert.equal(getAssetVersion({}, root), renamed);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
