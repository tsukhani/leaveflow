import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships flat config directly, so FlatCompat is not needed.
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "src/generated/**",
      ".next/**",
      "node_modules/**",
      "reports/**",
      ".stryker-tmp/**",
      "coverage/**",
    ],
  },
];

export default eslintConfig;
