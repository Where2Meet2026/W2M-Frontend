import { useCallback, useEffect, useState } from "react";
import { subscribePush, unsubscribePush } from "../api/notificationApi";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const isSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

// 아이폰·아이패드(iOS 16.4+)는 홈 화면에 추가한 웹앱에서만 웹 푸시를 쓸 수 있다. Safari 탭에서는 PushManager가 없다.
const isIos = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)); // 데스크톱 모드로 열린 아이패드

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true);

export const IOS_INSTALL_GUIDE =
  "아이폰은 Safari 공유 버튼 → '홈 화면에 추가' 후, 홈 화면 아이콘으로 열어야 알림을 받을 수 있어요.";
export const UNSUPPORTED_MESSAGE = "이 브라우저는 웹 알림을 지원하지 않아요.";

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function getRegistration() {
  await navigator.serviceWorker.register("/sw.js");
  return navigator.serviceWorker.ready;
}

export function usePushSubscription() {
  const supported = isSupported();
  const needsInstall = !supported && isIos() && !isStandalone();
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => setSubscribed(Boolean(sub)))
      .catch(() => {});
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported) throw new Error(needsInstall ? IOS_INSTALL_GUIDE : UNSUPPORTED_MESSAGE);

    const result = await Notification.requestPermission();
    if (result !== "granted") throw new Error("알림 권한이 허용되지 않았어요.");

    const reg = await getRegistration();
    const sub =
      (await reg.pushManager.getSubscription()) ||
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }));

    // sub.toJSON()이 백엔드가 기대하는 { endpoint, keys: { p256dh, auth } } 형태를 그대로 만들어준다.
    await subscribePush(sub.toJSON());
    setSubscribed(true);
  }, [supported, needsInstall]);

  const unsubscribe = useCallback(async () => {
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await unsubscribePush(sub.endpoint);
      await sub.unsubscribe();
    }
    setSubscribed(false);
  }, []);

  return { supported, needsInstall, subscribed, subscribe, unsubscribe };
}
