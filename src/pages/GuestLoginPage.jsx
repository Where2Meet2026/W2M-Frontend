import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../api/authApi";
import "./GuestLoginPage.css";

function GuestLoginPage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이미 로그인이 되어 있다면 바로 초대 수락 페이지로 리다이렉트
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      const returnUrl = localStorage.getItem("returnUrl") || `/invite/accept/${inviteCode}`;
      navigate(returnUrl, { replace: true });
    }
    
    // 목적지 정보 안전장치
    if (inviteCode && !localStorage.getItem("returnUrl")) {
      localStorage.setItem("returnUrl", `/invite/accept/${inviteCode}`);
    }
  }, [inviteCode, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await login(email, password);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      alert("로그인 성공!");
      
      const returnUrl = localStorage.getItem("returnUrl") || `/invite/accept/${inviteCode}`;
      // 여기서 바로 지우지 않음 (AcceptInvitePage에서 지움)
      navigate(returnUrl);
      
    } catch (error) {
      console.error("로그인 에러:", error);
      alert(error.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 시에도 returnUrl 확인 및 보강
    if (!localStorage.getItem("returnUrl")) {
      localStorage.setItem("returnUrl", `/invite/accept/${inviteCode}`);
    }
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="guest-login-page">
      <div className="guest-login-container">
        <div className="logo-box">where2Meet</div>
        
        <div className="welcome-section">
          <p className="welcome-text">모임에 참여하기 위해</p>
          <p className="welcome-text bold">로그인이 필요합니다</p>
        </div>

        <div className="action-buttons">
          <div className="login-form">
            <input
              className="guest-login-input"
              type="text"
              placeholder="아이디"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              className="guest-login-input"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button 
              className="guest-main-button" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>

          <div className="divider"> 또는 </div>

          <button className="kakao-btn" onClick={handleKakaoLogin}>
            카카오로 시작하기
          </button>
          
          <button className="signup-link-btn" onClick={() => navigate("/signup")}>
            아직 회원이 아니신가요? 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuestLoginPage;
