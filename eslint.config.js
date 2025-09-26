// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "react-hooks/exhaustive-deps": "off",
      "import/first": "off",
      "@typescript-eslint/array-type": "off",
    },
  },
]);
