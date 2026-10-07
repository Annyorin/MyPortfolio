/**
 * Hint panel inventory (Figma Hint 603:18197 · mouse / trackpad).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";
import { textOf } from "../shared/typography.js";

/**
 * @param {"mouse" | "trackpad"} variant
 * @returns {HTMLElement}
 */
function renderHintPanel(variant) {
  const isMouse = variant === "mouse";
  const root = document.createElement("article");
  root.className = "ds-hint-panel";
  root.dataset.variant = variant;

  const header = document.createElement("header");
  header.className = "ds-hint-panel__header";
  const tabs = document.createElement("div");
  tabs.className = "ds-hint-panel__tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Устройство");

  const mouseTab = document.createElement("span");
  mouseTab.className = isMouse
    ? "ds-title-sidebar"
    : "ds-title-sidebar ds-title-sidebar--muted";
  mouseTab.setAttribute("role", "tab");
  mouseTab.setAttribute("aria-selected", isMouse ? "true" : "false");
  mouseTab.textContent = textOf(contentMap["hint.panel.tab.mouse"]);

  const padTab = document.createElement("span");
  padTab.className = isMouse
    ? "ds-title-sidebar ds-title-sidebar--muted"
    : "ds-title-sidebar";
  padTab.setAttribute("role", "tab");
  padTab.setAttribute("aria-selected", isMouse ? "false" : "true");
  padTab.textContent = textOf(contentMap["hint.panel.tab.trackpad"]);
  tabs.append(mouseTab, padTab);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "ds-hint-panel__close";
  close.setAttribute("aria-label", textOf(contentMap["hint.panel.close"]));
  const closeIcon = document.createElement("span");
  closeIcon.className = "ds-icon";
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.dataset.icon = "close";
  const closeImg = document.createElement("img");
  closeImg.src = resolveAsset("icons.close");
  closeImg.alt = "";
  closeImg.width = 20;
  closeImg.height = 20;
  closeIcon.appendChild(closeImg);
  close.appendChild(closeIcon);
  header.append(tabs, close);

  const body = document.createElement("div");
  body.className = "ds-hint-panel__body";

  const rows = isMouse
    ? [
        {
          icon: "icons.mouse-zoom",
          dataIcon: "mouseZoom",
          label: "hint.panel.zoom_label",
          body: "hint.panel.mouse.zoom",
          key: "Ctrl",
        },
        {
          icon: "icons.mouse-move",
          dataIcon: "mouseMove",
          label: "hint.panel.move_label",
          body: "hint.panel.mouse.move",
          key: "Space",
        },
      ]
    : [
        {
          icon: "icons.hand-zoom",
          dataIcon: "handZoom",
          label: "hint.panel.zoom_label",
          body: "hint.panel.trackpad.zoom",
        },
        {
          icon: "icons.hand-move",
          dataIcon: "handMove",
          label: "hint.panel.move_label",
          body: "hint.panel.trackpad.move",
        },
      ];

  for (const row of rows) {
    const line = document.createElement("div");
    line.className = "ds-hint-panel__row";
    const icon = document.createElement("span");
    icon.className = "ds-icon ds-icon--32";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.icon = row.dataIcon;
    const img = document.createElement("img");
    img.src = resolveAsset(row.icon);
    img.alt = "";
    img.width = 32;
    img.height = 32;
    icon.appendChild(img);
    const p = document.createElement("p");
    p.className = "ds-hint-panel__text";
    const label = document.createElement("span");
    label.className = "ds-hint-panel__label";
    label.textContent = `${textOf(contentMap[row.label])} `;
    p.appendChild(label);
    const bodyText = textOf(contentMap[row.body]);
    if (row.key) {
      const parts = bodyText.split(row.key);
      p.appendChild(document.createTextNode(parts[0] || "Зажми "));
      const key = document.createElement("span");
      key.className = "ds-hint-panel__key";
      key.textContent = row.key;
      p.appendChild(key);
      p.appendChild(document.createTextNode(parts[1] || ""));
    } else {
      p.appendChild(document.createTextNode(bodyText));
    }
    line.append(icon, p);
    body.appendChild(line);
  }

  root.append(header, body);
  return root;
}

export default {
  title: "HintPanel",
};

export const Mouse = {
  render: () => renderHintPanel("mouse"),
};

export const Trackpad = {
  render: () => renderHintPanel("trackpad"),
};
