import { useCallback, useEffect, useState } from "react";
import { subscribePush, unsubscribePush } from "../api/notificationApi";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const isSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function arrayBufferToBase64Url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getRegistration() {
  await navigator.serviceWorker.register("/sw.js");
  return navigator.serviceWorker.ready;
}

export function usePushSubscription() {
  const supported = isSupported();
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
    if (!supported) throw new Error("이 브라우저는 웹 알림을 지원하지 않아요.");

    const result = await Notification.requestPermission();
    if (result !== "granted") throw new Error("알림 권한이 허용되지 않았어요.");

    const reg = await getRegistration();
    const sub =
      (await reg.pushManager.getSubscription()) ||
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }));

    await subscribePush({
      endpoint: sub.endpoint,
      p256dh: arrayBufferToBase64Url(sub.getKey("p256dh")),
      auth: arrayBufferToBase64Url(sub.getKey("auth")),
    });
    setSubscribed(true);
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await unsubscribePush(sub.endpoint);
      await sub.unsubscribe();
    }
    setSubscribed(false);
  }, []);

  return { supported, subscribed, subscribe, unsubscribe };
}
