import { apiClient } from "../../../shared/api/client";

const KAKAO_LOCAL_API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

export async function searchPlacesByKeyword(keyword) {
    const response = await fetch(
    `${KAKAO_LOCAL_API_URL}?query=${encodeURIComponent(keyword)}&size=10`,
    {
        headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
        },
    }
    );

    if (!response.ok) {
    throw new Error("카카오 장소 검색 API 요청 실패");
    }

    const data = await response.json();

    return data.documents.map((place) => ({
    id: place.id,
    name: place.place_name,
    category: place.category_group_name || place.category_name,
    address: place.road_address_name || place.address_name,
    x: place.x,
    y: place.y,
    url: place.place_url,
    }));
}

// 출발 위치를 서버에 저장한다. 이미 저장돼 있으면 덮어쓴다.
// 카카오 검색 결과의 x는 경도, y는 위도이고 문자열이라 숫자로 변환해서 보낸다.
export const saveLocation = (participantId, place) =>
  apiClient.post(`/api/participants/${participantId}/locations`, {
    address: place.address,
    latitude: Number(place.y),
    longitude: Number(place.x),
  });
