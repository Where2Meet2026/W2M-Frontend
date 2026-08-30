import { apiClient } from "../../../shared/api/client";

export const joinMeeting = (inviteCode) =>
  apiClient.post("/api/meetings/join", { inviteCode });

export const getParticipants = (meetingId) =>
  apiClient.get(`/api/meetings/${meetingId}/participants`);

export const leaveMeeting = (meetingId) =>
  apiClient.delete(`/api/meetings/${meetingId}/participants/me`);

export const getMyParticipant = (meetingId) =>
  apiClient.get(`/api/meetings/${meetingId}/participants/me`);