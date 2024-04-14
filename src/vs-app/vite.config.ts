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
    server: {
      proxy: {
        '/api': {
          target: 'https://health.api.nvidia.com/',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/api/, ''),     
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }

    },
  }  )