const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

const endTime = (meeting) =>
  meeting.confirmedEndDateTime ? new Date(meeting.confirmedEndDateTime).getTime() : null;

// 확정된 약속 시간이 지났는가
const isMeetingOver = (meeting, now = Date.now()) => {
  const end = endTime(meeting);
  return end !== null && end <= now;
};

// 투표로 장소까지 확정된 모임인가 (서버도 CONFIRMED 모임에만 리뷰 작성을 허용한다)
const isPlaceConfirmed = (meeting) => meeting.status === "CONFIRMED";

// 내 방 목록의 "리뷰 쓰기" 버튼: 장소 확정 + 약속 시간 경과 + 아직 리뷰 안 씀 (2주 제한 없음)
export const canWriteReview = (meeting, now = Date.now()) =>
  isPlaceConfirmed(meeting) && isMeetingOver(meeting, now) && !meeting.reviewed;

// 홈 리뷰 배너 대상: 위 조건 + 약속이 끝난 지 2주 이내
export const isWithinReviewWindow = (meeting, now = Date.now()) =>
  canWriteReview(meeting, now) && now - endTime(meeting) <= TWO_WEEKS_MS;

// 끝난 지 얼마 안 된 모임부터
export const byMostRecentlyEnded = (a, b) => endTime(b) - endTime(a);
