import { fileURLToPath, URL } from 'node:url'

import * as devCerts from 'office-addin-dev-certs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import officeAddin from 'vite-plugin-office-addin'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const httpsOptions = await devCerts.getHttpsServerOptions()
  return {
    plugins: [
      vue(),
      officeAddin({
        devUrl: 'https://localhost:3000',
        prodUrl: 'https://crm-bridge.bf0.ch'
      }),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'CRM Bridge',
          short_name: 'CRM Bridge',
          description: 'Connect multiple CRM endpoints and lookup e-mail contacts',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'assets/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'assets/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
          ]
        },
        workbox: {
          navigateFallbackDenylist: [/\/login\.html\?/]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 3000,
      https: httpsOptions
    }
  }
})
