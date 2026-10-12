import { StarIcon } from "../../../shared/components/Icons";

// 입력용: <StarRating value onChange />, 표시용: <StarRating value readOnly size={14} />
function StarRating({ value, onChange, readOnly = false, size = 32 }) {
  return (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          aria-label={`${n}점`}
          className={`transition active:scale-90 ${n <= value ? "text-[#3b82f6]" : "text-[#d1d5db]"}`}
        >
          <StarIcon size={size} filled={n <= value} />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
