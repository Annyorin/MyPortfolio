/**
 * Reads the page's own dotted grid straight off the DOM.
 *
 * `.scene-infinite-bg` is painted with a CSS gradient recomputed from the camera,
 * so its offset depends on where the camera stood at load time and its size on
 * the zoom. Hardcoded constants do not work here — the parameters have to be
 * taken from the live element.
 *
 * @param {Element|null} el
 * @returns {{ cell: number, gridDotRadius: number, gridOffsetX: number,
 *             gridOffsetY: number, colorGrid: number|undefined }|null}
 */
export function readSiteGrid(el) {
  if (!el || typeof getComputedStyle !== "function") return null;

  const style = getComputedStyle(el);
  const image = style.backgroundImage || "";
  const size = /([\d.]+)px\s+([\d.]+)px/.exec(style.backgroundSize);
  const position = /(-?[\d.]+)px\s+(-?[\d.]+)px/.exec(style.backgroundPosition);
  // Browsers drop the `circle` keyword in computed styles, so it is optional:
  // the stable part is "<radius>px at <x>px <y>px".
  const shape = /(?:circle\s+)?([\d.]+)px\s+at\s+([\d.]+)px\s+([\d.]+)px/.exec(image);
  const color = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(image);
  if (!size || !position || !shape) return null;

  const cell = parseFloat(size[1]);
  const dot = parseFloat(shape[1]);
  if (!(cell > 0) || !(dot > 0)) return null;

  return {
    cell,
    gridDotRadius: dot,
    // background-position sets the tile corner; "at x y" is the dot centre in it.
    gridOffsetX: parseFloat(position[1]) + parseFloat(shape[2]),
    gridOffsetY: parseFloat(position[2]) + parseFloat(shape[3]),
    colorGrid: color ? Number(color[1]) : undefined,
  };
}
