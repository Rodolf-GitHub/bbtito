import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:8000'
  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const isDev = mode === 'development'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        strategies: 'generateSW',
        devOptions: {
          enabled: isDev,
          type: 'module',
        },
        includeAssets: [
          'favicon.ico',
          'bbtito_logo.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'wide-1280x720.png',
          'narrow-540x720.png',
        ],
        manifest: {
          id: '/',
          name: 'BBTito',
          short_name: 'BBTito',
          description: 'Catálogo de moda BBTito',
          start_url: '/?source=pwa',
          scope: '/',
          display: 'standalone',
          theme_color: '#ff2d95',
          background_color: '#ffffff',
          lang: 'es',
          screenshots: [
            {
              src: '/wide-1280x720.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Catálogo principal',
            },
            {
              src: '/narrow-540x720.png',
              sizes: '540x720',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Vista móvil',
            },
          ],
          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${escapeRegExp(apiBaseUrl)}/.*`),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
