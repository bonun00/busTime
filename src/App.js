import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationFilter from './components/LocationFilter'; // LocationFilter 컴포넌트 경로 맞게 설정
import LocationFilter2 from './components/LocationFilter2'; // LocationFilter 컴포넌트 경로 맞게 설정
const MainPage = () => {
  return (
    <div style={{ padding: '10px', textAlign: 'center', fontSize: '2rem' }}>
      <h1>함안군 농어촌 버스 시간</h1>
      <Link to="/location-filter">
        <button style={{ fontSize: '1.5rem', padding: '10px 20px', marginTop: '20px', width: '90%', maxWidth: '400px' }}>
          창원, 남마산, 마산에서 삼칠, 대산 가는 버스 노선
        </button>
      </Link>
      <br />
      <Link to="/location-filter2">
        <button style={{ fontSize: '1.5rem', padding: '10px 20px', marginTop: '20px', width: '90%', maxWidth: '400px' }}>
          삼칠, 대산에서 창원, 남마산 가는 버스 노선
        </button>
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/busTime">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/location-filter" element={<LocationFilter />} />
        <Route path="/location-filter2" element={<LocationFilter2 />} />
      </Routes>
    </Router>
  );
};

export default App;