/**
 * Card inventory stories: default and hover modifier (ds-showcase Composite).
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
  img.alt = `${contentMap["card.title"]} project cover`;
  img.width = 310;
  img.height = 180;
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "ds-card__body";
  const header = document.createElement("div");
  header.className = "ds-card__header";
  const title = document.createElement("h3");
  title.className = "ds-card__title";
  title.textContent = contentMap["card.title"];
  const meta = document.createElement("p");
  meta.className = "ds-card__meta";
  meta.textContent = contentMap["card.meta"];
  header.append(title, meta);
  const description = document.createElement("p");
  description.className = "ds-card__description";
  description.textContent = contentMap["card.description"];
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
