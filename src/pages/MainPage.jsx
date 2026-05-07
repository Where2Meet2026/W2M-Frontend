import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(email, password);

    // 나중에 로그인 API 연결
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
        />

        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          className="main-button"
          onClick={() => navigate("/login")}
        >
          로그인
        </button>

        <button
          className="kakao-button"
          onClick={() => console.log("카카오 로그인")}
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