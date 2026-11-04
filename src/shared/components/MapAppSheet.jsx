import { useEffect } from "react";

// 확정 장소를 어느 지도에서 볼지 고르는 시트 (공유 시트와 같은 모양).
// 길찾기는 출발지가 사람마다 달라서 각자 하게 두고, 여기서는 '그 장소가 어떤 곳인지'(사진·리뷰·영업시간)를 보여준다.
//   <MapAppSheet isOpen={...} onClose={...} placeName={...} address={...} kakaoPlaceId={...} latitude={...} longitude={...} />

// 카카오맵: 장소 ID가 있으면 그 장소 화면(공식 '지도 URL' 가이드의 /link/map/장소ID).
// ID가 없는 예전 응답이면 예전처럼 이름과 좌표로 핀만 찍는다(/link/map/이름,위도,경도)
const kakaoPlaceUrl = ({ kakaoPlaceId, placeName, latitude, longitude }) =>
  kakaoPlaceId
    ? `https://map.kakao.com/link/map/${kakaoPlaceId}`
    : `https://map.kakao.com/link/map/${encodeURIComponent(placeName)},${latitude},${longitude}`;

// 네이버 지도: 카카오와 장소 ID 체계가 달라서 검색으로 연다.
// 이름만 넣으면 같은 이름 가게가 목록으로 나오고, '이름 + 전체 주소'로 검색하면 그 장소 화면이 바로 열린다(직접 확인)
const naverPlaceUrl = ({ placeName, address }) =>
  `https://map.naver.com/p/search/${encodeURIComponent(`${placeName} ${address || ""}`.trim())}`;

function MapAppSheet({ isOpen, onClose, placeName, address, kakaoPlaceId, latitude, longitude }) {
  // 노트북에서는 Esc 키로도 닫을 수 있게 한다 (다른 시트와 동일)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const open = (url) => {
    window.open(url, "_blank", "noopener");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="지도 선택"
        className={`relative w-full max-w-[393px] rounded-t-[28px] bg-white px-6 pb-8 pt-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-gray-200" />
        <h2 className="mb-1.5 text-[17px] font-extrabold text-[#191f28]">어느 지도로 볼까요?</h2>
        <p className="mb-5 text-[13px] leading-[1.6] text-gray-400">
          사진·리뷰·영업시간을 확인하고, 길찾기도 그 지도에서 할 수 있어요
        </p>

        <button
          type="button"
          onClick={() => open(kakaoPlaceUrl({ kakaoPlaceId, placeName, latitude, longitude }))}
          className="flex w-full items-center gap-3.5 rounded-2xl p-2 text-left transition active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEE500] text-[15px] font-black text-[#191f28]">
            K
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-extrabold text-[#191f28]">카카오맵</span>
            <span className="block truncate text-xs text-gray-400">카카오맵에서 {placeName} 보기</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => open(naverPlaceUrl({ placeName, address }))}
          className="flex w-full items-center gap-3.5 rounded-2xl p-2 text-left transition active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#03C75A] text-[15px] font-black text-white">
            N
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-extrabold text-[#191f28]">네이버 지도</span>
            <span className="block truncate text-xs text-gray-400">네이버 지도에서 {placeName} 보기</span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default MapAppSheet;
