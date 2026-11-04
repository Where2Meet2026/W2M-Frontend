import BottomSheet from "./BottomSheet";

// 확정 장소를 어느 지도에서 볼지 고르는 시트 (공유 시트와 같은 모양).
// 길찾기는 출발지가 사람마다 달라서 각자 하게 두고, 여기서는 '그 장소가 어떤 곳인지'(사진·리뷰·영업시간)를 보여준다.
//   <MapAppSheet isOpen={...} onClose={...} placeName={...} address={...} kakaoPlaceId={...} latitude={...} longitude={...} />

// 카카오맵: 장소 ID가 있으면 그 장소의 상세 화면(사진·후기·영업시간·출발/도착 버튼).
// 카카오 장소 검색 API가 주는 place_url도 이 형식이다. (/link/map/장소ID는 지도에 핀만 찍히고 상세 정보가 안 떠서 쓰지 않는다)
// ID가 없는 예전 응답이면 예전처럼 이름과 좌표로 핀만 찍는다(/link/map/이름,위도,경도)
const kakaoPlaceUrl = ({ kakaoPlaceId, placeName, latitude, longitude }) =>
  kakaoPlaceId
    ? `https://place.map.kakao.com/${kakaoPlaceId}`
    : `https://map.kakao.com/link/map/${encodeURIComponent(placeName)},${latitude},${longitude}`;

// 네이버 지도: 카카오와 장소 ID 체계가 달라서 검색으로 연다.
// 이름만 넣으면 같은 이름 가게가 목록으로 나오고, '이름 + 전체 주소'로 검색하면 그 장소 화면이 바로 열린다(직접 확인)
const naverPlaceUrl = ({ placeName, address }) =>
  `https://map.naver.com/p/search/${encodeURIComponent(`${placeName} ${address || ""}`.trim())}`;

function MapAppSheet({ isOpen, onClose, placeName, address, kakaoPlaceId, latitude, longitude }) {
  const open = (url) => {
    window.open(url, "_blank", "noopener");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} label="지도 선택">
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
    </BottomSheet>
  );
}

export default MapAppSheet;
