import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails, getParticipants, getMyParticipant, leaveMeeting } from "../api/meetingApi";
import "./ParticipatePage.css";

function ParticipatePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "", description: "", inviteCode: "" });
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [meetingDetails, participantList, myInfo] = await Promise.all([
          getMeetingDetails(meetingId),
          getParticipants(meetingId),
          getMyParticipant(meetingId)
        ]);
        
        setMeetingData({ 
          title: meetingDetails.title, 
          description: meetingDetails.description,
          inviteCode: meetingDetails.inviteCode
        });
        setParticipants(participantList);
        setIsHost(myInfo.role === "HOST");
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

  const handleLeaveMeeting = async () => {
    if (window.confirm("정말 이 모임에서 나가시겠습니까?")) {
      try {
        await leaveMeeting(meetingId);
        alert("모임에서 탈퇴되었습니다.");
        navigate("/home");
      } catch (error) {
        alert(error.message || "모임 탈퇴에 실패했습니다.");
      }
    }
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
        <div className="sidebar-content" style={{ flex: 1, overflowY: "auto" }}>
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
        
        {!isLoading && !isHost && (
          <div className="leave-button-container">
            <button className="leave-btn" onClick={handleLeaveMeeting}>나가기</button>
          </div>
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
