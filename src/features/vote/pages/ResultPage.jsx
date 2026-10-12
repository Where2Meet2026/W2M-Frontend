import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getFinalSelection,
  getMeetingDetails,
} from "../../meeting/api/meetingApi";
import PageShell from "../../../shared/components/PageShell";
import { getParticipants } from "../../meeting/api/participantApi";
import ShareBottomSheet from "../../../shared/components/ShareBottomSheet";
import { shareToKakao } from "../../../shared/lib/kakaoShare";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CATEGORY_LABEL = {
  MEAL: "식당",
  CAFE: "카페",
};
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours >= 12 ? "오후" : "오전"} ${hours % 12 || 12}:${minutes}`;
};

const formatSchedule = (start, end) => {
  if (!start) return "일정이 아직 정해지지 않았어요";
  const startDate = new Date(start);
  const day = `${startDate.getMonth() + 1}월 ${startDate.getDate()}일 
  (${DAYS[startDate.getDay()]})`;
  if (!end) return `${day} ${formatTime(startDate)}`;
  return `${day} ${formatTime(startDate)} - ${formatTime(new Date(end))}`;
};

function ResultPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [data, meeting, participantList] = await Promise.all([
          getFinalSelection(meetingId),
          getMeetingDetails(meetingId),
          getParticipants(meetingId),
        ]);
        setResult(data);
        setCategory(meeting.category);
        setInviteCode(meeting.inviteCode);
        setParticipants(participantList);
      } catch (error) {
        console.error("최종 확정 정보 로드 실패", error);
        setErrorMessage(error.message || "최종 확정 정보를 불러오지 못했어요.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [meetingId]);

  const region = result?.address?.split(" ").slice(0, 2).join(" ") ?? "";
  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const handleOpenMap = () => {
    const url = `https://map.kakao.com/link/map/${encodeURIComponent(result.placeName)},${result.latitude},${result.longitude}`;
    window.open(url, "_blank", "noopener");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite/accept/${inviteCode}`,
      );
      showNotice("초대 링크가 복사되었어요.");
    } catch (error) {
      console.error("링크 복사 실패:", error);
      showNotice("링크 복사에 실패했어요.");
    } finally {
      setIsShareOpen(false);
    }
  };

  const handleKakaoShare = () => {
    const link = `${window.location.origin}/invite/accept/${inviteCode}`;
    const description = result.confirmedStartDateTime
      ? `${formatSchedule(result.confirmedStartDateTime, result.confirmedEndDateTime)} · ${result.address}`
      : result.address;

    try {
      shareToKakao({
        title: result.placeName,
        description,
        link,
      });
    } catch (error) {
      console.error("카카오톡 공유 실패:", error);
      showNotice("카카오톡 공유에 실패했어요.");
    } finally {
      setIsShareOpen(false);
    }
  };

  return (
    <PageShell>
      <button
        onClick={() => navigate(-1)}
        className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-gray-100 transition active:scale-95"
        aria-label="뒤로가기"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#191f28"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {isLoading ? (
        <p className="m-0 text-center text-sm font-bold text-gray-400">
          불러오는 중...
        </p>
      ) : errorMessage ? (
        <div className="rounded-[20px] bg-red-50 px-5 py-[18px]">
          <p className="mb-1.5 text-[13px] font-extrabold text-red-600">
            불러올 수 없습니다
          </p>
          <p className="m-0 text-[13px] leading-[1.65] text-red-700">
            {errorMessage}
          </p>
        </div>
      ) : (
        <>
          <section className="mb-7">
            <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">
              WHERE2MEET
            </p>
            <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px]">
              모임이 최종 확정됐어요
            </h1>
            <p className="m-0 text-sm leading-[1.7] text-gray-500">
              아래 시간과 장소로 모임이 확정됐어요. 즐거운 시간 보내세요.
            </p>
          </section>

          <section className="mb-4 overflow-hidden rounded-3xl bg-gray-50">
            <div className="relative flex h-[176px] items-center justify-center bg-gray-200">
              {CATEGORY_LABEL[category] && (
                <span className="absolute left-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
                  {CATEGORY_LABEL[category]}
                </span>
              )}
              <span className="absolute right-4 top-4 rounded-full bg-green-50 px-3 py-1 text-[11px] font-extrabold text-green-600">
                확정 완료
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                </svg>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="mb-1.5 truncate text-[17px] font-extrabold">
                {result.placeName}
              </p>
              <p className="m-0 text-[13px] text-gray-500">{result.address}</p>
            </div>
          </section>

          <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[18px]">
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <p className="m-0 text-sm font-extrabold">
                {formatSchedule(
                  result.confirmedStartDateTime,
                  result.confirmedEndDateTime,
                )}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 
                text-blue-500"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="m-0 min-w-0 truncate text-sm font-extrabold">
                {result.placeName} · {region}
              </p>
            </div>
          </section>
          <section className="mb-7">
            <p className="mb-2.5 text-[13px] font-bold text-gray-400">
              함께하는 사람 · {participants.length}명
            </p>
            <div className="flex">
              {participants.map((participant, index) => (
                <div
                  key={participant.participantId}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[11px] font-extrabold text-blue-600 ${
                    index > 0 ? "-ml-2" : ""
                  }`}
                >
                  {participant.userName?.charAt(0)}
                </div>
              ))}
            </div>
          </section>
          <div className="mt-auto space-y-3 pt-4">
            <button
              type="button"
              onClick={handleOpenMap}
              className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
            >
              지도에서 보기
            </button>
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-blue-500 bg-white text-sm font-extrabold text-blue-500 transition active:scale-95"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
              공유하기
            </button>
          </div>

          <ShareBottomSheet
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title="모임 정보 공유하기"
            previewTitle={result.placeName}
            previewDescription={
              result.confirmedStartDateTime
                ? `${formatSchedule(result.confirmedStartDateTime, result.confirmedEndDateTime)} · Where2Meet`
                : `${region} · Where2Meet`
            }
            onKakaoShare={handleKakaoShare}
            onCopyLink={handleCopyLink}
          />

          {notice && (
            <div className="fixed inset-x-6 bottom-6 mx-auto max-w-[345px] rounded-2xl bg-blue-50 px-4 py-3 shadow-lg">
              <p className="m-0 text-[13px] font-bold leading-[1.6] text-blue-700">
                {notice}
              </p>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}

export default ResultPage;
