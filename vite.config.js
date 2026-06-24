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
      strategies: 'injectManifest', // 커스텀 SW(src/sw.js)에 precache 목록 주입
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
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
      injectManifest: {
        // NFC 시나리오: 첫 접속 시 전체 리소스 precache → 이후 완전 오프라인 동작
        globPatterns: ['**/*.{js,css,html,webp,woff2,png,jpg}'],
        globIgnores: ['**/node_modules/**', '**/sw.js', '**/workbox-*.js', '**/_originals/**'],
      },
    }),
  ],
});
