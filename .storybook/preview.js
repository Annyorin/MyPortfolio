/**
 * Storybook preview: DS CSS from ds-showcase; light/dark via data-theme toolbar.
 * Dark tokens: html[data-theme="dark"] in tokens.css (Figma DarkColors 383:15362).
 */
import "../ds-showcase/css/tokens.css";
import "../ds-showcase/css/components.css";

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  globalTypes: {
    theme: {
      description: "Portfolio light / dark tokens",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "page",
      values: [
        { name: "page", value: "#f5f5f5" },
        { name: "page-dark", value: "#121214" },
        { name: "white", value: "#fefefe" },
        { name: "surface-dark", value: "#232323" },
        { name: "secondary", value: "#ededed" },
      ],
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light";
      const html = document.documentElement;
      if (theme === "dark") html.setAttribute("data-theme", "dark");
      else html.removeAttribute("data-theme");

      // Keep canvas bg in sync with theme when using the default page swatch.
      const bg = context.globals.backgrounds?.value;
      const isDefaultPage =
        !bg || bg === "#f5f5f5" || bg === "#121214" || bg === "#fefefe";
      if (isDefaultPage && context.globals.backgrounds) {
        context.globals.backgrounds.value =
          theme === "dark" ? "#121214" : "#f5f5f5";
      }

      const el = story();
      if (el instanceof HTMLElement) {
        el.style.color = "var(--color-black)";
      }
      return el;
    },
  ],
};

export default preview;
