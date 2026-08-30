import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../../meeting/api/meetingApi";
import { getParticipants } from "../../meeting/api/participantApi";
import PageShell from "../../../shared/components/PageShell";

function TimeWaitingPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "" });
  const [participants, setParticipants] = useState([]);

  // 초기 데이터 로드 (모임 정보 + 참여자 목록)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [details, participantList] = await Promise.all([
          getMeetingDetails(meetingId),
          getParticipants(meetingId)
        ]);
        
        setMeetingData({
          title: details.title || details.name || details.meetingName || "",
        });
        setParticipants(participantList || []);
      } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) fetchInitialData();
  }, [meetingId]);

  // 참여자 상태만 주기적으로 업데이트 (폴링) - 5초마다
  useEffect(() => {
    if (!meetingId) return;

    const updateParticipantStatus = async () => {
      try {
        const participantList = await getParticipants(meetingId);
        setParticipants(participantList || []);
      } catch (error) {
        console.error("참여자 상태 업데이트 실패:", error);
      }
    };

    const interval = setInterval(updateParticipantStatus, 5000);
    return () => clearInterval(interval);
  }, [meetingId]);

  return (
    <PageShell className="flex flex-col overflow-y-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-gray-100 transition active:scale-95"
          aria-label="뒤로가기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <section className="mb-10">
          <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">
            WHERE2MEET
          </p>
          <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px]">
            입력 현황을 확인해주세요
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            모두가 가능한 시간을 입력하면 추천 시간을 확인할 수 있어요.
          </p>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-400">현재 모임</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              자동 갱신
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
              {isLoading && !meetingData.title ? "모임 정보를 불러오는 중..." : meetingData.title || "모임"}
            </p>
          </div>
          <p className="m-0 pl-5 text-[13px] leading-[1.6] text-gray-500">
            5초마다 참여자 입력 상태를 새로 확인합니다.
          </p>
        </section>

        <section className="mb-7 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-700">참여자 상태</p>
            <span className="text-[13px] font-extrabold text-gray-400">
              {participants.filter((p) => p.isTimeSelected).length}/{participants.length}
            </span>
          </div>

          {isLoading && participants.length === 0 ? (
            <div className="rounded-3xl bg-gray-50 px-5 py-10 text-center">
              <p className="m-0 text-sm font-extrabold text-gray-500">로딩 중...</p>
            </div>
          ) : participants.length > 0 ? (
            <div className="space-y-3">
              {participants.map((p) => (
                <div
                  key={p.participantId || p.id}
                  className="flex min-h-[68px] items-center justify-between gap-3 rounded-3xl border-[1.5px] border-gray-100 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {p.role === "HOST" && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-600">
                          방장
                        </span>
                      )}
                      <p className="m-0 truncate text-[15px] font-extrabold text-[#191f28]">
                        {p.userName || p.name || "참여자"}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                    p.isTimeSelected
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {p.isTimeSelected ? "완료" : "미완료"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-[1.5px] border-dashed border-gray-200 bg-white px-5 py-10 text-center">
              <p className="text-sm font-extrabold text-gray-600">참여자가 없습니다</p>
              <p className="mt-1 text-xs leading-[1.6] text-gray-400">초대 링크로 참여자를 모아보세요.</p>
            </div>
          )}
        </section>

        <div className="mt-auto pt-8">
          <button
            className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
            onClick={() => navigate(`/recommendation/${meetingId}`)}
          >
            추천 시간 확인하기
          </button>
        </div>
    </PageShell>
  );
}

export default TimeWaitingPage;
