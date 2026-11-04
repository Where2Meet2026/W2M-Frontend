import BottomSheet from "./BottomSheet";

// 브라우저 기본 확인 창(window.confirm) 대신 쓰는 앱 안 확인 시트.
// window.confirm은 환경에 따라 아예 뜨지 않거나(바로 '취소' 처리) 디자인이 앱과 따로 놀아서 이걸로 통일한다.
// 껍데기(배경·애니메이션·Esc)는 공통 BottomSheet를 쓰고, 처리 중에는 닫히지 않게 dismissible을 끈다.
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
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} label={title} dismissible={!isPending}>
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
    </BottomSheet>
  );
}

export default ConfirmSheet;
