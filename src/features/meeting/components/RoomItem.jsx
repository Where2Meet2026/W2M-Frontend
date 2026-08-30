import { deleteMeeting } from "../api/meetingApi";

function RoomItem({ room, onClick, onRefresh, onNotice }) {
  const isHost = room.role === "HOST";

  const handleDelete = async (e) => {
    e.stopPropagation(); // 부모의 onClick 이벤트 방지
    if (window.confirm(`"${room.name}" 방을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없으며 모든 참여자의 목록에서도 삭제됩니다.`)) {
      try {
        await deleteMeeting(room.id);
        if (onRefresh) await onRefresh();
        if (onNotice) {
          onNotice({ type: "success", message: "방이 삭제되었습니다." });
        }
      } catch (error) {
        if (onNotice) {
          onNotice({
            type: "error",
            message: error.message || "방 삭제에 실패했습니다.",
          });
        }
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex min-h-[78px] w-full cursor-pointer items-center justify-between gap-3 rounded-3xl border-[1.5px] border-gray-100 bg-white px-5 py-4 text-left shadow-sm transition active:scale-[0.98]"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
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
        <p className="m-0 truncate text-[13px] font-medium text-gray-400">
          {room.description || "모임 설명이 없습니다."}
        </p>
      </div>
      
      <div className="flex shrink-0 items-center gap-2">
        {isHost && (
          <button
            type="button"
            className="rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-extrabold text-red-500"
            onClick={handleDelete}
          >
            방 삭제
          </button>
        )}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5L16 12L9 19" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default RoomItem;
