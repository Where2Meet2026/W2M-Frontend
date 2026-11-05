import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../api/meetingApi";
import { getParticipants, getMyParticipant, leaveMeeting } from "../api/participantApi";
import PageShell from "../../../shared/components/PageShell";
import ConfirmSheet from "../../../shared/components/ConfirmSheet";
import ShareBottomSheet from "../../../shared/components/ShareBottomSheet";
import { shareToKakao } from "../../../shared/lib/kakaoShare";

// 모임 진행 상태에 따라 "다음 단계"로 이동할 화면을 정한다.
//  - WAITING_PARTICIPANTS(모임 생성): 가능한 시간 입력
//  - COLLECTING_LOCATION(시간 확정): 출발 위치 입력
//  - CONFIRMED(투표로 장소 확정): 최종 결과
const getNextStepPath = (status, meetingId) => {
  switch (status) {
    case "COLLECTING_LOCATION":
      return `/location/${meetingId}`;
    case "CONFIRMED":
      return `/result/${meetingId}`;
    default:
      return `/time-selection/${meetingId}`;
  }
};

function ParticipatePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ name: "", description: "" });
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
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
          status: details.status || "",
          inviteCode: details.inviteCode || "",
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

  // 사이드바의 "모임 나가기" → 확인 시트를 먼저 띄우고, 시트에서 "나가기"를 눌렀을 때 실제로 나간다
  const handleLeaveMeeting = async () => {
    try {
      setIsLeaving(true);
      setNotice(null);
      await leaveMeeting(meetingId);
      setIsLeaveConfirmOpen(false);
      setIsSidebarOpen(false);
      setNotice({ type: "success", message: "모임에서 나갔어요. 목록으로 돌아가요." });
      navigateTimerRef.current = setTimeout(() => {
        navigate("/get-room", { replace: true });
      }, 1200);
    } catch (error) {
      // 장소 추천이 시작된 모임이면 서버가 409로 막고, 그 안내 문구를 그대로 보여준다
      setIsLeaveConfirmOpen(false);
      setIsSidebarOpen(false);
      setNotice({
        type: "error",
        message: error.message || "모임에서 나가지 못했어요.",
      });
      setIsLeaving(false);
    }
  };

  // 초대 링크: 받은 사람이 누르면 로그인 후 바로 참여 화면으로 간다 (AcceptInvitePage)
  const inviteLink = `${window.location.origin}/invite/accept/${meetingData.inviteCode}`;

  const handleKakaoInvite = () => {
    try {
      shareToKakao({
        title: `${meetingData.name || "모임"}에 초대합니다`,
        description: "Where2Meet에서 시간과 장소를 함께 정해요",
        link: inviteLink,
        buttonTitle: "모임 참여하기",
      });
    } catch (error) {
      console.error("카카오톡 초대 공유 실패:", error);
      setNotice({ type: "error", message: "카카오톡 공유에 실패했어요." });
    } finally {
      setIsShareOpen(false);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setNotice({ type: "success", message: "초대 링크가 복사되었습니다." });
    } catch (error) {
      console.error("초대 링크 복사 실패:", error);
      setNotice({ type: "error", message: "링크를 복사하지 못했어요." });
    } finally {
      setIsShareOpen(false);
    }
  };

  return (
    <PageShell className="relative flex flex-col overflow-hidden">

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
                onClick={() => setIsLeaveConfirmOpen(true)}
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
            <div className="flex items-center gap-3">
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
          </div>

          {/* 예전에는 초대 페이지(/invite/:meetingId)로 이동했는데, 이제 이 화면에서 바로 공유 시트를 띄운다 */}
          <button
            onClick={() => setIsShareOpen(true)}
            disabled={isLoading || !meetingData.inviteCode}
            className="mb-3 h-12 w-full rounded-xl border-[1.5px] border-blue-100 bg-blue-50 text-sm font-bold text-blue-600 transition active:scale-95 disabled:opacity-50"
          >
            초대 링크 공유하기
          </button>

          <button
            onClick={() => navigate(getNextStepPath(meetingData.status, meetingId))}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition active:scale-95"
          >
            다음 단계
          </button>
        </div>

        <ShareBottomSheet
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          title="모임 초대하기"
          previewTitle={meetingData.name || "모임"}
          previewDescription="링크를 받은 사람은 로그인 후 바로 참여할 수 있어요"
          onKakaoShare={handleKakaoInvite}
          onCopyLink={handleCopyInvite}
        />

        <ConfirmSheet
          isOpen={isLeaveConfirmOpen}
          onClose={() => setIsLeaveConfirmOpen(false)}
          onConfirm={handleLeaveMeeting}
          title="모임에서 나갈까요?"
          description={"나가면 입력한 가능 시간과 출발 위치도 함께 삭제돼요."}
          confirmLabel="나가기"
          danger
          isPending={isLeaving}
        />

    </PageShell>
  );
}

export default ParticipatePage;
