// 카카오 지도 SDK를 필요한 화면에서만 한 번 불러온다.
// 공유용 SDK(index.html의 kakao.min.js)와는 별개라 지도는 이 함수로 따로 불러와야 한다.
// 같은 JavaScript 키를 쓰고, 카카오 콘솔에 등록된 도메인 + 카카오맵 사용 설정 ON일 때만 동작한다.
let loadingPromise = null;

export function loadKakaoMap() {
  if (window.kakao?.maps?.LatLng) {
    return Promise.resolve(window.kakao.maps);
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // autoload=false: 스크립트를 받은 뒤 kakao.maps.load()를 직접 불러야 지도 기능이 준비된다
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("카카오 지도를 불러오지 못했어요."));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao.maps));
    };
    script.onerror = () => reject(new Error("카카오 지도를 불러오지 못했어요."));
    document.head.appendChild(script);
  }).catch((error) => {
    // 실패하면 다음 방문 때 다시 시도할 수 있게 비워 둔다
    loadingPromise = null;
    throw error;
  });

  return loadingPromise;
}
