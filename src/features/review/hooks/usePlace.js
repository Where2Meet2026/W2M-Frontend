import { useEffect, useState } from "react";
import { getFinalSelection } from "../../meeting/api/meetingApi";

// 이전 화면에서 넘겨준 장소가 있으면 사용하고, 없으면(직접 접속 등) 확정 장소를 조회한다.
export function usePlace(meetingId, initialPlace, enabled = true) {
  const [fetched, setFetched] = useState(null);

  useEffect(() => {
    if (!enabled || initialPlace?.name) return;
    getFinalSelection(meetingId)
      .then((data) => setFetched({ name: data.placeName, address: data.address }))
      .catch(() => {});
  }, [meetingId, initialPlace, enabled]);

  return initialPlace?.name ? initialPlace : fetched;
}
