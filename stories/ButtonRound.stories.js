/**
 * ButtonRound inventory stories (Figma 416:17567).
 * Style Text / Outlined · State default / Hover / Pressed / Filled · icons moon / sun.
 */
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "ButtonRound",
};

/**
 * @param {{
 *   outlined?: boolean,
 *   hover?: boolean,
 *   pressed?: boolean,
 *   icon?: "moon" | "sun",
 *   label: string,
 * }} opts
 * @returns {HTMLButtonElement}
 */
function renderButtonRound(opts) {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", opts.label);

  const classes = ["ds-button-round"];
  if (opts.outlined) classes.push("ds-button-round--outlined");
  if (opts.hover) classes.push("ds-button-round--hover");
  if (opts.pressed) classes.push("ds-button-round--pressed");
  el.className = classes.join(" ");

  const iconName = opts.icon || "moon";
  const icon = document.createElement("span");
  icon.className = "ds-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.icon = iconName;

  const img = document.createElement("img");
  img.src = resolveAsset(iconName === "sun" ? "icons.sun" : "icons.moon");
  img.alt = "";
  img.width = 24;
  img.height = 24;
  icon.appendChild(img);
  el.appendChild(icon);
  return el;
}

export const TextDefault = {
  name: "Text default",
  render: () =>
    renderButtonRound({ label: "Text default", icon: "moon" }),
};

export const TextHover = {
  name: "Text Hover",
  render: () =>
    renderButtonRound({ label: "Text Hover", icon: "moon", hover: true }),
};

export const TextPressed = {
  name: "Text Pressed",
  render: () =>
    renderButtonRound({ label: "Text Pressed", icon: "moon", pressed: true }),
};

export const OutlinedFilled = {
  name: "Outlined Filled",
  render: () =>
    renderButtonRound({
      label: "Outlined Filled",
      icon: "moon",
      outlined: true,
    }),
};

export const OutlinedHover = {
  name: "Outlined Hover",
  render: () =>
    renderButtonRound({
      label: "Outlined Hover",
      icon: "moon",
      outlined: true,
      hover: true,
    }),
};

export const TextDarkSun = {
  name: "Text Dark sun",
  render: () =>
    renderButtonRound({ label: "Text Dark sun", icon: "sun" }),
};
