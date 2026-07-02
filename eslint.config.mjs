import { defineConfig, globalIgnores } from "eslint/config";

// Импорты конфигов Next.js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Импорты дополнительных плагинов
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // Базовые конфиги Next.js
  ...nextVitals,
  ...nextTs,

  // Игнорируемые директории и файлы
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "dist/**",
    "coverage/**",
    ".vercel/**",
    ".github/**",
    ".idea/**",
  ]),

  // Основная конфигурация для TypeScript-файлов
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "import": importPlugin,
      "prettier": prettier,
    },
    rules: {
      // Запрещаем any и ts-ignore
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Порядок импортов (для чистоты)
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // JSX доступность (a11y) — базовые правила
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // Prettier: отключаем правила, которые конфликтуют с Prettier
      ...prettierConfig.rules,
      "prettier/prettier": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
      react: {
        version: "detect",
      },
    },
  },
]);
