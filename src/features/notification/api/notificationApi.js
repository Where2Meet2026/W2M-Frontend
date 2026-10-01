import { apiClient } from "../../../shared/api/client";

// 백엔드 notification 컨트롤러 구현 시 경로를 맞춰야 합니다. (PushSubscription: endpoint, p256dh, auth)
export const subscribePush = ({ endpoint, p256dh, auth }) =>
  apiClient.post("/api/notifications/subscriptions", { endpoint, p256dh, auth });

export const unsubscribePush = (endpoint) =>
  apiClient.post("/api/notifications/subscriptions/delete", { endpoint });
