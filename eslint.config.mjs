import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "eslint-config-next";

export default [
  ...nextPlugin.configs["core-web-vitals"],
];
import next from 'eslint-config-next/core-web-vitals.js' 
import { defineConfig } from "eslint/config";
import next from "eslint-config-next/core-web-vitals.js"; //.js lagao
export default [];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
