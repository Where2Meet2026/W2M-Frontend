import BottomSheet from "./BottomSheet";
import { MapPinIcon } from "./Icons";

function ShareBottomSheet({
  isOpen,
  onClose,
  title,
  previewTitle,
  previewDescription,
  onKakaoShare,
  onCopyLink,
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} label={title}>
      <h2 className="mb-5 text-[17px] font-extrabold text-[#191f28]">
        {title}
      </h2>

      <div className="mb-4 flex items-center gap-3.5 rounded-2xl bg-gray-50 p-3.5">
        {/* 미리보기 칸이 작은 정사각형이라 가로로 긴 공유 썸네일 대신 핀 아이콘 (후보 카드와 같은 아이콘) */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
          <MapPinIcon size={22} />
        </div>
        <div className="min-w-0">
          <p className="mb-1 truncate text-sm font-extrabold text-[#191f28]">
            {previewTitle}
          </p>
          <p className="m-0 truncate text-xs text-gray-400">
            {previewDescription}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onKakaoShare}
        className="flex w-full items-center gap-3.5 rounded-2xl p-2 text-left transition active:scale-[0.98]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEE500] text-[#191f28]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-extrabold text-[#191f28]">
            카카오톡으로 공유
          </span>
          <span className="block text-xs text-gray-400">
            대화방에 모임 정보 카드로 보내기
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={onCopyLink}
        className="flex w-full items-center gap-3.5 rounded-2xl p-2 text-left transition active:scale-[0.98]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-extrabold text-[#191f28]">
            링크 복사
          </span>
          <span className="block text-xs text-gray-400">
            초대 링크를 클립보드에 복사
          </span>
        </span>
      </button>
    </BottomSheet>
  );
}

export default ShareBottomSheet;
