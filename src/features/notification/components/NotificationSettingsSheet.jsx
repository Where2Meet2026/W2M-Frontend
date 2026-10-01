import { useState } from "react";
import { usePushSubscription } from "../hooks/usePushSubscription";

function NotificationSettingsSheet({ onClose }) {
  const { supported, subscribed, subscribe, unsubscribe } = usePushSubscription();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    setBusy(true);
    setError("");
    try {
      if (subscribed) await unsubscribe();
      else await subscribe();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35" onClick={onClose}>
      <div
        className="w-[393px] rounded-t-[20px] bg-white px-[25px] pb-10 pt-[17px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-9 rounded-sm bg-[#dddddd]" />
        <h2 className="mt-[34px] text-base font-bold text-[#191f28]">알림 설정</h2>
        <div className="mt-[30px] flex items-center justify-between">
          <span className="text-sm text-[#374151]">약속 진행 상황 알림 받기</span>
          <button
            role="switch"
            aria-checked={subscribed}
            disabled={busy || !supported}
            onClick={handleToggle}
            className={`relative h-[26px] w-11 rounded-full transition-colors disabled:opacity-50 ${
              subscribed ? "bg-[#3b82f6]" : "bg-[#d1d5db]"
            }`}
          >
            <span
              className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${
                subscribed ? "left-[21px]" : "left-[3px]"
              }`}
            />
          </button>
        </div>
        {!supported && <p className="mt-3 text-xs text-gray-400">이 브라우저는 웹 알림을 지원하지 않아요.</p>}
        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default NotificationSettingsSheet;
