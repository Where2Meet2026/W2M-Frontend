const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getRecommendations = async (meetingId) => {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}/recommendations`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("추천 시간대 정보를 불러오는 데 실패했습니다.");
  }

  return await response.json();
};
