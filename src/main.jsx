// 게임 React 진입점 및 서비스 워커 업데이트 자동 새로고침 처리
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 새 SW가 activate되어 controller가 교체되면 페이지를 자동 새로고침
// (skipWaiting + clients.claim 이후 controllerchange 발생 → 최신 버전 강제 반영)
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(<App />);
