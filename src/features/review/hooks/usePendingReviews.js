import { useEffect, useState } from "react";
import { getFinalSelection, getMyMeetings } from "../../meeting/api/meetingApi";
import { byMostRecentlyEnded, isWithinReviewWindow } from "../utils/reviewWindow";

// 내 모임 중 끝난 지 2주 이내인 모임을 최근 순으로 반환한다.
// 이미 리뷰를 쓴 모임은 제외한다.
export function usePendingReviews() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const meetings = (await getMyMeetings())
          .filter((m) => isWithinReviewWindow(m))
          .sort(byMostRecentlyEnded);
        const places = await Promise.allSettled(meetings.map((m) => getFinalSelection(m.meetingId)));
        const items = meetings.flatMap((m, i) =>
          places[i].status === "fulfilled" && places[i].value?.placeName
            ? [{
                meetingId: m.meetingId,
                meetingTitle: m.title,
                meetingDate: m.confirmedStartDateTime,
                placeName: places[i].value.placeName,
                placeAddress: places[i].value.address,
              }]
            : [],
        );
        if (!cancelled) setPending(items);
      } catch {
        if (!cancelled) setPending([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return pending;
}
