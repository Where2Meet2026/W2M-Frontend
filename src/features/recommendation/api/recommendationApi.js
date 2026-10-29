import { apiClient } from "../../../shared/api/client";

export const getRecommendations = (meetingId) =>
  apiClient.get(`/api/meetings/${meetingId}/recommendations`);