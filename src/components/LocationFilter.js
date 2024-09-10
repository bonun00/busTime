import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const formatTime = (time) => {
  if (typeof time === 'number' && !isNaN(time)) {
    const hours = Math.floor(time * 24); // 시간 계산
    const minutes = Math.round((time * 24 - hours) * 60); // 분 계산
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  return time || '';
};

const LocationFilter = () => {
  const [locations, setLocations] = useState([]);
  const [busNumbers, setBusNumbers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBusNumber, setSelectedBusNumber] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showResults, setShowResults] = useState(false); // 확인 버튼 클릭 상태
  const [noResults, setNoResults] = useState(false); // 데이터 없음 상태
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetch('/busTime/data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const startColumnIndex = 1;
    const endColumnIndex = 18;

    setRows(rows);

    // 5번째 행의 정류장 목록을 설정
    setLocations(
      rows[5]
        .slice(startColumnIndex, endColumnIndex + 1)
        .filter((value) => value !== undefined && value !== '')
    );

    // 0번째 열에서 버스 번호 가져오기, '-'를 기준으로 분리한 후 앞 세 자리만 추출
    setBusNumbers(
      rows.slice(6, 87 + 1)
        .map(row => row[0]?.split('-')[0]) // 000-00 형식에서 앞 세 자리만 추출
        .filter((value, index, self) => 
          (value === '113' || value === '250') && self.indexOf(value) === index
        )
    );

    setColumnHeaders(rows[0]);
  };

  const filterTimes = () => {
    if (!selectedLocation || !selectedBusNumber) return;

    const locationIndex = locations.indexOf(selectedLocation);
    if (locationIndex !== -1 && rows.length > 0) {
      const startRow = 6;
      const endRow = 87;
      const startCol = 1;
      const endCol = 23;

      // 선택한 버스 번호와 정류장에 맞는 시간 필터링
      const filteredDataList = rows
        .slice(startRow, endRow + 1)
        .filter((row) => row[0]?.split('-')[0] === selectedBusNumber) // 버스 번호가 선택된 것과 일치하는지 확인
        .map((row) => {
          const timeData = row.slice(startCol, endCol + 1);
          const time = formatTime(timeData[locationIndex]);
          const terminal = row[23] || '--';
          return {
            time,
            terminal,
            rowData: row,
            locationData: timeData
          };
        })
        .filter((data) => data.time !== undefined && data.time !== '');
      setShowResults(true); 
      setNoResults(filteredDataList.length === 0);
      setFilteredData(filteredDataList);
    }
  };

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // 정류장명(19번, 21번 열)과 시간(20번, 22번 열)을 매칭시키고 종점(23번 열)을 표시하는 함수
  const formatRowData = (rowData) => {
    const formatted = [];

    for (let i = 1; i <= 18; i++) {
      const time = formatTime(rowData[i]);
      const location = locations[i - 1];
      if (time && location) {
        formatted.push(`${time} (${location})`);
      }
    }

    // 19-20번 열: 첫 번째 정류장과 시간
    const stop1 = rowData[19]; // 정류장명 (19번 열)
    const time1 = formatTime(rowData[20]); // 시간 (20번 열)
    if (stop1 && time1) {
      formatted.push(`${time1} (${stop1})`);
    }

    // 21-22번 열: 두 번째 정류장과 시간
    const stop2 = rowData[21]; // 정류장명 (21번 열)
    const time2 = formatTime(rowData[22]); // 시간 (22번 열)
    if (stop2 && time2) {
      formatted.push(`${time2} (${stop2})`);
    }

    return formatted.join(' -> ');
  };

  return (
    <div style={{ padding: '5%', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4vw' }}>창원, 남마산, 마산 -{'>'} 삼칠, 대산</h1>

      <div style={{ marginBottom: '5%' }}>
        <label style={{ fontSize: '3vw' }}>버스 번호 :</label>
        <select
          value={selectedBusNumber || ''}
          onChange={(e) => setSelectedBusNumber(e.target.value)}
          style={{ fontSize: '3vw', marginLeft: '10px', width: '90%', maxWidth: '400px' }}
        >
          <option value="" disabled>
            버스 번호를 선택하세요
          </option>
          {busNumbers.map((number, index) => (
            <option key={index} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '5%' }}>
        <label style={{ fontSize: '3vw' }}>정류장 :</label>
        <select
          value={selectedLocation || ''}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{ fontSize: '3vw', marginLeft: '10px', width: '90%', maxWidth: '400px' }}
        >
          <option value="" disabled>
            정류장을 선택하세요
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={filterTimes}
        style={{ fontSize: '3vw', padding: '10px 20px', marginTop: '5%' }}
      >
        확인
      </button>
      <div style={{ marginTop: '5%' }}>
      {showResults && (
    <>
      {noResults ? (
        <h3 style={{ fontSize: '4vw' }}>해당 버스 시간은 없습니다.</h3>
      ) : (
        <>
          <h3 style={{ fontSize: '4vw' }}>
            {selectedLocation ? `${selectedLocation} 버스 시간` : '버스 시간'}
          </h3>
          <h3 style={{ fontSize: '2vw' }}>시간을 클릭하면 해당하는 버스 노선 시간을 볼 수 있습니다.</h3>
        </>
      )}
    </>
  )}
        <div style={{ fontSize: '2vw' }}>
          {filteredData.map((data, index) => (
            <div key={index}>
              <div
                style={{ cursor: 'pointer', textAlign: 'center', fontSize: '4vw' }}
                onClick={() => handleRowClick(index)}
              >
                {data.time}
              </div>
              {expandedRow === index && (
                <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '2vw' }}>
                  <div><strong>버스 노선</strong></div>
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div>{formatRowData(data.rowData)}</div>
                  </div>
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <strong>종점: {data.terminal}</strong> {/* 종점 */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationFilter;