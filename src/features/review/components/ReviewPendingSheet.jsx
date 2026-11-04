import BottomSheet from "../../../shared/components/BottomSheet";
import { ChevronRightIcon, StarIcon } from "../../../shared/components/Icons";

const formatDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
};

// isOpen: 홈 화면이 항상 그려 두고 열림 여부만 넘긴다 (공통 BottomSheet의 올라오는 애니메이션을 쓰려고)
function ReviewPendingSheet({ isOpen, pending, onSelect, onClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} label="리뷰를 기다리는 장소">
      <div className="mb-4">
        <p className="m-0 text-[17px] font-bold text-[#191f28]">리뷰를 기다리는 장소 {pending.length}곳</p>
        <p className="m-0 mt-1 text-xs text-[#99a1af]">최근 약속 순 · 약속 후 2주가 지나면 목록에서 빠져요</p>
      </div>
      <ul className="m-0 flex max-h-[316px] list-none flex-col gap-1 overflow-y-auto p-0">
        {pending.map((item) => (
          <li key={item.meetingId}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3.5 py-2.5 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe] text-[#3b82f6]">
                <StarIcon size={18} filled />
              </div>
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[15px] font-bold text-[#191f28]">{item.placeName}</p>
                <p className="m-0 truncate text-xs text-[#99a1af]">
                  {[formatDate(item.meetingDate), item.meetingTitle].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="shrink-0 text-[#9ca3af]">
                <ChevronRightIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}

export default ReviewPendingSheet;
