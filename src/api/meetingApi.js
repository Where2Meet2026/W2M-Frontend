const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createMeeting = async (title, description) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, description }),
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

export const getMyMeetings = async () => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/my`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("내 모임 목록을 불러오는 데 실패했습니다.");
  }

  return await response.json();
};

export const getMeetingDetails = async (meetingId) => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("모임 정보를 불러오는 데 실패했습니다.");
  }

  return await response.json();
};

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
