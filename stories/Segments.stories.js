/**
 * SegmentsControl inventory stories: interactive sliding thumb (Figma Segmets_control).
 */
import { contentMap } from "../shared/content.js";
import { bindSegmentsControl } from "../ds-showcase/js/segments.js";

export default {
  title: "Segments",
};

/**
 * @param {"long" | "short"} active
 * @returns {HTMLElement}
 */
function renderSegments(active) {
  const root = document.createElement("div");
  root.className = "ds-segments";
  root.setAttribute("role", "tablist");
  root.dataset.active = active === "short" ? "1" : "0";
  root.setAttribute(
    "aria-label",
    active === "long"
      ? `${contentMap["segments.long"]} активна`
      : `${contentMap["segments.short"]} активна`
  );

  const thumb = document.createElement("span");
  thumb.className = "ds-segments__thumb";
  thumb.setAttribute("aria-hidden", "true");

  const longBtn = document.createElement("button");
  longBtn.type = "button";
  longBtn.className = "ds-segments__item";
  longBtn.setAttribute("role", "tab");
  longBtn.textContent = contentMap["segments.long"];

  const shortBtn = document.createElement("button");
  shortBtn.type = "button";
  shortBtn.className = "ds-segments__item";
  shortBtn.setAttribute("role", "tab");
  shortBtn.textContent = contentMap["segments.short"];

  if (active === "long") {
    longBtn.classList.add("ds-segments__item--active");
    longBtn.setAttribute("aria-selected", "true");
    shortBtn.setAttribute("aria-selected", "false");
    shortBtn.tabIndex = -1;
  } else {
    shortBtn.classList.add("ds-segments__item--active");
    shortBtn.setAttribute("aria-selected", "true");
    longBtn.setAttribute("aria-selected", "false");
    longBtn.tabIndex = -1;
  }

  root.append(thumb, longBtn, shortBtn);
  bindSegmentsControl(root);
  return root;
}

export const Long = {
  render: () => renderSegments("long"),
};

export const Short = {
  render: () => renderSegments("short"),
};

export const Interactive = {
  name: "Interactive",
  render: () => renderSegments("long"),
};
