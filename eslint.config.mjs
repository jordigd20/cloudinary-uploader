import globals from "globals";
import tseslint from "typescript-eslint";
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    languageOptions: { globals: globals.node },
    ignores: ["node_modules/", "dist/"],
  },
  ...tseslint.configs.recommended,
  prettierConfig
];