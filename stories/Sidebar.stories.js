/**
 * Sidebar inventory story: profile, bio, action buttons, copyright (Ui kit 158:11468).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Sidebar",
};

const CONTACT_ACTIONS = [
  { key: "contact.telegram", variant: "primary", icon: "icons.telegram" },
  { key: "contact.cv", variant: "secondary", icon: "icons.cv" },
  { key: "contact.behance", variant: "secondary", icon: "icons.behance" },
  { key: "contact.mail", variant: "secondary", icon: "icons.mail" },
];

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const aside = document.createElement("aside");
    aside.className = "ds-sidebar";

    const designer = document.createElement("div");
    designer.className = "ds-sidebar__designer";

    const profile = document.createElement("div");
    profile.className = "ds-sidebar__profile ds-profile";

    const avatar = document.createElement("div");
    avatar.className = "ds-avatar ds-placeholder";
    avatar.setAttribute("aria-hidden", "true");
    const avatarImg = document.createElement("img");
    avatarImg.src = resolveAsset("avatar");
    avatarImg.alt = "";
    avatarImg.width = 90;
    avatarImg.height = 90;
    avatar.appendChild(avatarImg);

    const meta = document.createElement("div");
    meta.className = "ds-profile__meta";
    const name = document.createElement("span");
    name.className = "ds-profile__name";
    name.textContent = contentMap["profile.name"];
    const role = document.createElement("span");
    role.className = "ds-profile__role";
    role.textContent = contentMap["profile.role"];
    meta.append(name, role);
    profile.append(avatar, meta);

    const inform = document.createElement("div");
    inform.className = "ds-sidebar__inform";
    const bio = document.createElement("p");
    bio.className = "ds-sidebar__bio";
    bio.textContent = contentMap["sidebar.bio"];

    const actions = document.createElement("div");
    actions.className = "ds-sidebar__skills";
    actions.setAttribute("aria-label", "Contacts");
    for (const action of CONTACT_ACTIONS) {
      const btn = document.createElement("a");
      btn.className = `ds-button ds-button--${action.variant}`;
      btn.href = "#";
      const icon = document.createElement("span");
      icon.className = "ds-icon";
      icon.setAttribute("aria-hidden", "true");
      const iconImg = document.createElement("img");
      iconImg.src = resolveAsset(action.icon);
      iconImg.alt = "";
      iconImg.width = 20;
      iconImg.height = 20;
      icon.appendChild(iconImg);
      const label = document.createElement("span");
      label.className = "ds-button__label";
      label.textContent = contentMap[action.key];
      btn.append(icon, label);
      actions.appendChild(btn);
    }
    inform.append(bio, actions);
    designer.append(profile, inform);

    const copyright = document.createElement("p");
    copyright.className = "ds-sidebar__copyright";
    copyright.textContent = contentMap["sidebar.copyright"];

    aside.append(designer, copyright);
    return aside;
  },
};
