import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { confirmMeetingTime, getMeetingDetails } from "../../meeting/api/meetingApi";
import { getMyParticipant } from "../../meeting/api/participantApi";
import { getRecommendations } from "../api/recommendationApi";
import PageShell from "../../../shared/components/PageShell";

function RecommendationPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "" });
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [myRole, setMyRole] = useState("");
  const isHost = myRole === "HOST";

  const getDisplayErrorMessage = (error, fallbackMessage) => {
    if (error?.message === "Failed to fetch") {
      return "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.";
    }

    return error?.message || fallbackMessage;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [meetingDetails, recommendationData, myParticipant] = await Promise.all([
          getMeetingDetails(meetingId),
          getRecommendations(meetingId),
          getMyParticipant(meetingId),
        ]);
        
        setMeetingData({
          title: meetingDetails.title || meetingDetails.name || meetingDetails.meetingName || "",
          status: meetingDetails.status || "",
          confirmedStartDateTime: meetingDetails.confirmedStartDateTime || null,
          confirmedEndDateTime: meetingDetails.confirmedEndDateTime || null,
        });
        setRecommendations(recommendationData.recommendedSlots || recommendationData || []);
        setSelectedSlot(null);
        setMyRole(myParticipant.role || "");
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setErrorMessage(getDisplayErrorMessage(error, "추천 정보를 불러오는데 실패했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchData();
    }
  }, [meetingId]);

  useEffect(() => {
    if (!meetingId || isHost) return;

    const pollMeetingStatus = async () => {
      try {
        const meetingDetails = await getMeetingDetails(meetingId);
        setMeetingData((prev) => ({
          ...prev,
          title: meetingDetails.title || meetingDetails.name || meetingDetails.meetingName || prev.title,
          status: meetingDetails.status || "",
          confirmedStartDateTime: meetingDetails.confirmedStartDateTime || null,
          confirmedEndDateTime: meetingDetails.confirmedEndDateTime || null,
        }));
      } catch (error) {
        console.error("확정 상태 확인 실패:", error);
      }
    };

    const interval = setInterval(pollMeetingStatus, 3000);
    return () => clearInterval(interval);
  }, [meetingId, isHost]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${month}월 ${day}일 ${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
  };

  const getDurationHours = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e - s) / (1000 * 60 * 60);
    return Math.round(diff);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isTimeConfirmed =
    meetingData.status === "COLLECTING_LOCATION" ||
    Boolean(meetingData.confirmedStartDateTime);

  const handleConfirm = async () => {
    if (!selectedSlot) return;

    try {
      setIsConfirming(true);
      setErrorMessage("");
      await confirmMeetingTime(meetingId, selectedSlot);
      navigate(`/location/${meetingId}`);
    } catch (error) {
      setErrorMessage(getDisplayErrorMessage(error, "약속 시간 확정에 실패했습니다."));
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <PageShell className="flex flex-col overflow-y-auto px-6 py-10">
        <button
          onClick={handleBack}
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
            추천 약속 시간
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            참여자가 가장 많이 겹치는 시간순으로 보여드려요.
          </p>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-400">현재 모임</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              추천 결과
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
              {isLoading ? "모임 정보를 불러오는 중..." : meetingData.title || "모임"}
            </p>
          </div>
          <p className="m-0 mt-2 pl-5 text-[13px] leading-[1.6] text-gray-500">
            모임 ID: {meetingId}
          </p>
        </section>

        <section className="mb-7 flex-1">
          {isLoading ? (
            <div className="rounded-3xl bg-gray-50 px-5 py-10 text-center">
              <p className="m-0 text-sm font-extrabold text-gray-500">
                추천 시간을 계산 중입니다...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-[20px] bg-red-50 px-5 py-[18px]">
              <p className="mb-1.5 text-[13px] font-extrabold text-red-600">
                불러올 수 없습니다
              </p>
              <p className="m-0 text-[13px] leading-[1.65] text-red-700">
                {errorMessage}
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((slot, idx) => {
                const isSelected =
                  selectedSlot?.startDateTime === slot.startDateTime &&
                  selectedSlot?.endDateTime === slot.endDateTime;

                return (
                <button
                  key={`${slot.startDateTime}-${idx}`}
                  type="button"
                  onClick={() => {
                    if (isHost) setSelectedSlot(slot);
                  }}
                  disabled={!isHost}
                  className={`w-full rounded-3xl border-[1.5px] px-5 py-5 text-left shadow-sm transition active:scale-[0.98] ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 bg-white"
                  } ${!isHost ? "cursor-default" : ""}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                      isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      BEST {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-blue-600">
                          선택됨
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-400">
                        {getDurationHours(slot.startDateTime, slot.endDateTime)}시간
                      </span>
                    </div>
                  </div>

                  <p className="mb-2 text-[17px] font-extrabold text-[#191f28]">
                    {formatDateTime(slot.startDateTime)}
                  </p>
                  <div className="mb-4 h-px bg-gray-100" />
                  <p className="mb-2 text-[13px] font-bold text-gray-500">
                    <span className="text-[18px] font-extrabold text-blue-500">
                      {slot.availableCount}
                    </span>
                    명 가능
                  </p>
                  <p className="m-0 text-[13px] leading-[1.6] text-gray-400">
                    {(slot.participantNames || []).join(", ") || "참여자 정보가 없습니다."}
                  </p>
                </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border-[1.5px] border-dashed border-gray-200 bg-white px-5 py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-sm font-extrabold text-gray-600">
                아직 입력된 시간 데이터가 없습니다
              </p>
              <p className="mt-1 text-xs leading-[1.6] text-gray-400">
                가능한 시간을 먼저 선택해주세요.
              </p>
              <button
                className="mt-6 h-11 rounded-xl bg-blue-500 px-5 text-sm font-extrabold text-white transition active:scale-95"
                onClick={() => navigate(`/time-selection/${meetingId}`)}
              >
                내 시간 선택하러 가기
              </button>
            </div>
          )}
        </section>

        {!isLoading && !errorMessage && !isHost && recommendations.length > 0 && (
          <section className={`mb-7 rounded-[20px] px-5 py-[18px] ${
            isTimeConfirmed ? "bg-green-50" : "bg-blue-50"
          }`}>
            <p className={`mb-1.5 text-[13px] font-extrabold ${
              isTimeConfirmed ? "text-green-600" : "text-blue-600"
            }`}>
              {isTimeConfirmed ? "시간이 확정되었습니다" : "방장이 시간을 확정합니다"}
            </p>
            <p className={`m-0 text-[13px] leading-[1.65] ${
              isTimeConfirmed ? "text-green-700" : "text-blue-800"
            }`}>
              {isTimeConfirmed
                ? "출발 위치를 입력해주세요."
                : "확정이 완료되면 출발 위치를 입력할 수 있어요."}
            </p>
          </section>
        )}

        <div className="mt-auto pt-8">
          {isHost ? (
            <button
              className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-400"
              onClick={handleConfirm}
              disabled={!selectedSlot || isConfirming}
            >
              {isConfirming ? "확정 중..." : "확정하기"}
            </button>
          ) : (
            <button
              className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-400"
              onClick={() => navigate(`/location/${meetingId}`)}
              disabled={!isTimeConfirmed}
            >
              {isTimeConfirmed ? "출발 위치 입력하기" : "확정 대기 중"}
            </button>
          )}
        </div>
    </PageShell>
  );
}

export default RecommendationPage;
