import { apiClient } from "../../../shared/api/client";

export const createMeeting = (title, description) =>
  apiClient.post("/api/meetings", { title, description });

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