import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 스타일이 필요하다면 새로운 스타일 파일을 생성합니다
import App from './App'; // App 컴포넌트를 불러옴

const root = ReactDOM.createRoot(document.getElementById('root')); // 'root' 엘리먼트에 렌더링
root.render(
  <React.StrictMode>
    <App /> {/* App 컴포넌트를 렌더링 */}
  </React.StrictMode>
);

// reportWebVitals(); // 이 줄을 제거합니다