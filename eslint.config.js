import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
    ignores: ["infra/migrations", "test"],
  },
  {
    files: ["test/**"],
    ...jest.configs["flat/recommended"],
  },
  pluginJs.configs.recommended,
];
