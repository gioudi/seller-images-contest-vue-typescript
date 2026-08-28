const { defineConfig } = require("@vue/cli-service");
const dotenv = require("dotenv");

dotenv.config();

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
      },
    },
  },
});
