import { useCallback, useEffect, useRef, useState } from "react";
import { getPushSubscriptionStatus, subscribePush, unsubscribePush } from "../api/notificationApi";

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

export function usePushSubscription() {
  const supported = isSupported();
  const needsInstall = !supported && isIos() && !isStandalone();
  const registration = useRef(null);
  const subscription = useRef(null);
  const [subscribed, setSubscribed] = useState(false);
  const [ready, setReady] = useState(false);
  const [setupError, setSetupError] = useState("");

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;

    async function prepare() {
      try {
        await navigator.serviceWorker.register("/sw.js");
        const worker = await navigator.serviceWorker.ready;
        const existing = await worker.pushManager.getSubscription();
        if (cancelled) return;
        registration.current = worker;
        subscription.current = existing;
        const registered = existing && await getPushSubscriptionStatus(existing.endpoint);
        if (!cancelled) setSubscribed(registered === true);
      } catch {
        if (!cancelled) {
          setSetupError(registration.current
            ? "알림 구독 상태를 확인하지 못했어요. 다시 설정해 주세요."
            : "알림 설정을 준비하지 못했어요. 페이지를 새로고침해 주세요.");
        }
      } finally {
        if (!cancelled) setReady(Boolean(registration.current));
      }
    }

    prepare();
    return () => { cancelled = true; };
  }, [supported]);

  const subscribe = useCallback(async () => {
    setSetupError("");
    if (!registration.current) throw new Error("알림 설정을 준비하고 있어요.");
    if (Notification.permission === "denied") {
      throw new Error("브라우저 설정에서 이 사이트의 알림을 허용해 주세요.");
    }
    if (!subscription.current && !VAPID_PUBLIC_KEY?.trim()) {
      throw new Error("알림 서비스 설정이 아직 준비되지 않았어요.");
    }

    let sub;
    try {
      // Service Worker를 미리 준비해 버튼을 누른 이벤트에서 바로 권한을 요청한다.
      sub = subscription.current ?? await registration.current.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    } catch (error) {
      if (error.name === "NotAllowedError") {
        throw new Error("알림 권한이 허용되지 않았어요.");
      }
      throw error;
    }
    subscription.current = sub;
    await subscribePush(sub.toJSON());
    setSubscribed(true);
  }, []);

  const unsubscribe = useCallback(async () => {
    setSetupError("");
    const sub = subscription.current;
    if (sub) await unsubscribePush(sub.endpoint);
    setSubscribed(false);
    if (sub) await sub.unsubscribe();
    subscription.current = null;
  }, []);

  return { supported, needsInstall, ready, setupError, subscribed, subscribe, unsubscribe };
}
