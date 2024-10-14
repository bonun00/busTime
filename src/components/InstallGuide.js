import React, { useEffect, useState } from 'react';
import './InstallGuide.css';
const InstallGuide = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // 사용자 에이전트를 통해 OS를 감지합니다.
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  return (
    <div className="install-guide">
      <h2>앱 설치 가이드</h2>
      {isIOS && (
        <div>
          <p>iOS 기기에서 홈 화면에 추가하는 방법:</p>
          <ol>
            <li>Safari 브라우저에서 <strong>공유</strong> 아이콘을 탭하세요.</li>
            <li><strong>"홈 화면에 추가"</strong>를 선택합니다.</li>
            <li>이름을 확인하고 <strong>추가</strong>를 누르세요.</li>
          </ol>
          <img src={`${process.env.PUBLIC_URL}/iOS.png`} alt="iOS 설치 가이드 이미지" className="install-image" />
        </div>
      )}
      {isAndroid && (
        <div>
          <p>Android 기기에서 홈 화면에 추가하는 방법:</p>
          <ol>
            <li>삼성 인터넷에서 오른쪽 하단의 줄 3개를 탭하세요.</li>
            <li><strong>"현재페이지 추가"</strong>를 선택합니다.</li>
            <li>이름을 확인하고 <strong>추가</strong>를 누르세요.</li>
          </ol>
          <img src={`${process.env.PUBLIC_URL}/ANDROID.png`} alt="Android 설치 가이드 이미지" className="install-image" />
        </div>
      )}
      {!isIOS && !isAndroid && (
        <div>
          <p>홈 화면에 추가하는 방법:</p>
          <p>이 페이지는 Android 또는 iOS 기기에서만 홈 화면 추가 가이드를 제공합니다.</p>
        </div>
      )}
    </div>
  );
};

export default InstallGuide;