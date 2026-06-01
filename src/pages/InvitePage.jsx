import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../api/meetingApi";
import "./InvitePage.css";

function InvitePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ name: "", inviteCode: "" });

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetingDetails(meetingId);
        setMeetingData({ 
          name: data.title || data.name || data.meetingName, 
          inviteCode: data.inviteCode 
        });
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("모임 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchMeetingData();
    }
  }, [meetingId]);

  const handleCopyCode = () => {
    if (meetingData.inviteCode) {
      navigator.clipboard.writeText(meetingData.inviteCode);
      alert("초대 코드가 복사되었습니다!");
    }
  };

  const handleCopyLink = () => {
    if (meetingData.inviteCode) {
      const inviteLink = `${window.location.origin}/invite/accept/${meetingData.inviteCode}`;
      navigator.clipboard.writeText(inviteLink);
      alert("초대 링크가 복사되었습니다!");
    }
  };

  const handleKakaoShare = () => {
    alert("카카오톡 공유 기능은 SDK 설정이 필요합니다.");
    // 실제 SDK 연동 시 여기에 로직 구현
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="invite-page">
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

      <div className="invite-container">
        <div className="info-box">
          {isLoading ? "로딩 중..." : meetingData.name}
        </div>

        <div className="invite-code-display">
          <div className="code-label">초대 코드</div>
          <div className="code-value" onClick={handleCopyCode} style={{ cursor: "pointer" }}>
            {isLoading ? "..." : meetingData.inviteCode}
          </div>
        </div>

        <div className="share-buttons-row">
          <div className="share-item">
            <div className="circle-btn kakao" onClick={handleKakaoShare}>카카오톡</div>
            <span>카카오톡</span>
          </div>
          <div className="share-item">
            <div className="circle-btn message">메시지</div>
            <span>메시지</span>
          </div>
          <div className="share-item">
            <div className="circle-btn link" onClick={handleCopyLink}>링크복사</div>
            <span>링크복사</span>
          </div>
        </div>

        <button className="done-button" onClick={handleBack}>
          완료
        </button>
      </div>
    </div>
  );
}

export default InvitePage;
