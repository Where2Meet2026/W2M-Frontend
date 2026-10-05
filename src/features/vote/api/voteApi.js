import { apiClient } from "../../../shared/api/client";

export const getVoteStatus = (meetingId) =>
    apiClient.get(`/api/meetings/${meetingId}/votes`);

export const castVote = (meetingId, candidateId) => 
    apiClient.post(`/api/meetings/${meetingId}/votes`, { candidateId });