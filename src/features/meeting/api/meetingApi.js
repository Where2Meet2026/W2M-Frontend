import { apiClient } from "../../../shared/api/client";

// category: "CAFE" | "MEAL" | "ANY" — 후보 장소를 어떤 종류로 찾을지 (서버가 안 받으면 ANY로 처리)
export const createMeeting = (title, description, category) =>
  apiClient.post("/api/meetings", { title, description, category });

export const getMyMeetings = () => apiClient.get("/api/meetings/my");

export const getMeetingDetails = (meetingId) =>
  apiClient.get(`/api/meetings/${meetingId}`);

export const getMeetingByInviteCode = (inviteCode) =>
  apiClient.get(`/api/meetings/invite/${inviteCode}`);

export const deleteMeeting = (meetingId) =>
  apiClient.delete(`/api/meetings/${meetingId}`);

export const confirmMeetingTime = (meetingId, selectedSlot) =>
  apiClient.patch(`/api/meetings/${meetingId}/confirmed-time`, {
    startDateTime: selectedSlot.startDateTime,
    endDateTime: selectedSlot.endDateTime,
  });
export const getFinalSelection = (meetingId) => 
  apiClient.get(`/api/meetings/${meetingId}/final-selection`);
