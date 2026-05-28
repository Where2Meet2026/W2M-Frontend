import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomItem from "../components/RoomItem";
import { getMyMeetings } from "../api/meetingApi";
import "./GetRoomPage.css";

function GetRoomPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const data = await getMyMeetings();
        // 백엔드에서 meetingId로 주므로 id로 매핑하거나 RoomItem에서 처리해야 함
        const formattedRooms = data.map(room => ({
          ...room,
          id: room.meetingId,
          name: room.title // RoomItem은 room.name을 사용하므로 매핑
        }));
        setRooms(formattedRooms);
      } catch (error) {
        console.error("내 방 목록 조회 실패:", error);
        alert(error.message || "목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
          {isLoading ? (
            <div className="empty-rooms">로딩 중...</div>
          ) : rooms.length > 0 ? (
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
