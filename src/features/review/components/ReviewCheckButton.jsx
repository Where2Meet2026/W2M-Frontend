import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "../../../shared/components/Icons";
import { getCandidateReviews } from "../api/reviewApi";

// 투표 화면의 후보 카드에서 좋아요/싫어요 버튼과 같은 줄에 두는 버튼.
// 이 후보 장소에 누적된 리뷰가 하나라도 있을 때만 나타나고, 누르면 다른 사람들이 쓴 리뷰 목록으로 이동한다.
//   <ReviewCheckButton meetingId={meetingId} candidateId={candidate.candidateId} />
function ReviewCheckButton({ meetingId, candidateId, className = "" }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCandidateReviews(meetingId, candidateId)
      .then((data) => !cancelled && setCount(data.reviews?.length ?? 0))
      .catch(() => !cancelled && setCount(0));
    return () => {
      cancelled = true;
    };
  }, [meetingId, candidateId]);

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/review/${meetingId}/candidates/${candidateId}`);
      }}
      className={`ml-auto flex h-7 items-center gap-1 rounded-full bg-[#eff6ff] px-3 text-xs font-bold text-[#155dfc] transition active:scale-95 ${className}`}
    >
      <StarIcon size={12} filled />
      리뷰 확인
    </button>
  );
}

export default ReviewCheckButton;
