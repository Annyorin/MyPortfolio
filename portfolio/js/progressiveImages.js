/**
 * Progressive image loading: a light twin first, the original afterwards.
 *
 * The scene builders receive `resolveAsset` as a parameter, so progressiveness
 * is injected the same way — by wrapping that resolver. Nothing in the rendering
 * code has to know about it: the wrapper hands out twin URLs and remembers which
 * original each one stands for, and `upgradeImages` swaps them back once the
 * page is on screen.
 *
 * The boot loader only waits for the twins (roughly a quarter of the weight), so
 * the page is handed over sooner.
 */
import { LOW_RES_IMAGES } from "../../shared/lowResImages.js";

/** twin URL → original URL, filled in as the scene resolves its assets. */
const ORIGINALS = new Map();

/**
 * The twin's URL for a resolved asset URL, if that asset has one.
 *
 * @param {string} url
 * @returns {string|null}
 */
export function twinUrlFor(url) {
  if (typeof url !== "string") return null;
  const marker = "/assets/";
  const at = url.lastIndexOf(marker);
  if (at < 0) return null;

  const pathFromAssets = url.slice(at + marker.length);
  const twin = LOW_RES_IMAGES[pathFromAssets];
  return twin ? url.slice(0, at + marker.length) + twin : null;
}

/**
 * Wraps a resolver so it hands out light twins where they exist.
 *
 * @param {(key: string, options?: object) => string} resolve
 * @returns {(key: string, options?: object) => string}
 */
export function withProgressiveAssets(resolve) {
  return (key, options) => {
    const full = resolve(key, options);
    const twin = twinUrlFor(full);
    if (!twin) return full;

    ORIGINALS.set(twin, full);
    return twin;
  };
}

/**
 * Replaces every preview on the page with its original. Safe to call twice.
 *
 * @param {ParentNode} [root]
 * @returns {Promise<number>} how many images were upgraded
 */
export function upgradeImages(root = document) {
  const images = Array.from(root.querySelectorAll?.("img") ?? []);
  const pending = images.filter((img) => ORIGINALS.has(img.getAttribute("src")));

  return Promise.all(
    pending.map((img) => new Promise((resolve) => {
      const full = ORIGINALS.get(img.getAttribute("src"));
      const probe = new Image();
      probe.onload = () => {
        // Decode before swapping, otherwise the change lands as a flicker.
        const decoded = typeof probe.decode === "function" ? probe.decode() : null;
        const apply = () => {
          img.src = full;
          resolve(1);
        };
        if (decoded) decoded.then(apply, apply);
        else apply();
      };
      probe.onerror = () => resolve(0); // the preview stays, which is fine
      probe.src = full;
    }))
  ).then((results) => results.reduce((sum, n) => sum + n, 0));
}
