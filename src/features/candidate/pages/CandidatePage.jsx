import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCandidates, toggleReaction } from "../api/candidateApi";
import PageShell from "../../../shared/components/PageShell";
import { getMeetingDetails } from "../../meeting/api/meetingApi";
import { getVoteStatus, castVote } from "../../vote/api/voteApi";

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
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [isReacting, setIsReacting] = useState(false);

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
        const message =
          error.message === "Failed to fetch"
            ? "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요."
            : error.message;
        setErrorMessage(
          message || "후보 장소를 불러오는 중 문제가 발생했습니다.",
        );
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
  const isClosed = voteStatus?.isClosed ?? false;
  const confirmedCandidate = candidates.find(
    (candidate) => candidate.candidateId === voteStatus?.confirmedCandidateId,
  );
  const confirmedVoteCount = confirmedCandidate
    ? getVoteCount(confirmedCandidate.candidateId)
    : 0;
  const otherCandidates = candidates
    .filter(
      (candidate) => candidate.candidateId !== voteStatus?.confirmedCandidateId,
    )
    .sort((a, b) => getVoteCount(b.candidateId) - getVoteCount(a.candidateId));
  useEffect(() => {
    if (!meetingId || isLoading || isClosed) return;

    const interval = setInterval(async () => {
      try {
        const [data, status] = await Promise.all([
          getCandidates(meetingId),
          getVoteStatus(meetingId),
        ]);
        setCandidates(data.candidates || data || []);
        setVoteStatus(status);
      } catch (error) {
        console.error("투표 현황 갱신 실패:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [meetingId, isLoading, isClosed]);
  const handleVote = async (candidateId) => {
    try {
      setIsVoting(true);
      await castVote(meetingId, candidateId);
      const status = await getVoteStatus(meetingId);
      setVoteStatus(status);
    } catch (error) {
      console.error("투표 실패", error);
      setVoteError(error.message);
      setTimeout(() => setVoteError(""), 3000);
    } finally {
      setIsVoting(false);
    }
  };
  const handleReaction = async (candidateId, reactionType) => {
    try {
      setIsReacting(true);
      setVoteError("");
      await toggleReaction(meetingId, candidateId, reactionType);
      const [data, status] = await Promise.all([
        getCandidates(meetingId),
        getVoteStatus(meetingId),
      ]);
      setCandidates(data.candidate || data || []);
      setVoteStatus(status);
    } catch (error) {
      console.error("반응 실패", error);
      setVoteError(error.message);
      setTimeout(() => setVoteError(""), 3000);
    } finally {
      setIsReacting(false);
    }
  };

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
        <div className="flex flex-1 flex-col justify-center pb-20">
          <div className="rounded-[20px] bg-red-50 px-5 py-[18px]">
            <p className="mb-1.5 text-[13px] font-extrabold text-red-600">
              불러올 수 없습니다
            </p>
            <p className="m-0 text-[13px] leading-[1.65] text-red-700">
              {errorMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 h-12 w-full rounded-2xl bg-blue-500 text-sm font-extrabold text-white transition active:scale-95"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <section className="mb-3">
            <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">
              WHERE2MEET
            </p>
            <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px]">
              {isClosed ? "장소가 확정됐어요" : "후보에 투표해주세요"}
            </h1>
            <p className="m-0 text-sm leading-[1.7] text-gray-500">
              {isClosed
                ? "전원이 투표를 마쳐서 서버가 자동으로 최다 득표 후보를 확정했어요."
                : "마음에 드는 후보 하나를 골라 투표하기를 누르면 최종 투표에 반영돼요."}
            </p>
          </section>

          <section className="mb-4 rounded-3xl bg-gray-50 px-5 py-[18px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="m-0 text-[13px] font-bold text-gray-400">
                현재 모임
              </p>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                  isClosed
                    ? "bg-green-50 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {isClosed ? "투표 마  감 · 확정 완료" : "투표 진행중"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
              <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
                {meetingTitle || "모임"}
              </p>
            </div>
            {isClosed ? (
              <p className="m-0 mt-3 text-[13px] font-bold text-gray-500">
                {totalParticipants}명 중 {votedCount}명 투표 완료
              </p>
            ) : (
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
            )}
          </section>
          {isClosed ? (
            <div className="space-y-3">
              {confirmedCandidate && (
                <div className="rounded-3xl border-2 border-blue-500 bg-blue-50 p-5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-[11px] font-extrabold text-white">
                      확정된 장소
                    </span>
                    <svg
                      className="text-blue-500"
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
                  </div>
                  <p className="mb-1.5 truncate text-lg font-extrabold text-[#191f28]">
                    {confirmedCandidate.placeName}
                  </p>
                  <p className="mb-2.5 truncate text-[13px] text-gray-500">
                    평균 {Math.round(confirmedCandidate.avgDistanceMeters)}m ·{" "}
                    {TYPE_LABEL[confirmedCandidate.type]}
                  </p>
                  <p className="m-0 text-[13px] text-gray-500">
                    <span className="mr-1 text-xl font-extrabold text-blue-500">
                      {confirmedVoteCount}표
                    </span>
                    · {totalParticipants}명 중 {confirmedVoteCount}명이
                    선택했어요
                  </p>
                </div>
              )}

              {otherCandidates.map((candidate, index) => (
                <div
                  key={candidate.candidateId}
                  className="rounded-3xl bg-gray-50 px-[18px] py-4"
                >
                  <span className="mb-2 inline-block rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-extrabold text-gray-600">
                    {index + 2}위
                  </span>
                  <p className="mb-1 truncate text-base font-extrabold text-[#191f28]">
                    {candidate.placeName}
                  </p>
                  <p className="m-0 text-xs text-gray-400">
                    {getVoteCount(candidate.candidateId)}표
                  </p>
                </div>
              ))}
            </div>
          ) : (
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
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleReaction(candidate.candidateId, "LIKE")
                          }
                          disabled={isReacting}
                          className={`flex items-center gap-1 text-[11px] font-bold disabled:opacity-50 ${
                            candidate.myReaction === "LIKE"
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={
                              candidate.myReaction === "LIKE"
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                          {candidate.likeCount}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReaction(candidate.candidateId, "DISLIKE")
                          }
                          disabled={isReacting}
                          className={`flex items-center gap-1 text-[11px] font-bold disabled:opacity-50 ${
                            candidate.myReaction === "DISLIKE"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={
                              candidate.myReaction === "DISLIKE"
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 14V2" />
                            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                          </svg>
                          {candidate.dislikeCount}
                        </button>
                      </div>
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
                        onClick={() => handleVote(candidate.candidateId)}
                        disabled={isVoting}
                        className="h-[30px] shrink-0 rounded-full border-[1.5px] border-blue-500 bg-white px-3 
                    text-xs font-extrabold text-blue-500 disabled:opacity-50"
                      >
                        투표하기
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {isClosed ? (
            <section className="mt-6 rounded-[20px] bg-green-50 px-5 py-4">
              <div className="mb-1 flex items-center gap-2">
                <svg
                  className="shrink-0 text-green-600"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <p className="m-0 text-[13px] font-extrabold text-green-700">
                  투표가 끝나 장소가 자동으로 확정됐어요
                </p>
              </div>
              <p className="m-0 text-xs text-green-600">
                방장의 별도 확정 절차 없이 자동으로 처리돼요
              </p>
            </section>
          ) : (
            <section className="mt-6 rounded-[20px] bg-blue-50 px-[18px] py-3.5">
              <p className="m-0 text-[13px] font-extrabold leading-[1.6] text-blue-600">
                마지막 한 명이 투표하면 자동으로 확정돼요.
                <br />
                확정 후에는 투표를 바꿀 수 없어요.
              </p>
            </section>
          )}
          {isClosed && (
            <button
              type="button"
              onClick={() => navigate(`/result/${meetingId}`)}
              className="mt-4 h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
            >
              최종 확정 보기
            </button>
          )}
          {voteError && (
            <div className="fixed inset-x-6 bottom-6 mx-auto max-w-[345px] rounded-2xl bg-red-50 px-4 py-3 shadow-lg">
              <p className="m-0 text-[13px] font-bold leading-[1.6] text-red-700">
                {voteError}
              </p>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
export default CandidatePage;
