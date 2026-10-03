import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCandidates } from "../api/candidateApi";
import PageShell from "../../../shared/components/PageShell";
import { getMeetingDetails } from "../../meeting/api/meetingApi";
import { getVoteStatus } from "../../vote/api/voteApi";

const TYPE_LABEL = {
  FASTEST: "가장 빠른 동선",
  BALANCED: "참여자 간 편차 최소",
  OPTIMAL: "거리 + 평점 최적",
};

function CandidatePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [voteStatus, setVoteStatus] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [data, meeting, status] = await Promise.all([
          getCandidates(meetingId),
          getMeetingDetails(meetingId),
          getVoteStatus(meetingId),
        ]);
        setCandidates(data.candidates || data || []);
        setMeetingTitle(meeting.title || "");
        setVoteStatus(status);
      } catch (error) {
        console.error("후보 화면 데이터 로드 실패:", error);
        setErrorMessage("후보 장소를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, [meetingId]);
  const totalParticipants = voteStatus?.totalParticipants ?? 0;
  const votedCount = voteStatus?.votedCount ?? 0;
  const votedPercent =
    totalParticipants > 0 ? (votedCount / totalParticipants) * 100 : 0;
  const getVoteCount = (candidateId) =>
    voteStatus?.results?.find((item) => item.candidateId === candidateId)
      ?.voteCount ?? 0;
  return (
    <PageShell className="flex flex-col px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full
            border-0 bg-gray-100 transition active:scale-95"
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
        <div className="flex flex-1 flex-col items-center justify-center pb-20">
          <p className="mb-6 text-xs font-extrabold tracking-[0.5px] text-blue-500">
            WHERE2MEET
          </p>

          <div className="relative mb-8 flex h-[180px] w-[180px] items-center justify-center">
            <div
              className="absolute inset-0 animate-spin rounded-full border-[10px] 
                        border-gray-100 border-t-blue-500 border-r-blue-500 border-b-blue-500 "
            />
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>

          <h2 className="mb-1.5 text-lg font-extrabold text-[#191f28]">
            맞춤 장소를 찾고 있어요
          </h2>
          <p className="m-0 text-[13px] text-gray-400"> 잠시만 기다려주세요</p>
        </div>
      ) : errorMessage ? (
        <div>{errorMessage}</div>
      ) : (
        <>
          <section className="mb-3">
            <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">
              WHERE2MEET
            </p>
            <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px]">
              후보에 투표해주세요
            </h1>
            <p className="m-0 text-sm leading-[1.7] text-gray-500">
              마음에 드는 후보 하나를 골라 투표하기를 누르면 최종 투표에
              반영돼요.
            </p>
          </section>

          <section className="mb-4 rounded-3xl bg-gray-50 px-5 py-[18px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="m-0 text-[13px] font-bold text-gray-400">
                현재 모임
              </p>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
                투표 진행중
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
              <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
                {meetingTitle || "모임"}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${votedPercent}%` }}
                />
              </div>
              <p className="m-0 shrink-0 text-[11px] font-bold text-gray-400">
                {totalParticipants}명 중 {votedCount}명 투표 완료
              </p>
            </div>
          </section>

          <div className="space-y-3">
            {candidates.map((candidate) => {
              const voteCount = getVoteCount(candidate.candidateId);
              const percent =
                totalParticipants > 0
                  ? Math.round((voteCount / totalParticipants) * 100)
                  : 0;
              const isMyVote =
                voteStatus?.myVoteCandidateId === candidate.candidateId;

              return (
                <div
                  key={candidate.candidateId}
                  className="flex gap-3 rounded-3xl bg-gray-50 p-3.5"
                >
                  <div className="flex w-[72px] shrink-0 flex-col items-center gap-1.5">
                    <div className="h-[72px] w-[72px] rounded-2xl bg-gray-200" />
                    <p className="m-0 text-[11px] font-bold text-gray-400">
                      👍 {candidate.likeCount} · 👎 {candidate.dislikeCount}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 truncate text-base font-extrabold text-[#191f28]">
                      {candidate.placeName}
                    </p>
                    <p className="m-0 truncate text-[11px] text-gray-400">
                      평균 {Math.round(candidate.avgDistanceMeters)}m ·{" "}
                      {TYPE_LABEL[candidate.type]}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1 w-[100px] shrink-0 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-extrabold ${isMyVote ? "text-blue-500" : "text-gray-400"}`}
                      >
                        {percent}%
                      </span>
                    </div>
                  </div>

                  {isMyVote ? (
                    <button
                      type="button"
                      className="flex h-[30px] shrink-0 items-center gap-1 rounded-full bg-blue-500 px-3 text-xs font-extrabold text-white"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      투표완료
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="h-[30px] shrink-0 rounded-full border-[1.5px] border-blue-500 bg-white px-3 text-xs font-extrabold text-blue-500"
                    >
                      투표하기
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <section className="mt-6 rounded-[20px] bg-blue-50 px-[18px] py-3.5">
            <p className="m-0 text-[13px] font-extrabold leading-[1.6] text-blue-600">
              마지막 한 명이 투표하면 자동으로 확정돼요.
              <br />
              확정 후에는 투표를 바꿀 수 없어요.
            </p>
          </section>
        </>
      )}
    </PageShell>
  );
}
export default CandidatePage;
