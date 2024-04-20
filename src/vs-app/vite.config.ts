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
        '/biology': {
          target: 'https://health.api.nvidia.com/',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/biology/, ''),     
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
        },

        '/upload': {
          target: 'https://api.nvcf.nvidia.com/',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/upload/, ''),     
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
        },

        '/amazon': {
          target: 'https://nv-gdn-strap-assets-prd.s3-accelerate.amazonaws.com/',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/amazon/, ''),     
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
        },
        '/openbabel': {
          target: 'https://openbabel.cheminfo.org',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/openbabel/, ''),     
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