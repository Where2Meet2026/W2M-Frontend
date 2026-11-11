import BottomSheet from "../../../shared/components/BottomSheet";
import { UNSUPPORTED_MESSAGE } from "../hooks/usePushSubscription";

// 아이폰은 홈 화면에 추가한 앱에서만 웹 푸시를 쓸 수 있고, 카카오톡 인앱 브라우저는 웹 푸시를 지원하지 않는다.
// 이런 환경에서는 "알림 받기"로 구독할 수 없으니, 켤 수 있는 방법을 안내한다.
const isKakaoInApp = () => typeof navigator !== "undefined" && /KAKAOTALK/i.test(navigator.userAgent);

// 안내 문구: needsInstall이면 아이폰(홈 화면에 추가 필요), 아니면 웹 알림을 지원하지 않는 브라우저
function getGuide(needsInstall, inKakao) {
  if (needsInstall) {
    return {
      title: "홈 화면에 추가하면 알림을 받을 수 있어요",
      steps: [
        ...(inKakao ? ["아래 버튼으로 Safari에서 이 페이지를 열어요"] : []),
        "공유 버튼에서 '홈 화면에 추가'를 눌러요",
        "홈 화면의 Where2Meet을 열고 같은 계정으로 로그인한 뒤 '알림 받기'를 눌러요",
      ],
    };
  }
  return {
    title: "이 브라우저에서는 알림을 켤 수 없어요",
    steps: inKakao
      ? ["아래 버튼으로 기본 브라우저에서 이 페이지를 열어요", "'알림 받기'를 눌러요"]
      : [UNSUPPORTED_MESSAGE],
  };
}

// openUrl: 카카오톡 안에서 기본 브라우저로 열 주소 (초대 수락 직후라면 모임 화면 주소)
function NotificationUnsupportedSheet({ isOpen, onClose, needsInstall, openUrl }) {
  const inKakao = isKakaoInApp();
  const { title, steps } = getGuide(needsInstall, inKakao);

  const openExternal = () => {
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(openUrl)}`;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} label={title}>
      <h2 className="mb-3 text-[17px] font-extrabold text-[#191f28]">{title}</h2>
      <ol className="mb-6 list-none space-y-2 p-0">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-2.5 text-sm leading-[1.6] text-gray-500">
            {steps.length > 1 && (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-extrabold text-blue-600">
                {index + 1}
              </span>
            )}
            <span className="min-w-0 break-keep">{step}</span>
          </li>
        ))}
      </ol>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="h-12 flex-1 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 transition active:scale-[0.98]"
        >
          {inKakao ? "닫기" : "확인"}
        </button>
        {inKakao && (
          <button
            type="button"
            onClick={openExternal}
            className="h-12 flex-1 rounded-xl bg-blue-500 text-sm font-bold text-white transition active:scale-[0.98] active:bg-blue-600"
          >
            기본 브라우저로 열기
          </button>
        )}
      </div>
    </BottomSheet>
  );
}

export default NotificationUnsupportedSheet;
