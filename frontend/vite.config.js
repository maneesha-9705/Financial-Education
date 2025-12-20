import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Force restart for index.html update
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Financial Education App',
        short_name: 'Clari-Fi',
        description: 'Clarity and Capital',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'fin1.png',      // Matches your 192x192 file
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'fin.png',       // Matches your 512x512 file
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        id: '/',
        screenshots: [
          {
            src: 'fin.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Financial Education App Desktop'
          },
          {
            src: 'fin.png',
            sizes: '512x512',
            type: 'image/png',
            label: 'Financial Education App Mobile'
          }
        ]
      }
    })
  ]
})
