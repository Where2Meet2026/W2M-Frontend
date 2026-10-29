import { apiClient } from "../../../shared/api/client";

export const saveAvailabilities = (participantId, timeRanges) =>
  apiClient.post(`/api/participants/${participantId}/availabilities`, { timeRanges });

export const getAvailabilities = (participantId) =>
  apiClient.get(`/api/participants/${participantId}/availabilities`);