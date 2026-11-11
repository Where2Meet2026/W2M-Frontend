import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import { IOS_INSTALL_GUIDE, UNSUPPORTED_MESSAGE, usePushSubscription } from "../hooks/usePushSubscription";

function NotificationConsentPage() {
  const navigate = useNavigate();
  const { supported, needsInstall, ready, setupError, subscribed, subscribe } = usePushSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const returnUrl = localStorage.getItem("returnUrl");
  const nextPath = returnUrl?.startsWith("/") && !returnUrl.startsWith("//") && returnUrl !== "/notification"
    ? returnUrl
    : "/home";
  const afterInviteAcceptance = nextPath.startsWith("/participate/");
  const permissionDenied = supported && Notification.permission === "denied";
  const canSubscribe = supported && !permissionDenied;

  const finish = useCallback(() => {
    localStorage.removeItem("returnUrl");
    navigate(nextPath, { replace: true });
  }, [navigate, nextPath]);

  useEffect(() => {
    if (subscribed && !afterInviteAcceptance) finish();
  }, [afterInviteAcceptance, finish, subscribed]);

  const handleAccept = async () => {
    setLoading(true);
    setError("");
    try {
      await subscribe();
      if (afterInviteAcceptance) finish();
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
          {subscribed ? <>이 기기로 약속 알림을<br />받고 있어요</> : <>약속 진행상황을<br />알림으로 받아보세요</>}
        </h1>
        <p className="mt-[21px] whitespace-nowrap text-[12px] text-[#6b7280]">
          시간 확정 · 위치 입력 요청 · 최종 확정 · 투표 독려 시 알려드려요
        </p>
      </div>

      <div className="mt-[50px] flex flex-col gap-[21px]">
        {(canSubscribe || subscribed) && (
          <button
            onClick={subscribed ? finish : handleAccept}
            disabled={loading || !ready}
            className="h-[54px] w-full rounded-2xl bg-[#3b82f6] text-sm font-bold text-white transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "설정 중..." : subscribed ? "모임으로 이동" : "알림 받기"}
          </button>
        )}
        {!subscribed && <button
          onClick={finish}
          disabled={loading}
          className="h-12 w-full rounded-2xl border border-[#e5e7eb] text-sm font-semibold text-[#6b7280] transition active:scale-95"
        >
          {canSubscribe ? "나중에" : afterInviteAcceptance ? "모임으로 이동" : "계속하기"}
        </button>}
      </div>

      {!canSubscribe && (
        <p className="mt-4 break-keep text-center text-xs leading-relaxed text-gray-400">
          {permissionDenied
            ? "기기나 브라우저 설정에서 Where2Meet 알림을 허용할 수 있어요."
            : needsInstall && afterInviteAcceptance
              ? "모임에 참여했어요. 아이폰 홈 화면의 Where2Meet을 열고 같은 계정으로 알림을 켜주세요."
              : needsInstall ? IOS_INSTALL_GUIDE : UNSUPPORTED_MESSAGE}
        </p>
      )}
      {(error || setupError) && <p className="mt-4 text-center text-xs text-red-500">{error || setupError}</p>}
    </PageShell>
  );
}

export default NotificationConsentPage;
