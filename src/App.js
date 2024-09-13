import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationFilter from './components/GoHamanBus'; // LocationFilter 컴포넌트 경로 맞게 설정
import LocationFilter2 from './components/GoMasanBus'; // LocationFilter2 컴포넌트 경로 맞게 설정
import './App.css'; // CSS 파일 import

const MainPage = () => {
  return (
    <div className="container">
      <h1 className="header">
        함안군 농어촌 버스 시간
      </h1>
      <Link to="/location-filter2">
        <button className="button">
          삼칠/대산 → 창원/마산
        </button>
      </Link>
      <br />
      <Link to="/location-filter">
        <button className="button">
          창원/마산 → 삼칠/대산
        </button>
      </Link>
      <div className="bmc-button">
        <a
          href="https://www.buymeacoffee.com/bonun"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block' }}
        >
          <img
            src="https://img.buymeacoffee.com/button-api/?text=%EA%B0%9C%EB%B0%9C%EC%9E%90%20%EC%BB%A4%ED%94%BC%20%EC%82%AC%EC%A3%BC%EA%B8%B0&emoji=&slug=bonun&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
            alt="Buy Me a Coffee"
          />
        </a>
      </div>
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
        </Routes>
      </Router>
    </div>
  );
};

export default App;