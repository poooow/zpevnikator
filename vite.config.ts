import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
// If deploying to a subdirectory, set the base URL to match your deployment path
// For root deployment, use '/'
export default defineConfig({
  base: '/',
  server: {
    // Allow serving files from the project root
    fs: {
      allow: ['..']
    }
  },
  preview: {
    // Configure the preview server to handle SPA routing
    port: 4174,
    strictPort: true,
    // This handles SPA fallback in production preview
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  },
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Zpěvníkátor',
        short_name: 'Zpěvníkátor',
        description: 'Zpěvníkátor',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        scope: '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'maskable-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,wasm}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html',
        additionalManifestEntries: [
          { url: '/sql-wasm.wasm', revision: null }
        ],
      },
      includeAssets: ['**/*.{js,css,html,svg,png,ico,wasm}'],
      devOptions: {
        enabled: false,
        type: 'module',
      },
    })
  ],
  optimizeDeps: {
    // Include SQL.js in the optimized dependencies
    include: ['sql.js'],
    esbuildOptions: {
      // Enable support for top-level await
      target: 'esnext'
    }
  },
  build: {
    target: 'esnext', // Needed for top-level await
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
    commonjsOptions: {
      // Ensure SQL.js is properly bundled
      include: [/node_modules/]
    }
  }
})