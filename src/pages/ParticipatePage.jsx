import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../api/meetingApi";
import "./ParticipatePage.css";

function ParticipatePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ name: "", description: "" });
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetingDetails(meetingId);
        
        setMeetingData({ 
          name: data.title || data.name || data.meetingName, 
          description: data.description 
        });
        setParticipants(data.participants || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert(error.message || "모임 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchMeetingData();
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
            <div key={p.id} className="sidebar-item">
              {p.role === "admin" ? "👑 " : ""}{p.name}
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
          {isLoading ? "정보를 불러오는 중..." : meetingData.name}
        </div>
        <div className="info-box small">
          {isLoading ? "..." : meetingData.description}
        </div>
        <button className="next-button" onClick={() => navigate(`/time-selection/${meetingId}`)}>
          다음 단계
        </button>
      </div>
    </div>
  );
}

export default ParticipatePage;
