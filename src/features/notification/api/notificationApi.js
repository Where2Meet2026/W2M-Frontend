import { apiClient } from "../../../shared/api/client";

// 백엔드 NotificationController 기준: POST/DELETE /api/notifications/subscribe
// body는 브라우저 PushSubscription.toJSON() 형태 그대로: { endpoint, keys: { p256dh, auth } }
export const subscribePush = (subscriptionJson) =>
  apiClient.post("/api/notifications/subscribe", subscriptionJson);

export const unsubscribePush = (endpoint) =>
  apiClient.delete("/api/notifications/subscribe", { endpoint });
