import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingByInviteCode, joinMeeting } from "../api/meetingApi";
import "./AcceptInvitePage.css";

function AcceptInvitePage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [error, setError] = useState(null);

  // 1. 로그인 여부 판단을 최상단에서 수행
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "null" && token !== "undefined";

  useEffect(() => {
    if (!isAuthenticated) {
      // 목적지 주소를 명확하게 고정 (로그인 페이지가 저장되는 것 방지)
      const targetPath = `/invite/accept/${inviteCode}`;
      localStorage.setItem("returnUrl", targetPath);
      console.log("AcceptInvitePage: 목적지 저장됨 ->", targetPath);
      
      // 로그인 안 되어 있으면 초대 전용 로그인 페이지로 즉시 리다이렉트
      navigate(`/invite/login/${inviteCode}`, { replace: true });
      return;
    }

    // [추가] 로그인이 확인되어 성공적으로 페이지에 머물게 된 경우에만 returnUrl 삭제
    localStorage.removeItem("returnUrl");

    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetingByInviteCode(inviteCode);
        setMeetingData(data);
      } catch (err) {
        console.error("초대 정보 로드 실패:", err);
        setError("유효하지 않은 초대 코드이거나 정보를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (inviteCode) {
      fetchMeeting();
    }
  }, [inviteCode, navigate, isAuthenticated]);

  // 로그인하지 않은 경우 화면을 그리지 않음
  if (!isAuthenticated) return null;

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      const result = await joinMeeting(inviteCode);
      // 참여 성공 후 해당 모임 페이지로 이동
      navigate(`/participate/${result.meetingId}`);
    } catch (err) {
      console.error("참여 실패:", err);
      alert(err.message || "모임 참여 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    navigate("/");
  };

  if (error) {
    return (
      <div className="accept-invite-page">
        <div className="error-container">
          <p>{error}</p>
          <button className="home-btn" onClick={() => navigate("/")}>홈으로 가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invite-page">
      <div className="accept-container">
        {/*<div className="logo-box">where2Meet</div>*/}
        
        <div className="meeting-info-section">
          <div className="info-box main">
            {isLoading ? "로딩 중..." : meetingData?.title}
          </div>
          <div className="info-box small">
            {isLoading ? "..." : meetingData?.description}
          </div>
        </div>

        <div className="question-text">
          초대를 수락하시겠습니까?
        </div>

        <div className="action-buttons">
          <button className="accept-btn" onClick={handleAccept} disabled={isLoading}>
            수락하기
          </button>
          {/*<button className="decline-btn" onClick={handleDecline} disabled={isLoading}>
            거절하기
          </button>*/}
        </div>
      </div>
    </div>
  );
}

export default AcceptInvitePage;
