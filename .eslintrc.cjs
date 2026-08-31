module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": "warn",
    "no-debugger": "warn",
  },
  overrides: [
    {
      files: ["**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};
