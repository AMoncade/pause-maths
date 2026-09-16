// Propriété du lot PWA.
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: '/',
        name: 'Pause Maths',
        short_name: 'Pause Maths',
        description: 'Questions rapides sur MAT1400, MAT1500, MAT1600 et STT1700, pour les temps morts.',
        lang: 'fr-CA',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        theme_color: '#1a2340',
        background_color: '#edf1f8',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Les .woff2 de KaTeX passent par ce glob une fois importés (vérifié :
        // `import 'katex/dist/katex.min.css'` fait atterrir chaque police dans
        // dist/assets/*.woff2, donc pas besoin d'includeAssets pour elles).
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,woff2}'],
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
    }),
  ],
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString()) },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
