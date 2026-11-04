import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
    // Relative paths so the build works from any folder, e.g. a GitHub Pages project site
    base: "./",
    plugins: [vue(), vuetify({ autoImport: true })],
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
        globals: true,
        include: ["src/**/*.spec.ts"],
    },
});
