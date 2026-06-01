import "./RoomItem.css";

function RoomItem({ room, onClick }) {
  return (
    <div className="room-item" onClick={onClick}>
      <div className="room-info">
        <div className="room-name">{room.name}</div>
        <div className="room-desc">{room.description}</div>
      </div>
      <div className="arrow-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 5L16 12L9 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default RoomItem;
