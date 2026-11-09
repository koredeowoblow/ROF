import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'ROF RAGE | Destined for riches',
        short_name: 'ROF RAGE',
        description: 'ROF RAGE clothing and fashion. Destined for riches.',
        theme_color: '#0e2f2f',
        background_color: '#0e2f2f',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect width="192" height="192" fill="%230e2f2f"/%3E%3Cpolygon points="96,16 176,96 96,176 16,96" fill="%23f0b429"/%3E%3Cpolygon points="96,44 148,96 96,148 44,96" fill="%230e2f2f"/%3E%3C/svg%3E',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"%3E%3Crect width="512" height="512" fill="%230e2f2f"/%3E%3Cpolygon points="256,40 472,256 256,472 40,256" fill="%23f0b429"/%3E%3Cpolygon points="256,120 392,256 256,392 120,256" fill="%230e2f2f"/%3E%3C/svg%3E',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Google Font Stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google WebFont binaries (.woff2)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Product Images and SVG Assets
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-image-assets',
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'vendor-react'
            if (id.includes('motion')) return 'vendor-motion'
            if (id.includes('@tanstack/react-query') || id.includes('@tanstack/react-router')) return 'vendor-tanstack'
            if (id.includes('@radix-ui')) return 'vendor-radix'
            if (id.includes('@tanstack/react-table') || id.includes('@tanstack/react-virtual')) return 'vendor-table'
            if (id.includes('lucide-react')) return 'vendor-lucide'
            if (id.includes('zod')) return 'vendor-zod'
          }
          if (id.includes('/src/routes/admin/')) return 'route-admin'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3000,
  },
})
