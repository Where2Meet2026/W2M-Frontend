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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      inert={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-[393px] rounded-t-[28px] bg-white px-6 pb-8 pt-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-gray-200" />
        <h2 className="mb-5 text-[17px] font-extrabold text-[#191f28]">
          {title}
        </h2>

        <div className="mb-4 flex items-center gap-3.5 rounded-2xl bg-gray-50 p-3.5">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-100" />
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
      </div>
    </div>
  );
}

export default ShareBottomSheet;
