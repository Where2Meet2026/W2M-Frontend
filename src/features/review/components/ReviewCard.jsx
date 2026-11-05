import StarRating from "./StarRating";

function ReviewCard({ rating, comment }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#f3f4f6] bg-white p-4">
      <div className="flex items-center gap-2">
        <StarRating value={rating} readOnly size={14} />
        <span className="text-xs font-bold text-[#3b82f6]">{rating.toFixed(1)}</span>
      </div>
      {comment && <p className="m-0 text-[13px] leading-normal text-[#191f28]">{comment}</p>}
    </div>
  );
}

export default ReviewCard;
