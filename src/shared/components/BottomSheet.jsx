import { useEffect } from "react";

// 앱 공통 바텀시트 껍데기: 어두운 배경 + 앱 화면 폭(393px)의 흰 시트 + 손잡이. 내용은 children으로 넣는다.
// - isOpen을 넘기면 항상 그려 두고, 열고 닫을 때 아래에서 올라오고/내려가는 애니메이션을 준다 (공유·확인·지도 시트)
// - isOpen을 안 넘기면 '그려져 있으면 열린 것'으로 본다 (조건부로 그리는 알림 설정·리뷰 대기 시트)
// - dismissible이 false면 배경 클릭·Esc로 닫히지 않는다 (확인 시트에서 서버 응답을 기다리는 중일 때)
// 노트북에서는 Esc 키로도 닫힌다.
//   <BottomSheet isOpen={isOpen} onClose={close} label="모임 초대하기"> ...내용... </BottomSheet>
function BottomSheet({
  isOpen = true,
  onClose,
  label,
  dismissible = true,
  radius = "rounded-t-[28px]",
  handleColor = "bg-gray-200",
  children,
}) {
  useEffect(() => {
    if (!isOpen || !dismissible) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dismissible, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={dismissible ? onClose : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative w-full max-w-[393px] bg-white px-6 pb-8 pt-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${radius} ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className={`mx-auto mb-5 h-1 w-9 rounded-full ${handleColor}`} />
        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
