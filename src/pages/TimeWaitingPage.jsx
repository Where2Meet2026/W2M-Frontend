import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails, getParticipants } from "../api/meetingApi";
import "./TimeWaitingPage.css";

function TimeWaitingPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "" });
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [details, participantList] = await Promise.all([
          getMeetingDetails(meetingId),
          getParticipants(meetingId)
        ]);
        
        setMeetingData(details);
        setParticipants(participantList);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // 주기적으로 업데이트 (폴링) - 5초마다
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [meetingId]);

  return (
    <div className="time-waiting-page">
      <div className="back-button-container" onClick={() => navigate(-1)}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="waiting-header">
        <div className="meeting-title">{meetingData.title || "모임 이름"}</div>
        <div className="waiting-desc">모두가 입력을 완료할 때까지 기다려주세요</div>
      </div>

      <div className="participant-status-list">
        {isLoading && participants.length === 0 ? (
          <div className="loading-text">로딩 중...</div>
        ) : (
          participants.map((p) => (
            <div key={p.participantId} className="participant-status-item">
              <span className="participant-name">
                {p.role === "HOST" ? "👑 " : ""}{p.userName}
              </span>
              <span className={`status-badge ${p.isTimeSelected ? "complete" : "incomplete"}`}>
                {p.isTimeSelected ? "완료" : "미완료"}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="action-buttons">
        <button 
          className="check-recommendation-btn" 
          onClick={() => navigate(`/recommendation/${meetingId}`)}
        >
          추천 시간 확인하기
        </button>
      </div>
    </div>
  );
}

export default TimeWaitingPage;
