import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import { usePushSubscription } from "../hooks/usePushSubscription";

function NotificationConsentPage() {
  const navigate = useNavigate();
  const { supported, subscribe } = usePushSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finish = () => navigate("/home", { replace: true });

  const handleAccept = async () => {
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
          disabled={loading || !supported}
          className="h-[45px] w-full rounded-[14px] bg-[#3b82f6] text-sm font-bold text-white transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "설정 중..." : "알림 받기"}
        </button>
        <button
          onClick={finish}
          className="h-[45px] w-full rounded-[14px] border border-[#e5e7eb] text-sm font-semibold text-[#6b7280] transition active:scale-95"
        >
          나중에
        </button>
      </div>

      {!supported && (
        <p className="mt-4 text-center text-xs text-gray-400">이 브라우저는 웹 알림을 지원하지 않아요.</p>
      )}
      {error && <p className="mt-4 text-center text-xs text-red-500">{error}</p>}
    </PageShell>
  );
}

export default NotificationConsentPage;
