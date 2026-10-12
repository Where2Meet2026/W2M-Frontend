import { starText } from "../utils/starText";

function ReviewCard({ rating, comment }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#f3f4f6] bg-white p-4">
      <p className="m-0 text-sm tracking-[2px] text-[#3b82f6]">{starText(rating)}</p>
      {comment && <p className="m-0 text-[13px] leading-normal text-[#191f28]">{comment}</p>}
    </div>
  );
}

export default ReviewCard;
