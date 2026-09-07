/**
 * Portfolio entry: Scene Renderer + camera start (architecture §3.2 Portfolio App).
 * Init order: mountScene → createCamera → stage-fit (≥1024) or fitToContent → apply → bindInput → bindInteractions.
 * ≥1024 wide: Figma 51:4107 card arrangement, scaled/centered in the interactive right stage.
 */
import { contentMap } from "../../shared/content.js";
import { selectSceneLayout } from "../../shared/layout.js";
import { createCameraController } from "./camera.js";
import { createInfiniteBg } from "./infiniteBg.js";
import { bindInput } from "./input.js";
import { bindInteractions } from "./interactions.js";
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
 *
 * @returns {{
 *   camera: ReturnType<typeof createCameraController>,
 *   worldEl: Element|null,
 *   viewportEl: Element|null,
 *   scene: ReturnType<typeof mountScene>,
 *   inputMode: {spaceDown: boolean, isPanning: boolean, suppressClicks: boolean},
 *   layoutId: string|null
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
  // Pan host for translate; world for CSS zoom (sharper text/photos than transform scale).
  const cameraHost = panEl || worldEl;

  /** @type {ReturnType<typeof mountScene>} */
  let scene = null;
  /** @type {string|null} */
  let layoutId = null;

  /**
   * @param {ReturnType<typeof selectSceneLayout>} layout
   */
  function remount(layout) {
    if (!worldEl) {
      return null;
    }
    scene = mountScene(worldEl, layout, contentMap, resolveAsset, {
      chromeEl: viewportEl,
    });
    layoutId = layout.id;
    return scene;
  }

  const initialLayout = selectSceneLayout(readViewportSize(viewportEl));
  remount(initialLayout);

  const infiniteBg = viewportEl ? createInfiniteBg(viewportEl) : null;

  const camera = createCameraController(cameraHost || { style: {} }, {
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
  // Wide (≥1024): cards+about fitted/centered in right interactive stage.
  // Narrow: fitToContent(24).
  const startState = camera.getState();
  void startState;

  /**
   * Wide (≥1024): fitInteractiveStage; narrow → fitToContent(24).
   */
  function applyStartCamera() {
    if (isNarrowViewport(viewportEl)) {
      camera.fitToContent(24);
    } else {
      camera.fitInteractiveStage(16);
    }
  }

  applyStartCamera();
  camera.apply();

  /** Shared InputMode for gesture layer + interactive hits (suppressClicks during Space-pan). */
  const inputMode = {
    spaceDown: false,
    isPanning: false,
    suppressClicks: false,
    cardDragging: false,
  };
  bindInput(viewportEl, camera, inputMode);
  // Viewport root covers fixed chrome (sidebar/tapper) + scaled world.
  bindInteractions(viewportEl || worldEl, camera, inputMode);

  if (typeof window !== "undefined" && viewportEl && worldEl) {
    window.addEventListener("resize", () => {
      const next = selectSceneLayout(readViewportSize(viewportEl));
      if (next.id !== layoutId) {
        remount(next);
      }
      applyStartCamera();
    });
  }

  return { camera, worldEl, viewportEl, scene, inputMode, layoutId };
}

if (typeof document !== "undefined") {
  initPortfolioStubs();
}
