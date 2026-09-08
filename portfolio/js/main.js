/**
 * Portfolio entry: Scene Renderer + camera start (architecture §3.2 Portfolio App).
 * Init order: mountScene → createCamera → stage-fit (≥1024) or fitToContent → apply → bindInput → bindInteractions.
 * ≥1024 wide: Figma 51:4107 card arrangement, scaled/centered in the interactive right stage.
 * &lt;768: document/mobile mode (Figma Портфолио.360) — no camera canvas.
 */
import { contentMap } from "../../shared/content.js";
import { isMobileViewport, selectSceneLayout } from "../../shared/layout.js";
import { createCameraController } from "./camera.js";
import { createInfiniteBg } from "./infiniteBg.js";
import { bindInput } from "./input.js";
import { bindInteractions } from "./interactions.js";
import { mountMobilePortfolio } from "./mobile.js";
import { resolveAsset } from "./resolveAsset.js";
import { mountScene } from "./scene.js";

/** Reference frame size from architecture §4.1 / Figma 41:1416. */
const REF_VIEWPORT_WIDTH = 1024;
const REF_VIEWPORT_HEIGHT = 609;

/**
 * Returns true when viewport is smaller than the reference frame (narrow start → fit).
 *
 * @param {Element|{clientWidth?: number, clientHeight?: number}|null} viewportEl
 * @returns {boolean}
 */
function isNarrowViewport(viewportEl) {
  if (!viewportEl) {
    return false;
  }
  const width = Number(viewportEl.clientWidth);
  const height = Number(viewportEl.clientHeight);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return false;
  }
  return width < REF_VIEWPORT_WIDTH || height < REF_VIEWPORT_HEIGHT;
}

/**
 * @param {Element|{clientWidth?: number, clientHeight?: number}|null} viewportEl
 */
function readViewportSize(viewportEl) {
  if (viewportEl) {
    const width = Number(viewportEl.clientWidth);
    const height = Number(viewportEl.clientHeight);
    if (
      Number.isFinite(width) &&
      Number.isFinite(height) &&
      width > 0 &&
      height > 0
    ) {
      return { width, height };
    }
  }
  return { width: REF_VIEWPORT_WIDTH, height: REF_VIEWPORT_HEIGHT };
}

/**
 * Initializes scene mount, camera start branch, and input on the portfolio shell.
 * Switches to document/mobile mode when viewport width &lt; 768.
 *
 * @returns {{
 *   camera: ReturnType<typeof createCameraController>|null,
 *   worldEl: Element|null,
 *   viewportEl: Element|null,
 *   scene: ReturnType<typeof mountScene>,
 *   inputMode: {spaceDown: boolean, isPanning: boolean, suppressClicks: boolean},
 *   layoutId: string|null,
 *   mode: "mobile"|"canvas"
 * }}
 */
export function initPortfolioStubs() {
  const viewportEl =
    typeof document !== "undefined"
      ? document.querySelector(".viewport")
      : null;
  const panEl =
    typeof document !== "undefined"
      ? document.querySelector("#camera-pan, .camera-pan")
      : null;
  const worldEl =
    typeof document !== "undefined"
      ? document.querySelector("#world, .world")
      : null;
  let mobileHost =
    typeof document !== "undefined"
      ? document.querySelector("#mobile-sheet, .portfolio-mobile-host")
      : null;

  if (
    !mobileHost &&
    viewportEl &&
    typeof document !== "undefined" &&
    typeof document.createElement === "function"
  ) {
    mobileHost = document.createElement("div");
    mobileHost.id = "mobile-sheet";
    mobileHost.className = "portfolio-mobile-host";
    mobileHost.hidden = true;
    viewportEl.appendChild(mobileHost);
  }

  // Pan host for translate; world for CSS zoom (sharper text/photos than transform scale).
  const cameraHost = panEl || worldEl;

  /** @type {ReturnType<typeof mountScene>} */
  let scene = null;
  /** @type {string|null} */
  let layoutId = null;
  /** @type {"mobile"|"canvas"|null} */
  let mode = null;
  /** @type {ReturnType<typeof createCameraController>|null} */
  let camera = null;
  /** @type {ReturnType<typeof createInfiniteBg>|null} */
  let infiniteBg = null;
  /** @type {(() => void)|null} */
  let unbindInput = null;
  /** @type {(() => void)|null} */
  let unbindInteractions = null;
  /** @type {(() => void)|null} */
  let unbindMobile = null;

  /** Shared InputMode for gesture layer + interactive hits (suppressClicks during Space-pan). */
  const inputMode = {
    spaceDown: false,
    isPanning: false,
    suppressClicks: false,
    cardDragging: false,
  };

  /**
   * @param {boolean} on
   */
  function setMobileClass(on) {
    if (viewportEl?.classList) {
      if (on) {
        viewportEl.classList.add("portfolio--mobile");
      } else {
        viewportEl.classList.remove("portfolio--mobile");
      }
    }
    const body =
      typeof document !== "undefined" ? document.body || null : null;
    if (body?.classList) {
      if (on) {
        body.classList.add("portfolio--mobile");
      } else {
        body.classList.remove("portfolio--mobile");
      }
    }
  }

  /**
   * @param {ReturnType<typeof selectSceneLayout>} layout
   */
  function remount(layout) {
    if (!worldEl || !layout) {
      return null;
    }
    scene = mountScene(worldEl, layout, contentMap, resolveAsset, {
      chromeEl: viewportEl,
    });
    layoutId = layout.id;
    return scene;
  }

  function teardownMobile() {
    if (unbindMobile) {
      unbindMobile();
      unbindMobile = null;
    }
    if (mobileHost) {
      mobileHost.replaceChildren?.();
      mobileHost.hidden = true;
      mobileHost.setAttribute?.("hidden", "");
    }
    setMobileClass(false);
  }

  function teardownCanvas() {
    if (unbindInput) {
      unbindInput();
      unbindInput = null;
    }
    if (unbindInteractions) {
      unbindInteractions();
      unbindInteractions = null;
    }
    if (worldEl?.replaceChildren) {
      worldEl.replaceChildren();
    }
    if (viewportEl && typeof viewportEl.querySelectorAll === "function") {
      for (const old of Array.from(
        viewportEl.querySelectorAll(".scene-chrome")
      )) {
        old.remove?.();
      }
    }
    if (panEl) {
      panEl.hidden = true;
      panEl.setAttribute?.("hidden", "");
    }
    if (infiniteBg?.el?.style) {
      infiniteBg.el.style.display = "none";
    }
    scene = null;
    layoutId = null;
  }

  function ensureCanvasRuntime() {
    if (!camera && cameraHost) {
      infiniteBg = viewportEl ? createInfiniteBg(viewportEl) : null;
      camera = createCameraController(cameraHost || { style: {} }, {
        scaleEl: panEl && worldEl ? worldEl : null,
        getViewportSize: () => readViewportSize(viewportEl),
        getContentAABB: () =>
          scene && scene.contentAABB ? scene.contentAABB : null,
        onApply: (state) => {
          if (infiniteBg) {
            infiniteBg.sync(state);
          }
        },
      });
    }
    if (infiniteBg?.el?.style) {
      infiniteBg.el.style.display = "";
    }
    if (panEl) {
      panEl.hidden = false;
      panEl.removeAttribute?.("hidden");
    }
    if (!unbindInput && viewportEl && camera) {
      unbindInput = bindInput(viewportEl, camera, inputMode);
    }
    if (!unbindInteractions && camera) {
      unbindInteractions = bindInteractions(
        viewportEl || worldEl,
        camera,
        inputMode
      );
    }
  }

  /**
   * Wide (≥1024): fitInteractiveStage; narrow → fitToContent(24).
   */
  function applyStartCamera() {
    if (!camera) {
      return;
    }
    if (isNarrowViewport(viewportEl)) {
      camera.fitToContent(24);
    } else {
      camera.fitInteractiveStage(16);
    }
    camera.apply();
  }

  function enterMobile() {
    teardownCanvas();
    setMobileClass(true);
    if (mobileHost) {
      unbindMobile = mountMobilePortfolio(
        mobileHost,
        contentMap,
        resolveAsset,
        { scrollEl: viewportEl }
      );
    }
    mode = "mobile";
    layoutId = null;
    scene = null;
  }

  function enterCanvas() {
    teardownMobile();
    ensureCanvasRuntime();
    const layout = selectSceneLayout(readViewportSize(viewportEl));
    if (layout) {
      remount(layout);
      applyStartCamera();
    }
    mode = "canvas";
  }

  /**
   * Syncs mobile ↔ canvas mode and remounts canvas layout when artboard changes.
   */
  function syncMode() {
    const size = readViewportSize(viewportEl);
    if (isMobileViewport(size)) {
      if (mode !== "mobile") {
        enterMobile();
      }
      return;
    }
    const next = selectSceneLayout(size);
    if (mode !== "canvas") {
      enterCanvas();
      return;
    }
    if (next && next.id !== layoutId) {
      remount(next);
    }
    applyStartCamera();
  }

  syncMode();

  if (typeof window !== "undefined" && viewportEl) {
    window.addEventListener("resize", () => {
      syncMode();
    });
  }

  return {
    camera,
    worldEl,
    viewportEl,
    scene,
    inputMode,
    layoutId,
    mode: mode || "canvas",
  };
}

if (typeof document !== "undefined") {
  initPortfolioStubs();
}
