import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails, getParticipants } from "../api/meetingApi";
import "./ParticipatePage.css";

function ParticipatePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "", description: "", inviteCode: "" });
  const [participants, setParticipants] = useState([]);
  
  // 임시로 true로 설정 (추후 호스트 여부 판단 로직 연동 필요)
  const isHost = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [meetingDetails, participantList] = await Promise.all([
          getMeetingDetails(meetingId),
          getParticipants(meetingId)
        ]);
        
        setMeetingData({ 
          title: meetingDetails.title, 
          description: meetingDetails.description,
          inviteCode: meetingDetails.inviteCode
        });
        setParticipants(participantList);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert(error.message || "모임 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchData();
    }
  }, [meetingId]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="participate-page">
      {/* Sidebar Toggle Button (Triangle) */}
      <div className={`sidebar-toggle ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 17L15 12L10 7" stroke="#ccc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {isLoading ? (
          <div className="sidebar-item">로딩 중...</div>
        ) : (
          participants.map((p) => (
            <div key={p.participantId} className="sidebar-item">
              {p.role === "HOST" ? "👑 " : ""}{p.userName}
            </div>
          ))
        )}
      </div>

      <div className="back-button-container" onClick={handleBack}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19L8 12L15 5"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="content-container">
        <div className="info-box">
          {isLoading ? "정보를 불러오는 중..." : meetingData.title}
        </div>
        <div className="info-box small">
          {isLoading ? "..." : meetingData.description}
        </div>
        
        {!isLoading && isHost && (
          <button 
            className="invite-share-button" 
            onClick={() => navigate(`/invite/${meetingId}`)}
          >
            초대코드 공유하기
          </button>
        )}

        <button 
          className="recommend-view-button" 
          onClick={() => navigate(`/recommendation/${meetingId}`)}
        >
          추천 시간 확인하기
        </button>

        <button className="next-button" onClick={() => navigate(`/time-selection/${meetingId}`)}>
          내 시간 선택하기
        </button>
      </div>
    </div>
  );
}

export default ParticipatePage;
