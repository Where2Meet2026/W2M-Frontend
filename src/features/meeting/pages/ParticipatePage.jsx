import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../api/meetingApi";
import { getParticipants, getMyParticipant, leaveMeeting } from "../api/participantApi";
import PageShell from "../../../shared/components/PageShell";
import Toast from "../../../shared/components/Toast";
import { useToast } from "../../../shared/hooks/useToast";
import BackButton from "../../../shared/components/BackButton";
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
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ name: "", description: "" });
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { toast, showToast, closeToast } = useToast();
  const navigateTimerRef = useRef(null);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
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
        setLoadError(error.message || "모임 정보를 불러오지 못했어요.");
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

  // 화면 맨 아래 "모임 나가기" → 확인 시트를 먼저 띄우고, 시트에서 "나가기"를 눌렀을 때 실제로 나간다
  const handleLeaveMeeting = async () => {
    try {
      setIsLeaving(true);
      await leaveMeeting(meetingId);
      setIsLeaveConfirmOpen(false);
      showToast("모임에서 나갔어요. 목록으로 돌아가요.");
      navigateTimerRef.current = setTimeout(() => {
        navigate("/get-room", { replace: true });
      }, 1200);
    } catch (error) {
      // 장소 추천이 시작된 모임이면 서버가 409로 막고, 그 안내 문구를 그대로 보여준다
      setIsLeaveConfirmOpen(false);
      showToast(error.message || "모임에서 나가지 못했어요.", "error");
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
      showToast("카카오톡 공유에 실패했어요.", "error");
    } finally {
      setIsShareOpen(false);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast("초대 링크를 복사했어요.");
    } catch (error) {
      console.error("초대 링크 복사 실패:", error);
      showToast("링크를 복사하지 못했어요.", "error");
    } finally {
      setIsShareOpen(false);
    }
  };

  return (
    <PageShell className="flex flex-col">

        {/* 상단 헤더 (참여자 목록은 본문에 바로 보여주므로 메뉴 버튼은 없다) */}
        <div className="px-6 pt-10 pb-6">
          <BackButton />
        </div>

        {/* 본문 */}
        <div className="flex-1 px-6 pb-10">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">
              {isLoading ? "불러오는 중..." : meetingData.name || "모임"}
            </h1>
            {meetingData.description && (
              <p className="mt-2 text-sm text-gray-400">{meetingData.description}</p>
            )}
          </div>

          {loadError && (
            <section className="mb-6 rounded-[20px] bg-red-50 px-5 py-[18px]">
              <p className="m-0 text-[13px] font-extrabold leading-[1.65] text-red-700">{loadError}</p>
            </section>
          )}

          {/* 참여자 목록: 누가 들어왔는지 메뉴를 열지 않고 바로 확인한다 */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="m-0 text-[13px] font-bold text-gray-700">참여자</p>
              <span className="text-[13px] font-extrabold text-gray-400">{participants.length}명</span>
            </div>
            {isLoading && participants.length === 0 ? (
              <p className="m-0 text-sm text-gray-400">불러오는 중...</p>
            ) : participants.length > 0 ? (
              <ul className="m-0 list-none space-y-2 p-0">
                {participants.map((p) => {
                  const name = p.userName || p.name || "참여자";
                  return (
                    <li
                      key={p.participantId}
                      className="flex items-center gap-3 rounded-2xl border-[1.5px] border-gray-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-600">
                        {name[0]}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#191f28]">{name}</span>
                      {p.role === "HOST" && (
                        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-600">
                          방장
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="m-0 text-sm text-gray-400">아직 참여자가 없어요</p>
            )}
          </section>

          {/* 예전에는 초대 페이지(/invite/:meetingId)로 이동했는데, 이제 이 화면에서 바로 공유 시트를 띄운다 */}
          <button
            onClick={() => setIsShareOpen(true)}
            disabled={isLoading || !meetingData.inviteCode}
            className="mb-3 h-12 w-full rounded-2xl border-[1.5px] border-blue-100 bg-blue-50 text-sm font-bold text-blue-600 transition active:scale-95 disabled:opacity-50"
          >
            초대 링크 공유하기
          </button>

          <button
            onClick={() => navigate(getNextStepPath(meetingData.status, meetingId))}
            className="w-full h-[54px] bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-2xl transition active:scale-95"
          >
            다음 단계
          </button>

          {/* 방장은 나갈 수 없고(모임 삭제를 쓴다), 참여자에게만 보인다. 일부러 눈에 덜 띄게 둔다 */}
          {!isLoading && !isHost && !loadError && (
            <button
              type="button"
              onClick={() => setIsLeaveConfirmOpen(true)}
              disabled={isLeaving}
              className="mt-5 w-full py-2 text-center text-[13px] font-bold text-gray-400 transition hover:text-gray-500 active:scale-95 disabled:opacity-50"
            >
              {isLeaving ? "처리 중..." : "모임 나가기"}
            </button>
          )}
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

        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={closeToast} />}

    </PageShell>
  );
}

export default ParticipatePage;
