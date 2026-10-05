import { apiClient } from "../../../shared/api/client";

export const getCandidates = (meetingId) =>
    apiClient.get(`/api/meetings/${meetingId}/candidates`);

export const toggleReaction = (meetingId, candidateId, reactionType) => 
    apiClient.post(`/api/meetings/${meetingId}/candidates/${candidateId}/reactions`, {
        reactionType,
    });