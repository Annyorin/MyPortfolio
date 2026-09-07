/**
 * Media inventory story: IMG_BG, IMG_1, IMG_2, IMG_3, Comp (ds-showcase Media).
 */
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Media",
};

/** @type {Array<{ key: string, dataMedia: string, label: string, width: number, height: number }>} */
const MEDIA_SLOTS = [
  {
    key: "img_bg",
    dataMedia: "img_bg",
    label: "IMG_BG",
    width: 345,
    height: 230,
  },
  {
    key: "img_1",
    dataMedia: "img_1",
    label: "IMG_1",
    width: 345,
    height: 230,
  },
  {
    key: "img_2",
    dataMedia: "img_2",
    label: "IMG_2",
    width: 345,
    height: 230,
  },
  {
    key: "img_3",
    dataMedia: "img_3",
    label: "IMG_3",
    width: 345,
    height: 345,
  },
  {
    key: "comp",
    dataMedia: "comp",
    label: "Comp",
    width: 149,
    height: 103,
  },
  {
    key: "me",
    dataMedia: "me",
    label: "me",
    width: 254,
    height: 254,
  },
  {
    key: "macbook",
    dataMedia: "macbook",
    label: "Macbook",
    width: 451,
    height: 319,
  },
];

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const root = document.createElement("div");
    root.className = "ds-media";

    for (const slot of MEDIA_SLOTS) {
      const box = document.createElement("div");
      box.className = "ds-placeholder";
      box.dataset.media = slot.dataMedia;
      box.style.width = `${slot.width}px`;
      box.style.aspectRatio = `${slot.width}/${slot.height}`;
      const img = document.createElement("img");
      img.src = resolveAsset(slot.key);
      img.alt = `${slot.label} media sample`;
      img.width = slot.width;
      img.height = slot.height;
      box.appendChild(img);
      root.appendChild(box);
    }

    return root;
  },
};
