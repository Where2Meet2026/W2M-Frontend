import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import BackButton from "../../../shared/components/BackButton";
import { usePlace } from "../hooks/usePlace";
import PlaceCard from "../components/PlaceCard";
import StarRating from "../components/StarRating";
import { createReview } from "../api/reviewApi";

function ReviewWritePage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const place = usePlace(meetingId, useLocation().state?.place);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await createReview(meetingId, { rating, comment: comment.trim() || null });
      navigate(`/review/${meetingId}`, { replace: true, state: { place, registered: true } });
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <PageShell className="flex flex-col gap-6 px-6 py-10">
      <BackButton />

      <header className="flex flex-col gap-2.5">
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-1px] text-[#191f28]">이 장소는 어떠셨나요?</h1>
        <p className="m-0 text-sm text-[#9ca3af]">다녀온 장소가 어땠는지 알려주세요</p>
      </header>

      <PlaceCard name={place?.name ?? "장소"} subText={place?.address} />

      <section className="flex flex-col items-center gap-3">
        <StarRating value={rating} onChange={setRating} />
        <p className="m-0 text-xs text-[#9ca3af]">{rating ? `${rating}점을 선택했어요` : "별점을 선택해주세요"}</p>
      </section>

      <section className="flex flex-col gap-2.5">
        <label htmlFor="review-comment" className="text-sm font-bold text-[#191f28]">한줄평을 남겨주세요</label>
        <textarea
          id="review-comment"
          value={comment}
          maxLength={500}
          onChange={(e) => setComment(e.target.value)}
          placeholder="예) 참여자 전원 접근성이 좋았고 분위기가 조용해서 대화하기 편했어요"
          className="h-[110px] w-full resize-none rounded-2xl border border-[#f3f4f6] bg-white p-[13px] text-[13px] leading-normal text-[#191f28] outline-none placeholder:text-[#9ca3af] focus:border-[#3b82f6]"
        />
        <p className="m-0 text-[11px] text-[#9ca3af]">· 작성자 정보는 표시되지 않고 익명으로 등록돼요</p>
      </section>

      {error && <p className="m-0 text-center text-xs text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="mt-auto h-[54px] w-full rounded-2xl bg-[#3b82f6] text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-40"
      >
        {submitting ? "등록 중..." : "리뷰 등록하기"}
      </button>
    </PageShell>
  );
}

export default ReviewWritePage;
