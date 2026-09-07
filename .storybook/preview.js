/**
 * Storybook preview: DS CSS from ds-showcase; light backgrounds as showcase.
 */
import "../ds-showcase/css/tokens.css";
import "../ds-showcase/css/components.css";

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "page",
      values: [
        { name: "page", value: "#fefefe" },
        { name: "white", value: "#ffffff" },
        { name: "secondary", value: "#ededed" },
      ],
    },
  },
};

export default preview;
