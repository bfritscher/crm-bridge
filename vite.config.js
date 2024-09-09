import { fileURLToPath, URL } from 'node:url'

import * as devCerts from 'office-addin-dev-certs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import officeAddin from 'vite-plugin-office-addin'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const httpsOptions = await devCerts.getHttpsServerOptions()
  return {
    plugins: [
      vue(),
      officeAddin({
        devUrl: 'https://localhost:3000',
        prodUrl: 'https://crm-bridge.bf0.ch'
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
