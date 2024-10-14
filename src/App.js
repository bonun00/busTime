import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationFilter from './components/GoHamanBus'; // LocationFilter 컴포넌트 경로 맞게 설정
import LocationFilter2 from './components/GoMasanBus';
import InstallGuide from './components/InstallGuide'; // 새로운 설치 안내 페이지 추가
import './App.css'; // CSS 파일 import

const MainPage = () => {
  return (
    <div className="container">
      <h1 className="header">
        함안군 농어촌 버스 시간
      </h1>
      <Link to="/location-filter2">
        <button className="button">
          삼칠/대산 ▶  창원/마산 🚌
        </button>
      </Link>
      <br />
      <Link to="/location-filter">
        <button className="button">
          창원/마산 ▶ 삼칠/대산 🚌
        </button>
      </Link>
      <br />
      <Link to="/install-guide">
        <button className="button">
          앱 설치하기 📲
        </button>
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f8f0' }}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/location-filter" element={<LocationFilter />} />
          <Route path="/location-filter2" element={<LocationFilter2 />} />
          <Route path="/install-guide" element={<InstallGuide />} /> {/* 설치 안내 페이지 라우팅 */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;