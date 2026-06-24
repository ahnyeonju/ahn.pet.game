import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

// HTTPS 환경변수가 있을 때만 자체 서명 HTTPS 적용(폰 카메라 테스트용). 평소 dev는 http 유지.
export default defineConfig({
  base: '/ahn.pet.game/',
  plugins: [
    react(),
    ...(process.env.HTTPS ? [basicSsl()] : []),
    VitePWA({
      registerType: 'autoUpdate',   // 새 빌드 시 SW 자동 갱신
      injectRegister: 'auto',       // 등록 코드 자동 주입 (prod만, dev HMR 안전)
      manifest: {
        name: '타마고치 키우기',
        short_name: '타마고치',
        description: '다마고치류 펫 키우기 게임',
        lang: 'ko',
        theme_color: '#88d8b0',
        background_color: '#111111',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/ahn.pet.game/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 앱 셸·펫 모션·아이콘·폰트(self-host)는 precache. 무거운 배경/데코 png만 런타임 캐시.
        globPatterns: ['**/*.{js,css,html,webp,woff2}', 'icon-*.png'],
        runtimeCaching: [
          {
            // 배경·데코 등 이미지: 처음 받을 때 캐시 → 이후 오프라인 제공
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
