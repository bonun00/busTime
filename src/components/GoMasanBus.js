import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './GoStyles.css';

const formatTime = (time) => {
  if (typeof time === 'number' && !isNaN(time)) {
    const hours = Math.floor(time * 24);
    const minutes = Math.round((time * 24 - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  return time || '';
};

const GoMasanBus = () => {
  const [locations, setLocations] = useState([]);
  const [busNumbers, setBusNumbers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBusNumber, setSelectedBusNumber] = useState([]); // 빈 배열로 초기화
  const [filteredData, setFilteredData] = useState([]);

  const [rows, setRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTimes();
  }, [selectedLocation, selectedBusNumber]);

  const loadData = async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/data2.xlsx`);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const startColumnIndex = 3;
    const endColumnIndex = 27;

    setRows(rows);

    setLocations(
      rows[4]
        .slice(startColumnIndex, endColumnIndex + 1)
        .filter((value) => value !== undefined && value !== '')
    );

    setBusNumbers(
      rows.slice(5, 87)
        .map(row => row[0]?.split('-')[0])
        .filter((value, index, self) =>
          (value === '113' || value === '250') && self.indexOf(value) === index
        )
    );

    // setColumnHeaders(rows[0]);
  };

  const filterTimes = () => {
    if (!selectedLocation || selectedBusNumber.length === 0) return;

    const locationIndex = locations.indexOf(selectedLocation);
    if (locationIndex !== -1 && rows.length > 0) {
      const startRow = 6;
      const endRow = 87;
      const startCol = 3;
      const endCol = 27;

      const filteredDataList = rows
        .slice(startRow, endRow + 1)
        .filter((row) => selectedBusNumber.includes(row[0]?.split('-')[0]))
        .map((row) => {
          const timeData = row.slice(startCol, endCol + 1);
          const time = formatTime(timeData[locationIndex]);
          const terminal = row[28] || '--';
          const startStation = row[1] || '--';
          const startTime = formatTime(row[2]);
          return {
            time,
            terminal,
            startStation,
            startTime,
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

  const formatRowData = (rowData) => {
    const formatted = [];
    const startStation = rowData[1];
    const startTime = formatTime(rowData[2]);

    if (startStation && startTime) {
      formatted.push(
        <React.Fragment key="start">
          <strong className="time-item">{startTime}</strong> ({startStation}) {' -> '}
        </React.Fragment>
      );
    }

    for (let i = 3; i <= 27; i++) {
      const time = formatTime(rowData[i]);
      const location = locations[i - 3];
      if (time && location) {
        formatted.push(
          <React.Fragment key={`stop-${i}`}>
            <strong className="time-item">{time}</strong> ({location}) {i !== 27 ? ' -> ' : ''}
          </React.Fragment>
        );
      }
    }

    return formatted;
  };

  return (
    <div className="container">
      <h1 className="title">
      삼칠/대산 ▶  창원/마산
      </h1>
      <div className="checkbox-container">
        <label className="checkbox-label">
        🚍 버스 노선
        </label>
        <div className="checkbox-group">
          {busNumbers.map((number, index) => (
            <label key={index} className="checkbox-option">
              <input
                type="checkbox"
                value={number}
                checked={selectedBusNumber.includes(number)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBusNumber([...selectedBusNumber, number]);
                  } else {
                    setSelectedBusNumber(
                      selectedBusNumber.filter((num) => num !== number)
                    );
                  }
                }}
                 className="checkbox-input"
              />
              {number}
            </label>
          ))}
        </div>
      </div>

      <div className="select-container">
        <label className="select-label">
        🚏 정류장
        </label>
        <select
          value={selectedLocation || ''}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="select-input"
        >
          <option value="" disabled>
            정류장
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="results-container">
        {showResults && (
          <>
            {noResults ? (
              <h3 className="no-results">
                해당 버스 시간은 없습니다.
              </h3>
            ) : (
              <>
                <h3 className="results-title">
                  {selectedLocation ? `${selectedLocation} 버스 시간` : '버스 시간'}
                </h3>
                <h4 className="results-subtitle">시간을 클릭하면 노선을 볼 수 있습니다.</h4>
              </>
            )}
          </>
        )}

        <div className="row-data-container">
          {filteredData.map((data, index) => (
            <div key={index}>
              <div
                className="main-time"
                onClick={() => handleRowClick(index)}
              >
                {data.time}
              </div>
              {expandedRow === index && (
                <div className="row-data">
                  <strong>🚍 버스 노선</strong>
                  <div className="row-data-container">
                    <div>{formatRowData(data.rowData)}</div>
                  </div>
                  <div className="terminal-info">
                    <strong>종점: {data.terminal}</strong>
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

export default GoMasanBus;