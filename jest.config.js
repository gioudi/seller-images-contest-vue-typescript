const path = require("path");

module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!vue3-carousel/dist/carousel.css)",
  ],
  setupFiles: [path.resolve(__dirname, "tests/unit/setup.js")],
};
