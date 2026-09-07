/**
 * Profile inventory story: avatar + name/role (ds-showcase Atomic).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Profile",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const root = document.createElement("div");
    root.className = "ds-profile";

    const avatar = document.createElement("div");
    avatar.className = "ds-avatar ds-placeholder";
    avatar.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.src = resolveAsset("avatar");
    img.alt = "";
    img.width = 48;
    img.height = 48;
    avatar.appendChild(img);

    const meta = document.createElement("div");
    meta.className = "ds-profile__meta";
    const name = document.createElement("span");
    name.className = "ds-profile__name";
    name.textContent = contentMap["profile.name"];
    const role = document.createElement("span");
    role.className = "ds-profile__role";
    role.textContent = contentMap["profile.role"];
    meta.append(name, role);

    root.append(avatar, meta);
    return root;
  },
};
