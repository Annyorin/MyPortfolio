/**
 * Production build with GitHub Pages base `/MyPortfolio/`.
 */
process.env.GITHUB_PAGES = "1";
await import("./build.mjs");
