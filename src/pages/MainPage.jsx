import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("로그인 시도 중...", { email, password });
      
      const data = await login(email, password);
      
      // 토큰 처리 (필요시)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      alert("로그인 성공!");
      
      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl) {
        // [수정] 여기서 지우지 않고 이동만 함
        navigate(returnUrl);
      } else {
        navigate("/home");
      }
      
    } catch (error) {
      console.error("로그인 에러:", error);
      alert(error.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-page">
      <div className="main-card">

        <div className="logo-box">
          where2Meet
        </div>

        <input
          className="login-input"
          type="text"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button 
          className="main-button"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        <button
          className="kakao-button"
          onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/kakao"}
        >
          카카오로 시작하기
        </button>

        <button
          className="signup-button"
          onClick={() => navigate("/signup")}
        >
          회원가입
        </button>

      </div>
    </div>
  );
}

export default MainPage;