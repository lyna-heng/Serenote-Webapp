import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: '/Serenote-Webapp/',
  plugins: [tailwindcss(), tsconfigPaths()],
});
