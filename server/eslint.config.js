import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
    globalIgnores(["node_modules", "generated", "package-lock.json"]),
    {
        files: ["**/*.js"],
        extends: [js.configs.recommended],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            "no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
            ],
        },
    },
    prettier,
]);
