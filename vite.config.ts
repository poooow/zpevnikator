import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: 'Zpěvníkátor',
        short_name: 'Zpěvníkátor',
        description: 'Zpěvníkátor',
        theme_color: '#ffffff',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,wasm}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        additionalManifestEntries: [
          { url: '/sql-wasm.wasm', revision: null }
        ],
      },
      includeAssets: ['**/*.{js,css,html,svg,png,ico,wasm}'],
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
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
    commonjsOptions: {
      // Ensure SQL.js is properly bundled
      include: [/node_modules/]
    }
  },
  server: {
    fs: {
      // Allow serving files from the project root
      allow: ['..']
    }
  }
})