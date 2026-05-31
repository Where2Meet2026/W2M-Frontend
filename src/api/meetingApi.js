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

export const joinMeeting = async (inviteCode) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/join`, {
    method: "POST",
    headers,
    body: JSON.stringify({ inviteCode }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "모임 참여에 실패했습니다.");
  }

  return await response.json();
};

export const getParticipants = async (meetingId) => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}/participants`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("참여자 목록을 불러오는 데 실패했습니다.");
  }

  return await response.json();
};

export const leaveMeeting = async (meetingId) => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}/participants/me`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("모임 탈퇴에 실패했습니다.");
  }
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

export const getMeetingByInviteCode = async (inviteCode) => {
  const response = await fetch(`${BASE_URL}/api/meetings/invite/${inviteCode}`);

  if (!response.ok) {
    throw new Error("초대 코드 정보를 불러오는 데 실패했습니다.");
  }

  return await response.json();
};

export const getMyParticipant = async (meetingId) => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}/participants/me`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("내 참여 정보를 불러오는 데 실패했습니다.");
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
