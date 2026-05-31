import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails, getRecommendations } from "../api/meetingApi";
import "./RecommendationPage.css";

function RecommendationPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "" });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [meetingDetails, recommendationData] = await Promise.all([
          getMeetingDetails(meetingId),
          getRecommendations(meetingId)
        ]);
        
        setMeetingData({ title: meetingDetails.title });
        setRecommendations(recommendationData.recommendedSlots);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("추천 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchData();
    }
  }, [meetingId]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${month}월 ${day}일 ${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="recommendation-page">
      <div className="back-button-container" onClick={handleBack}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="recommend-header">
        <div className="meeting-title-label">모임: {meetingData.title}</div>
        <div className="page-title">추천 약속 시간</div>
        <div className="page-desc">참여자가 가장 많이 겹치는 시간순입니다</div>
      </div>

      <div className="recommend-content">
        {isLoading ? (
          <div className="loading-state">추천 시간을 계산 중입니다...</div>
        ) : recommendations.length > 0 ? (
          <div className="recommendation-list">
            {recommendations.map((slot, idx) => (
              <div key={idx} className="recommend-card">
                <div className="rank-badge">BEST {idx + 1}</div>
                <div className="card-body">
                  <div className="time-info">
                    <div className="slot-date-time">{formatDateTime(slot.startDateTime)}</div>
                    <div className="slot-duration">30분간</div>
                  </div>
                  <div className="participation-info">
                    <div className="count-row">
                      <span className="count-highlight">{slot.availableCount}명</span> 가능
                    </div>
                    <div className="names-list">
                      {slot.participantNames.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>아직 입력된 시간 데이터가 없습니다.</p>
            <button className="go-select-btn" onClick={() => navigate(`/time-selection/${meetingId}`)}>
              내 시간 선택하러 가기
            </button>
          </div>
        )}
      </div>

      <div className="footer-actions">
        <button className="confirm-btn" onClick={() => navigate(`/participate/${meetingId}`)}>
          확인 완료
        </button>
      </div>
    </div>
  );
}

export default RecommendationPage;
