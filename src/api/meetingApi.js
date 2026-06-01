const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createMeeting = async (meetingName) => {
  const response = await fetch(`${BASE_URL}/api/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: meetingName }),
  });

  if (!response.ok) {
    throw new Error("모임 생성에 실패했습니다.");
  }

  return await response.json();
};

export const joinRoom = async (roomCode, nickname, password) => {
  const response = await fetch(`${BASE_URL}/api/rooms/${roomCode}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "방 입장에 실패했습니다.");
  }

  return await response.json();
};

export const getMeetingDetails = async (roomCode) => {
  // 현재 백엔드에 방 상세 정보 조회 API가 없으므로, 필요시 추가해야 합니다.
  // 일단 엔드포인트만 맞춰둡니다.
  const response = await fetch(`${BASE_URL}/api/rooms/${roomCode}`);

  if (!response.ok) {
    throw new Error("모임 정보를 불러오는 데 실패했습니다.");
  }

  return await response.json();
};
