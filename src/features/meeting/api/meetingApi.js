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

export const deleteMeeting = async (meetingId) => {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("모임 삭제에 실패했습니다.");
  }
};

export const confirmMeetingTime = async (meetingId, selectedSlot) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}/confirmed-time`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      startDateTime: selectedSlot.startDateTime,
      endDateTime: selectedSlot.endDateTime,
    }),
  });

  if (!response.ok) {
    throw new Error("약속 시간 확정에 실패했습니다.");
  }

  return await response.json();
};
