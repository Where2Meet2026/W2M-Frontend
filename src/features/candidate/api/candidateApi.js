import { apiClient } from "../../../shared/api/client";

export const getCandidates = (meetingId) =>
    apiClient.get(`/api/meetings/${meetingId}/candidates`)