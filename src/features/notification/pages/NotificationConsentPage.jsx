import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import NotificationUnsupportedSheet from "../components/NotificationUnsupportedSheet";
import { usePushSubscription } from "../hooks/usePushSubscription";

// 이동할 주소는 화면이 처음 열릴 때 한 번만 읽는다.
// finish()가 returnUrl을 지운 뒤 화면이 다시 그려져도 목적지가 /home으로 바뀌지 않게 하기 위해서다.
function readNextPath() {
  const returnUrl = localStorage.getItem("returnUrl");
  return returnUrl?.startsWith("/") && !returnUrl.startsWith("//") && returnUrl !== "/notification"
    ? returnUrl
    : "/home";
}

function NotificationConsentPage() {
  const navigate = useNavigate();
  const { supported, needsInstall, ready, setupError, subscribed, subscribe } = usePushSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [nextPath] = useState(readNextPath);
  const finished = useRef(false);
  const afterInviteAcceptance = nextPath.startsWith("/participate/");

  const finish = useCallback(() => {
    if (finished.current) return; // 이동은 한 번만 한다
    finished.current = true;
    localStorage.removeItem("returnUrl");
    navigate(nextPath, { replace: true });
  }, [navigate, nextPath]);

  // 회원가입·로그인 직후에 이미 이 기기로 알림을 받고 있으면 동의 화면을 건너뛴다.
  // 초대 수락 직후에는 어느 경우에도 화면을 그대로 보여준다.
  useEffect(() => {
    if (subscribed && !afterInviteAcceptance) finish();
  }, [afterInviteAcceptance, finish, subscribed]);

  const handleAccept = async () => {
    // 아이폰 사파리·카카오톡 인앱처럼 웹 푸시를 쓸 수 없는 환경에서는 구독할 수 없어서, 켜는 방법을 안내한다.
    if (!supported) {
      setError("");
      setIsGuideOpen(true);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await subscribe();
      finish();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed && !afterInviteAcceptance) return null;

  return (
    <PageShell className="flex flex-col justify-center px-[33px] py-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbe4ff]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 003.4 0" />
          </svg>
        </div>
        <h1 className="mt-[27px] text-[19px] font-extrabold leading-normal text-[#191f28]">
          약속 진행상황을<br />알림으로 받아보세요
        </h1>
        <p className="mt-[21px] whitespace-nowrap text-[12px] text-[#6b7280]">
          시간 확정 · 위치 입력 요청 · 최종 확정 · 투표 독려 시 알려드려요
        </p>
      </div>

      <div className="mt-[50px] flex flex-col gap-[21px]">
        <button
          onClick={handleAccept}
          disabled={loading || (supported && !ready)}
          className="h-[54px] w-full rounded-2xl bg-[#3b82f6] text-sm font-bold text-white transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "설정 중..." : "알림 받기"}
        </button>
        <button
          onClick={finish}
          disabled={loading}
          className="h-12 w-full rounded-2xl border border-[#e5e7eb] text-sm font-semibold text-[#6b7280] transition active:scale-95"
        >
          나중에
        </button>
      </div>

      {(error || setupError) && <p className="mt-4 text-center text-xs text-red-500">{error || setupError}</p>}

      <NotificationUnsupportedSheet
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        needsInstall={needsInstall}
        openUrl={`${window.location.origin}${nextPath}`}
      />
    </PageShell>
  );
}

export default NotificationConsentPage;
