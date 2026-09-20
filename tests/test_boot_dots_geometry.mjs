/**
 * Dots boot animation: grid, rings and the pairing between them.
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const load = (rel) => import(pathToFileURL(path.join(REPO_ROOT, rel)).href);
const layout = () => load("portfolio/js/boot/dots/layout.js");
const particles = () => load("portfolio/js/boot/dots/particles.js");

describe("dots boot: grid", () => {
  it("covers the viewport with a fixed step and overshoots the edges", async () => {
    const { buildGrid } = await layout();
    const g = buildGrid(1450, 910, 56);

    assert.equal(g.nodes.length / 2, (g.cols + 1) * (g.rows + 1));
    assert.equal(g.cell, 56);
    assert.equal(g.nodes[2] - g.nodes[0], 56, "step along x");

    let maxX = 0;
    let maxY = 0;
    for (let i = 0; i < g.nodes.length; i += 2) {
      maxX = Math.max(maxX, g.nodes[i]);
      maxY = Math.max(maxY, g.nodes[i + 1]);
    }
    assert.ok(maxX >= 1450 && maxY >= 910, "grid runs past the edges");
  });

  it("keeps dots in place across resize and zoom", async () => {
    const { buildGrid } = await layout();
    const nodesOf = (w, h) => {
      const g = buildGrid(w, h, 20, 10, 10);
      return new Set(
        Array.from({ length: g.nodes.length / 2 }, (_, i) => `${g.nodes[i * 2]}:${g.nodes[i * 2 + 1]}`)
      );
    };

    const small = nodesOf(1280, 800);
    for (const [w, h] of [[1440, 900], [1281, 801], [1920, 1080]]) {
      const big = nodesOf(w, h);
      for (const node of small) assert.ok(big.has(node), `${node} survived ${w}x${h}`);
      // A wider viewport never drops nodes; a 1px bump may add none at all.
      assert.ok(big.size >= small.size, "nothing was rebuilt, only edge rows may be added");
    }
  });
});

describe("dots boot: rings", () => {
  it("places exactly the requested number of dots", async () => {
    const { buildRings } = await layout();
    for (const count of [1, 40, 693, 2000]) {
      assert.equal(buildRings(count, 260, 68).points.length / 3, count, `count = ${count}`);
    }
  });

  it("leaves the middle empty when an inner radius is given", async () => {
    const { buildRings } = await layout();
    const { points } = buildRings(700, 260, 68);
    for (let i = 0; i < points.length; i += 3) {
      const r = Math.hypot(points[i], points[i + 1]);
      assert.ok(r >= 68 - 1e-3 && r <= 260 + 1e-3, `radius ${r} inside the annulus`);
    }
  });

  it("orders nodes outwards from the centre, bijectively", async () => {
    const { buildGrid, orderNodes } = await layout();
    const g = buildGrid(1440, 900, 56);
    const order = orderNodes(g.nodes, 720, 450, g.cell);
    const n = g.nodes.length / 2;

    assert.equal(order.length, n);
    assert.equal(new Set(order).size, n, "every node appears exactly once");

    const distAt = (i) => Math.hypot(g.nodes[i * 2] - 720, g.nodes[i * 2 + 1] - 450);
    for (let i = 1; i < n; i++) {
      assert.ok(distAt(order[i]) >= distAt(order[i - 1]) - g.cell, "monotonic within a bucket");
    }
  });
});

describe("dots boot: particles", () => {
  it("lands the final frame exactly on the settled grid", async () => {
    const { buildParticles, drawParticles, drawGrid, morphTotal } = await particles();
    const { DOTS_BOOT_CONFIG } = await load("portfolio/js/bootDots.js");
    const { resolveDotsConfig } = await load("portfolio/js/boot/dots/config.js");
    const cfg = resolveDotsConfig(DOTS_BOOT_CONFIG);
    const p = buildParticles(1280, 800, cfg);

    const capture = (fn) => {
      const out = [];
      const ctx = {
        fillStyle: "", globalAlpha: 1, beginPath() {}, fill() {}, moveTo() {},
        arc(x, y, r) { out.push({ x, y, r, alpha: this.globalAlpha }); },
      };
      fn(ctx);
      return out;
    };

    const animated = capture((ctx) =>
      drawParticles(ctx, p, { time: 0, progress: 1, morphT: morphTotal(cfg) }, cfg)
    );
    const settled = capture((ctx) => drawGrid(ctx, p, cfg));

    assert.equal(animated.length, settled.length);
    const key = (a) => `${a.x.toFixed(3)}:${a.y.toFixed(3)}:${a.r.toFixed(3)}`;
    const keys = new Set(settled.map(key));
    for (const a of animated) {
      assert.ok(keys.has(key(a)), "same position and size");
      assert.equal(a.alpha, 1, "and fully opaque");
    }
  });

  it("matches the site's own dotted background", async () => {
    const { buildParticles } = await particles();
    const { DOTS_BOOT_CONFIG } = await load("portfolio/js/bootDots.js");
    const { resolveDotsConfig } = await load("portfolio/js/boot/dots/config.js");
    const { INFINITE_BG } = await load("portfolio/js/infiniteBg.js");

    const cfg = resolveDotsConfig(DOTS_BOOT_CONFIG);
    const p = buildParticles(1280, 800, cfg);
    const centre = INFINITE_BG.worldPad + INFINITE_BG.worldDotRadius;

    assert.equal(p.grid.cell, INFINITE_BG.worldPeriod);
    assert.equal(cfg.gridDotRadius, INFINITE_BG.worldDotRadius);
    for (let i = 0; i < p.grid.nodes.length; i += 2) {
      const dx = (((p.grid.nodes[i] - centre) % INFINITE_BG.worldPeriod) + INFINITE_BG.worldPeriod) % INFINITE_BG.worldPeriod;
      assert.ok(dx < 1e-6, `node ${p.grid.nodes[i]} sits on the site's lattice`);
    }
  });

  it("keeps dots clear of the percent badge", async () => {
    const { buildParticles } = await particles();
    const { DOTS_BOOT_CONFIG } = await load("portfolio/js/bootDots.js");
    const { resolveDotsConfig } = await load("portfolio/js/boot/dots/config.js");
    const cfg = resolveDotsConfig(DOTS_BOOT_CONFIG);

    for (const [w, h] of [[1440, 900], [768, 1024], [375, 667]]) {
      const p = buildParticles(w, h, cfg);
      for (let i = 0; i < p.count; i++) {
        const d = Math.hypot(p.x0[i] - w / 2, p.y0[i] - h / 2);
        assert.ok(d >= 50, `${w}x${h}: dot ${i} stays outside the badge`);
      }
    }
  });

  it("hides the dots born mid-blast until they are needed", async () => {
    const { buildParticles, drawParticles, morphTotal } = await particles();
    const { DOTS_BOOT_CONFIG } = await load("portfolio/js/bootDots.js");
    const { resolveDotsConfig } = await load("portfolio/js/boot/dots/config.js");
    const cfg = resolveDotsConfig(DOTS_BOOT_CONFIG);
    const p = buildParticles(1280, 800, cfg);

    const drawn = (morphT) => {
      let n = 0;
      const ctx = {
        fillStyle: "", globalAlpha: 1, beginPath() {}, fill() {}, moveTo() {}, arc() { n++; },
      };
      drawParticles(ctx, p, { time: 0, progress: 1, morphT }, cfg);
      return n;
    };

    assert.ok(p.ringTotal < p.count, "fewer ring dots than grid nodes");
    assert.equal(drawn(0), p.ringTotal, "only real dots while the rings hold");
    assert.equal(drawn(morphTotal(cfg)), p.count, "all of them in the grid");

    for (let i = 1; i < p.count; i++) {
      if (!p.born[i]) continue;
      assert.equal(p.x0[i], p.x0[i - 1], "a born dot starts from its neighbour");
    }
  });
});
