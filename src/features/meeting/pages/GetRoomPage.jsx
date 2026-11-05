import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomItem from "../components/RoomItem";
import { getMyMeetings } from "../api/meetingApi";
import { canWriteReview } from "../../review/utils/reviewWindow";
import PageShell from "../../../shared/components/PageShell";
import Toast from "../../../shared/components/Toast";
import { useToast } from "../../../shared/hooks/useToast";
import BackButton from "../../../shared/components/BackButton";
import ConfirmSheet from "../../../shared/components/ConfirmSheet";

function GetRoomPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { toast, showToast, closeToast } = useToast();

  // 방 삭제·나가기 확인 시트. 카드(RoomItem)가 { title, description, confirmLabel, action }을 넘기면 띄운다.
  // 닫히는 동안에도 내용이 보여야 해서(내려가는 애니메이션) 내용과 열림 여부를 따로 둔다.
  const [confirmRequest, setConfirmRequest] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const askConfirm = (request) => {
    setConfirmRequest(request);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (!isConfirming) setIsConfirmOpen(false);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await confirmRequest.action();
    } finally {
      setIsConfirming(false);
      setIsConfirmOpen(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setLoadError("");
      const data = await getMyMeetings();
      // 백엔드 필드명을 RoomItem에서 사용하는 필드명으로 매핑
      const formattedRooms = data.map(room => ({
        ...room,
        id: room.meetingId,
        reviewable: canWriteReview(room),
        name: room.title
      }));
      setRooms(formattedRooms);
    } catch (error) {
      console.error("내 방 목록 조회 실패:", error);
      setLoadError(error.message || "목록을 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <PageShell className="flex flex-col overflow-y-auto px-6 py-10">

        {/* 뒤로가기 */}
        <BackButton className="mb-10" />

        <section className="mb-10">
          <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px] text-[#191f28]">
            내 모임
            {!isLoading && <span className="ml-2 text-[22px] text-blue-500">{rooms.length}</span>}
          </h1>
          <p className="mt-2.5 text-sm leading-[1.7] text-gray-500">참여 중인 모임을 확인하세요.</p>
        </section>

        {loadError && (
          <section className="mb-7 rounded-[20px] bg-red-50 px-5 py-[18px]">
            <p className="m-0 text-[13px] font-extrabold leading-[1.65] text-red-700">{loadError}</p>
          </section>
        )}

                {/* 방 목록 */}
        {isLoading ? (
          <section className="mb-7 text-center py-10">
            <p className="text-sm text-gray-400">목록을 불러오고 있어요...</p>
          </section>
        ) : rooms.length > 0 ? (
          <section className="mb-7 space-y-3">
            {rooms.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                onClick={() => navigate(`/participate/${room.id}`)}
                onReview={() => navigate(`/review/${room.id}/write`)}
                onRefresh={fetchRooms}
                onNotice={({ type, message }) => showToast(message, type)}
                onAskConfirm={askConfirm}
              />
            ))}
          </section>
        ) : (
          <section className="mb-7 rounded-3xl border-[1.5px] border-dashed border-gray-200 bg-white px-5 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <p className="text-sm font-extrabold text-gray-600">아직 참여 중인 모임이 없어요</p>
            <p className="mt-1 text-xs leading-[1.6] text-gray-400">새로운 모임을 만들거나 초대 링크로 참여해보세요.</p>
          </section>
        )}

        <div className="mt-auto pt-8">
          <button
            onClick={() => navigate("/create-meeting")}
            className="h-[54px] w-full rounded-2xl bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
          >
            모임 만들기
          </button>
        </div>

        <ConfirmSheet
          isOpen={isConfirmOpen}
          onClose={closeConfirm}
          onConfirm={handleConfirm}
          title={confirmRequest?.title}
          description={confirmRequest?.description}
          confirmLabel={confirmRequest?.confirmLabel}
          danger
          isPending={isConfirming}
        />

        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={closeToast} />}

    </PageShell>
  );
}

export default GetRoomPage;
