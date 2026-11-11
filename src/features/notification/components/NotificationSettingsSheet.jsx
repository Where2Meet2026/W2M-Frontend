import { useState } from "react";
import BottomSheet from "../../../shared/components/BottomSheet";
import { IOS_INSTALL_GUIDE, UNSUPPORTED_MESSAGE, usePushSubscription } from "../hooks/usePushSubscription";

function NotificationSettingsSheet({ isOpen, onClose }) {
  const { supported, needsInstall, ready, setupError, subscribed, subscribe, unsubscribe } = usePushSubscription();
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

  // 예전엔 닫으면 시트가 사라지면서 에러 문구도 지워졌는데, 이제 항상 그려 두니까 닫을 때 직접 지운다
  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} label="알림 설정" radius="rounded-t-[20px]" handleColor="bg-[#dddddd]">
      <h2 className="mt-[34px] text-base font-bold text-[#191f28]">알림 설정</h2>
      <div className="mt-[30px] flex items-center justify-between">
        <span className="text-sm text-[#374151]">약속 진행 상황 알림 받기</span>
        <button
          role="switch"
          aria-checked={subscribed}
          disabled={busy || !ready}
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
      {!supported && (
        <p className="mt-3 break-keep text-xs leading-relaxed text-gray-400">
          {needsInstall ? IOS_INSTALL_GUIDE : UNSUPPORTED_MESSAGE}
        </p>
      )}
      {(error || setupError) && <p className="mt-3 text-xs text-red-500">{error || setupError}</p>}
    </BottomSheet>
  );
}

export default NotificationSettingsSheet;
