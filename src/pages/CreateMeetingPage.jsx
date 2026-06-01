import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/meetingApi";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!meetingName) {
      alert("모임 이름을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("백엔드에 모임 생성 요청 중...", { meetingName, description });
      
      const data = await createMeeting(meetingName, description);
      
      const meetingId = data.id || data.meetingId || 1; 
      navigate(`/participate/${meetingId}`);
      
    } catch (error) {
      console.error("모임 생성 실패:", error);
      alert(error.message || "모임 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-page">
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

      <div className="login-container">
        <input
          type="text"
          className="meeting-input"
          placeholder="모임 이름 입력"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "모임 이름 입력")}
          disabled={isSubmitting}
        />
        <input
          type="text"
          className="description-input"
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "설명")}
          disabled={isSubmitting}
        />
        <button 
          className="create-button" 
          onClick={handleCreate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "생성 중..." : "생성하기"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
