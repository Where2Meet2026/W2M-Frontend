const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
