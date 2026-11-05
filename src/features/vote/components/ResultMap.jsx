import { useEffect, useRef } from "react";
import { loadKakaoMap } from "../../../shared/lib/kakaoMap";

// 결과 화면 상단의 확정 장소 지도. 부모 칸을 꽉 채운다.
// 지도를 못 불러오면 아무것도 그리지 않아서 부모의 기본 디자인(회색 배경 + 핀)이 그대로 보인다.
//   <ResultMap latitude={result.latitude} longitude={result.longitude} />
function ResultMap({ latitude, longitude }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;
    let cancelled = false;

    loadKakaoMap()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        const center = new maps.LatLng(latitude, longitude);
        const map = new maps.Map(containerRef.current, {
          center,
          level: 3,
          // 휴대폰에서 화면을 스크롤하다 지도가 대신 움직이지 않게 고정한다 (자세히 보기는 "지도에서 보기" 버튼)
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
        });
        new maps.Marker({ position: center, map });
      })
      .catch((error) => {
        console.error("결과 화면 지도 로드 실패:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  return <div ref={containerRef} className="absolute inset-0" aria-label="확정 장소 지도" />;
}

export default ResultMap;
