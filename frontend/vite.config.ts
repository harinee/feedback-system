import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Enable more verbose logging
console.log('Loading Vite configuration');

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: 'info',
  clearScreen: false,
  plugins: [
    react(),
    // Using a simple history fallback plugin
    {
      name: 'spa-history-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Skip if the request is for a file (has extension)
          if (req.url && req.url.includes('.')) {
            return next();
          }
          
          // For all other requests, serve index.html
          req.url = '/';
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    hmr: { overlay: true },
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
});
