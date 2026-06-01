import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomItem from "../components/RoomItem";
import "./GetRoomPage.css";

function GetRoomPage() {
  const navigate = useNavigate();
  // 사용자의 요청대로 초기 상태는 아무것도 없는 빈 배열
  const [rooms, setRooms] = useState([]); 

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="get-room-page">
      <div className="back-button-container" onClick={handleBack}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="get-room-container">
        <div className="section-title">내 방 목록</div>
        
        <div className="room-list">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomItem 
                key={room.id} 
                room={room} 
                onClick={() => navigate(`/participate/${room.id}`)} 
              />
            ))
          ) : (
            <div className="empty-rooms">
              아직 참여 중인 방이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetRoomPage;
