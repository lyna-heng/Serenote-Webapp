import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/Serenote-Webapp/',
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
