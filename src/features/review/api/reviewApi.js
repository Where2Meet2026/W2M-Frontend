import { apiClient } from "../../../shared/api/client";

export const createReview = (meetingId, { rating, comment }) =>
  apiClient.post(`/api/meetings/${meetingId}/reviews`, { rating, comment });

// 투표 중인 후보 장소의 누적 리뷰: { placeName, placeAddress, reviews: [{ rating, comment, createdAt }] }
export const getCandidateReviews = (meetingId, candidateId) =>
  apiClient.get(`/api/meetings/${meetingId}/reviews/candidates/${candidateId}`);

export const getReviews = (meetingId) =>
  apiClient.get(`/api/meetings/${meetingId}/reviews`);
