import { useEffect, useState } from "react";
import { ChevronRightIcon, StarIcon } from "../../../shared/components/Icons";

const ROTATE_MS = 3500;

// pending은 최근 약속 순. 여러 건이면 일정 간격으로 다음(더 오래된) 모임으로 넘어가고 마지막 뒤엔 처음으로 돌아간다.
function ReviewPendingBanner({ pending, onClick }) {
  const [index, setIndex] = useState(0);
  const count = pending.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;
  const current = pending[index % count];

  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-5 flex h-[76px] w-full items-center gap-3.5 overflow-hidden rounded-2xl border border-[#dbeafe] bg-[#eff6ff] px-4 text-left transition active:scale-[0.98]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe] text-[#3b82f6]">
        <StarIcon filled />
      </div>
      <div key={current.meetingId} className="animate-banner-slide-up min-w-0 flex-1">
        <p className="m-0 text-[11px] font-bold text-[#155dfc]">리뷰 대기 {count}건</p>
        <p className="m-0 truncate text-sm font-bold text-[#191f28]">{current.placeName} 어땠어요?</p>
        <p className="m-0 text-xs text-[#99a1af]">
          {count === 1 ? "최근 다녀온 모임 · 별점만 눌러도 돼요" : "눌러서 리뷰 쓸 곳을 골라요"}
        </p>
      </div>
      <span className="shrink-0 text-[#9ca3af]">
        <ChevronRightIcon />
      </span>
    </button>
  );
}

export default ReviewPendingBanner;
