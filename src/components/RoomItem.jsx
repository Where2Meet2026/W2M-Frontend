import { deleteMeeting } from "../api/meetingApi";
import "./RoomItem.css";

function RoomItem({ room, onClick, onRefresh }) {
  const isHost = room.role === "HOST";

  const handleDelete = async (e) => {
    e.stopPropagation(); // 부모의 onClick 이벤트 방지
    if (window.confirm(`"${room.name}" 방을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없으며 모든 참여자의 목록에서도 삭제됩니다.`)) {
      try {
        await deleteMeeting(room.id);
        alert("방이 삭제되었습니다.");
        if (onRefresh) onRefresh();
      } catch (error) {
        alert(error.message || "방 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="room-item" onClick={onClick}>
      <div className="room-info">
        <div className="room-name">
          {isHost && <span className="host-badge">👑</span>} {room.name}
        </div>
        <div className="room-desc">{room.description}</div>
      </div>
      
      <div className="room-actions">
        {isHost && (
          <button className="delete-room-btn" onClick={handleDelete}>
            방 삭제
          </button>
        )}
        <div className="arrow-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 5L16 12L9 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default RoomItem;
