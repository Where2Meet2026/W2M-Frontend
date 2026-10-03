import { apiClient } from "../../../shared/api/client";

export const getVoteStatus = (meetingId) =>
    apiClient.get(`/api/meetings/${meetingId}/votes`);
