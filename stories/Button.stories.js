/**
 * Button inventory stories: primary, secondary, text (+ static hover).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Button",
};

/**
 * @param {"primary" | "secondary" | "text"} variant
 * @param {{ hover?: boolean, label: string, iconKey: string, dataIcon: string }} opts
 * @returns {HTMLAnchorElement}
 */
function renderButton(variant, opts) {
  const el = document.createElement("a");
  el.href = "#";
  el.className = opts.hover
    ? `ds-button ds-button--${variant} ds-button--hover`
    : `ds-button ds-button--${variant}`;

  const icon = document.createElement("span");
  icon.className = "ds-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.icon = opts.dataIcon;
  const img = document.createElement("img");
  img.src = resolveAsset(opts.iconKey);
  img.alt = "";
  img.width = 20;
  img.height = 20;
  icon.appendChild(img);

  el.append(icon, document.createTextNode(opts.label));
  return el;
}

export const Primary = {
  render: () =>
    renderButton("primary", {
      label: contentMap["contact.telegram"],
      iconKey: "icons.telegram",
      dataIcon: "telegram",
    }),
};

export const Secondary = {
  render: () =>
    renderButton("secondary", {
      label: contentMap["contact.cv"],
      iconKey: "icons.cv",
      dataIcon: "cv",
    }),
};

export const Text = {
  render: () =>
    renderButton("text", {
      label: contentMap["button.home"],
      iconKey: "icons.arrow-left",
      dataIcon: "vuesax/linear/arrow-left",
    }),
};

export const TextHover = {
  name: "Text Hover",
  render: () =>
    renderButton("text", {
      hover: true,
      label: contentMap["button.home"],
      iconKey: "icons.arrow-left",
      dataIcon: "vuesax/linear/arrow-left",
    }),
};
