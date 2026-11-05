import { StarIcon } from "../../../shared/components/Icons";

const STARS = [1, 2, 3, 4, 5];

// 입력용: <StarRating value onChange />, 표시용: <StarRating value readOnly size={14} />
// 0.5점 단위: 별의 왼쪽 절반을 누르면 n - 0.5점, 오른쪽 절반을 누르면 n점.
function StarRating({ value, onChange, readOnly = false, size = 32 }) {
  return (
    <div className="flex" style={{ gap: Math.round(size * 0.375) }}>
      {STARS.map((n) => {
        const fill = value >= n ? "full" : value >= n - 0.5 ? "half" : "empty";
        return (
          <div key={n} className="relative" style={{ width: size, height: size }}>
            <span className="block text-[#d1d5db] [&>svg]:block">
              <StarIcon size={size} />
            </span>
            {fill !== "empty" && (
              <span
                className="absolute inset-y-0 left-0 block overflow-hidden text-[#3b82f6] [&>svg]:block"
                style={{ width: fill === "half" ? "50%" : "100%" }}
              >
                <StarIcon size={size} filled />
              </span>
            )}
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={() => onChange?.(n - 0.5)}
                  aria-label={`${n - 0.5}점`}
                  className="absolute inset-y-0 left-0 w-1/2"
                />
                <button
                  type="button"
                  onClick={() => onChange?.(n)}
                  aria-label={`${n}점`}
                  className="absolute inset-y-0 right-0 w-1/2"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StarRating;
