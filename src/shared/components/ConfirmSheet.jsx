import { useEffect } from "react";

// 브라우저 기본 확인 창(window.confirm) 대신 쓰는 앱 안 확인 시트.
// window.confirm은 환경에 따라 아예 뜨지 않거나(바로 '취소' 처리) 디자인이 앱과 따로 놀아서 이걸로 통일한다.
// 공유 시트(ShareBottomSheet)와 같은 모양이라, 노트북에서도 가운데 앱 화면 폭(393px)에 맞춰 아래에서 올라온다.
//   <ConfirmSheet isOpen={...} title="모임에서 나갈까요?" description="..." confirmLabel="나가기" danger
//     onConfirm={...} onClose={...} isPending={...} />
function ConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  danger = false, // 삭제·나가기처럼 되돌릴 수 없는 동작이면 확인 버튼을 빨간색으로
  isPending = false, // 확인을 누른 뒤 서버 응답을 기다리는 중이면 버튼을 잠근다
}) {
  // 노트북에서는 Esc 키로도 닫을 수 있게 한다
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={isPending ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full max-w-[393px] rounded-t-[28px] bg-white px-6 pb-8 pt-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-gray-200" />
        <h2 className="mb-2 text-[17px] font-extrabold text-[#191f28]">{title}</h2>
        {description && (
          <p className="mb-6 whitespace-pre-line text-sm leading-[1.6] text-gray-500">
            {description}
          </p>
        )}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-12 flex-1 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 transition active:scale-[0.98] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`h-12 flex-1 rounded-xl text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-60 ${
              danger ? "bg-red-500 active:bg-red-600" : "bg-blue-500 active:bg-blue-600"
            }`}
          >
            {isPending ? "처리 중..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSheet;
