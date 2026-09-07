/**
 * Sidebar inventory story: profile, bio, skills, contacts (ds-showcase Composite).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Sidebar",
};

const CHIP_KEYS = [
  "chip.b2b",
  "chip.b2c",
  "chip.design_system",
  "chip.ai_prototyping",
];

const CONTACT_KEYS = [
  "contact.cv",
  "contact.telegram",
  "contact.linkedin",
  "contact.behance",
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
    avatarImg.width = 48;
    avatarImg.height = 48;
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

    const skills = document.createElement("div");
    skills.className = "ds-sidebar__skills";
    const variants = contentMap.chipVariants || {};
    for (const key of CHIP_KEYS) {
      const chip = document.createElement("span");
      const variant = variants[key] === "active" ? "active" : "default";
      chip.className = `ds-chip ds-chip--${variant}`;
      chip.textContent = contentMap[key];
      skills.appendChild(chip);
    }
    inform.append(bio, skills);
    designer.append(profile, inform);

    const contacts = document.createElement("nav");
    contacts.className = "ds-sidebar__contacts";
    contacts.setAttribute("aria-label", "Contacts");
    for (const key of CONTACT_KEYS) {
      const link = document.createElement("a");
      link.className = "ds-link";
      link.href = "#";
      link.textContent = contentMap[key];
      contacts.appendChild(link);
    }

    aside.append(designer, contacts);
    return aside;
  },
};
