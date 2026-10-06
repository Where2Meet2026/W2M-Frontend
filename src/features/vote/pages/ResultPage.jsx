import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFinalSelection } from "../../meeting/api/meetingApi";
import PageShell from "../../../shared/components/PageShell";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

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

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getFinalSelection(meetingId);
        setResult(data);
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
        </>
      )}
    </PageShell>
  );
}

export default ResultPage;