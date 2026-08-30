const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const saveAvailabilities = async (participantId, timeRanges) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/participants/${participantId}/availabilities`, {
    method: "POST",
    headers,
    body: JSON.stringify({ timeRanges }),
  });

  if (!response.ok) {
    throw new Error("시간대 저장에 실패했습니다.");
  }
};

export const getAvailabilities = async (participantId) => {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/participants/${participantId}/availabilities`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("시간대 조회에 실패했습니다.");
  }

  return await response.json();
};
