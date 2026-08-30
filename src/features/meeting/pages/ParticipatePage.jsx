import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../api/meetingApi";
import { getParticipants, getMyParticipant, leaveMeeting } from "../api/participantApi";

function ParticipatePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ name: "", description: "" });
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const navigateTimerRef = useRef(null);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        setNotice(null);
        const [details, participantList, myInfo] = await Promise.all([
          getMeetingDetails(meetingId),
          getParticipants(meetingId),
          getMyParticipant(meetingId)
        ]);

        setMeetingData({
          name: details.title || details.name || "",
          description: details.description || "",
        });
        setParticipants(participantList || []);
        setIsHost(myInfo.role === "HOST");
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setNotice({
          type: "error",
          message: error.message || "모임 정보를 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (meetingId) fetchMeetingData();
  }, [meetingId]);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current) {
        clearTimeout(navigateTimerRef.current);
      }
    };
  }, []);

  const handleLeaveMeeting = async () => {
    if (window.confirm("정말 이 모임에서 나가시겠습니까?")) {
      try {
        setIsLeaving(true);
        setNotice(null);
        await leaveMeeting(meetingId);
        setIsSidebarOpen(false);
        setNotice({ type: "success", message: "모임에서 탈퇴되었습니다. 내 방 목록으로 이동합니다." });
        navigateTimerRef.current = setTimeout(() => {
          navigate("/get-room", { replace: true });
        }, 1200);
      } catch (error) {
        setIsSidebarOpen(false);
        setNotice({
          type: "error",
          message: error.message || "모임 탈퇴에 실패했습니다.",
        });
        setIsLeaving(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#111]">
      <main className="relative flex min-h-screen w-[390px] flex-col overflow-hidden bg-white text-[#191f28]">

        {/* 사이드바 오버레이 */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-10 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 사이드바 */}
        <div
          className={`absolute left-0 top-0 z-20 h-full w-52 bg-white shadow-xl transition-transform duration-300 flex flex-col ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex-1 pt-16 px-5 overflow-y-auto">
            <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">참여자 목록</p>
            {isLoading ? (
              <p className="text-sm text-gray-400">로딩 중...</p>
            ) : participants.length > 0 ? (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div key={p.participantId} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                      {(p.userName || p.name)?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {p.role === "HOST" ? "👑 " : ""}{p.userName || p.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">참여자가 없습니다</p>
            )}
          </div>

          {!isLoading && !isHost && (
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={handleLeaveMeeting}
                disabled={isLeaving}
                className="w-full py-3 rounded-xl bg-red-50 text-sm font-extrabold text-red-500 transition active:scale-95 disabled:text-red-300"
              >
                {isLeaving ? "처리 중..." : "모임 나가기"}
              </button>
            </div>
          )}
        </div>

        {/* 상단 헤더 */}

        <div className="flex items-center justify-between px-6 pt-10 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 px-6 pb-10">
          <div className="mb-8">
            <p className="text-xs font-bold text-blue-500 mb-2">WHERE2MEET</p>
            <h1 className="text-2xl font-black text-gray-900">
              {isLoading ? "불러오는 중..." : meetingData.name || "모임"}
            </h1>
            {meetingData.description && (
              <p className="mt-2 text-sm text-gray-400">{meetingData.description}</p>
            )}
          </div>

          {notice && (
            <section className={`mb-6 rounded-[20px] px-5 py-[18px] ${
              notice.type === "success" ? "bg-blue-50" : "bg-red-50"
            }`}>
              <p className={`m-0 text-[13px] font-extrabold leading-[1.65] ${
                notice.type === "success" ? "text-blue-700" : "text-red-700"
              }`}>
                {notice.message}
              </p>
            </section>
          )}

          {/* 정보 카드 */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">참여자</p>
                <p className="text-sm font-bold text-gray-700">{participants.length}명</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">모임 ID: {meetingId}</p>
          </div>

          <button
            onClick={() => navigate(`/invite/${meetingId}`)}
            className="mb-3 h-12 w-full rounded-xl border-[1.5px] border-blue-100 bg-blue-50 text-sm font-bold text-blue-600 transition active:scale-95"
          >
            초대 링크 공유하기
          </button>

          <button
            onClick={() => navigate(`/time-selection/${meetingId}`)}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition active:scale-95"
          >
            다음 단계
          </button>
        </div>

      </main>
    </div>
  );
}

export default ParticipatePage;
