import vue from "@vitejs/plugin-vue"
import path from "path"
import { defineConfig } from "vite"

import autoprefixer from "autoprefixer"
import tailwind from "tailwindcss"

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})