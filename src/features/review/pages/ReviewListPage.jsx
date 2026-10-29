import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import BackButton from "../../../shared/components/BackButton";
import Toast from "../../../shared/components/Toast";
import { usePlace } from "../hooks/usePlace";
import PlaceCard from "../components/PlaceCard";
import ReviewCard from "../components/ReviewCard";
import { starText } from "../utils/starText";
import { getCandidateReviews, getReviews } from "../api/reviewApi";

function ReviewListPage() {
  // /review/:meetingId → 확정된 장소, /review/:meetingId/candidates/:candidateId → 투표 중인 후보 장소
  const { meetingId, candidateId } = useParams();
  const { state } = useLocation();
  const confirmedPlace = usePlace(meetingId, state?.place, !candidateId);
  const [candidatePlace, setCandidatePlace] = useState(null);
  const place = candidateId ? candidatePlace : confirmedPlace;
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(Boolean(state?.registered));
  const closeToast = useCallback(() => setShowToast(false), []);

  useEffect(() => {
    if (candidateId) {
      getCandidateReviews(meetingId, candidateId)
        .then((data) => {
          setCandidatePlace({ name: data.placeName, address: data.placeAddress });
          setReviews(data.reviews ?? []);
        })
        .catch((e) => setError(e.message));
      return;
    }
    getReviews(meetingId)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message));
  }, [meetingId, candidateId]);

  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const summary = reviews.length
    ? `누적 리뷰 ${reviews.length}개 · 평균 ${starText(average)}`
    : "아직 등록된 리뷰가 없어요";

  return (
    <PageShell className="relative flex flex-col gap-5 px-6 py-10">
      <BackButton />
      <PlaceCard name={place?.name ?? "장소"} subText={summary} large />

      {error && <p className="m-0 text-center text-xs text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        {reviews.map((review, i) => (
          <ReviewCard key={i} rating={review.rating} comment={review.comment} />
        ))}
      </div>

      <p className="mb-0 mt-auto text-center text-[10px] text-[#9ca3af]">작성자는 익명으로 표시됩니다</p>

      {showToast && <Toast message="리뷰가 등록됐어요. 고마워요!" onClose={closeToast} />}
    </PageShell>
  );
}

export default ReviewListPage;
