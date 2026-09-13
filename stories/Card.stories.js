/**
 * Card inventory stories: default and hover modifier (Figma Card 40:1208).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Card",
};

/**
 * @param {"default" | "hover"} variant
 * @returns {HTMLElement}
 */
function renderCard(variant) {
  const article = document.createElement("article");
  article.className =
    variant === "hover" ? "ds-card ds-card--hover" : "ds-card ds-card--default";

  const media = document.createElement("div");
  media.className = "ds-card__media ds-placeholder";
  const img = document.createElement("img");
  img.src = resolveAsset("card.image");
  img.alt = "Card default cover";
  img.width = 308;
  img.height = 172;
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "ds-card__body";
  const header = document.createElement("div");
  header.className = "ds-card__header";
  const titleGroup = document.createElement("div");
  titleGroup.className = "ds-card__title-group";
  const title = document.createElement("h3");
  title.className = "ds-card__title";
  title.textContent = contentMap["card.kit.title"];
  const meta = document.createElement("p");
  meta.className = "ds-card__meta";
  meta.textContent = contentMap["card.kit.meta"];
  titleGroup.append(title, meta);
  header.appendChild(titleGroup);
  const chip = document.createElement("span");
  chip.className = "ds-chip ds-chip--default ds-card__chip";
  chip.textContent = contentMap["card.kit.chip"];
  header.appendChild(chip);
  const description = document.createElement("p");
  description.className = "ds-card__description";
  description.textContent = contentMap["card.kit.description"];
  body.append(header, description);

  article.append(media, body);
  return article;
}

export const Default = {
  render: () => renderCard("default"),
};

export const Hover = {
  render: () => renderCard("hover"),
};
