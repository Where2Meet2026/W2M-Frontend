import { deleteMeeting } from "../api/meetingApi";
import { leaveMeeting } from "../api/participantApi";
import { EditIcon } from "../../../shared/components/Icons";

// onAskConfirm: 확인 시트를 띄워 달라고 목록 화면(GetRoomPage)에 요청한다.
// 카드마다 시트를 두면 모임 수만큼 시트가 생겨서, 시트는 목록 화면에 하나만 두고 내용만 넘긴다.
function RoomItem({ room, onClick, onReview, onRefresh, onNotice, onAskConfirm }) {
  const isHost = room.role === "HOST";

  const handleDelete = (e) => {
    e.stopPropagation(); // 부모의 onClick 이벤트 방지
    onAskConfirm({
      title: "모임을 삭제할까요?",
      description: `"${room.name}" 모임을 삭제하면 복구할 수 없고,\n모든 참여자의 목록에서도 사라져요.`,
      confirmLabel: "삭제하기",
      action: async () => {
        try {
          await deleteMeeting(room.id);
          if (onRefresh) await onRefresh();
          if (onNotice) {
            onNotice({ type: "success", message: "모임을 삭제했어요." });
          }
        } catch (error) {
          if (onNotice) {
            onNotice({
              type: "error",
              message: error.message || "모임을 삭제하지 못했어요.",
            });
          }
        }
      },
    });
  };

  // 참여자의 모임 나가기. 서버가 내려주는 canLeave가 true일 때만 버튼이 보인다
  // (참여자이고, 아직 장소 추천(후보)이 시작되지 않은 모임)
  const handleLeave = (e) => {
    e.stopPropagation(); // 부모의 onClick 이벤트 방지
    onAskConfirm({
      title: "모임에서 나갈까요?",
      description: `"${room.name}" 모임에서 나가면\n입력한 가능 시간과 출발 위치도 함께 삭제돼요.`,
      confirmLabel: "나가기",
      action: async () => {
        try {
          await leaveMeeting(room.id);
          if (onRefresh) await onRefresh();
          if (onNotice) {
            onNotice({ type: "success", message: "모임에서 나갔어요." });
          }
        } catch (error) {
          // 목록을 연 뒤에 장소 추천이 시작됐다면 서버가 409로 막는다 → 그 안내 문구를 그대로 보여준다
          if (onNotice) {
            onNotice({
              type: "error",
              message: error.message || "모임에서 나가지 못했어요.",
            });
          }
        }
      },
    });
  };

  // reviewable: 장소가 확정되고 약속 시간이 지났으며 아직 리뷰를 쓰지 않은 방 (2주가 지나도 유지)
  const reviewable = Boolean(room.reviewable);

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex min-h-[78px] w-full cursor-pointer flex-col gap-3 rounded-3xl border-[1.5px] border-gray-100 bg-white px-5 py-4 text-left shadow-sm transition active:scale-[0.98]"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="flex w-full items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          {isHost && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-600">
              방장
            </span>
          )}
          <p className="m-0 truncate text-[16px] font-extrabold text-[#191f28]">
            {room.name}
          </p>
        </div>
        {room.description && (
          <p className="m-0 truncate text-[13px] font-medium text-gray-400">
            {room.description}
          </p>
        )}
      </div>
      
      <div className="flex shrink-0 items-center gap-2">
        {isHost && (
          <button
            type="button"
            className="rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-extrabold text-red-500"
            onClick={handleDelete}
          >
            모임 삭제
          </button>
        )}
        {room.canLeave && (
          <button
            type="button"
            className="rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-extrabold text-gray-500"
            onClick={handleLeave}
          >
            나가기
          </button>
        )}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5L16 12L9 19" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      </div>

      {reviewable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReview?.(room);
          }}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[#eff6ff] text-[13px] font-bold text-[#155dfc]"
        >
          <EditIcon />
          리뷰 쓰기
        </button>
      )}
    </div>
  );
}

export default RoomItem;
