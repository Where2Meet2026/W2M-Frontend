import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = () => {
    console.log(formData);

    // 나중에 회원가입 API 연결
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-title">
          회원가입
        </div>

        <div className="signup-subtitle">
          회원 정보를 입력해주세요
        </div>

        {/* 이메일 */}
        <div className="input-group">
          <label>이메일</label>

          <input
            type="email"
            name="email"
            placeholder="이메일 입력"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 */}
        <div className="input-group">
          <label>비밀번호</label>

          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <label>비밀번호 확인</label>

          <input
            type="password"
            name="passwordCheck"
            placeholder="비밀번호 다시 입력"
            value={formData.passwordCheck}
            onChange={handleChange}
          />
        </div>

        {/* 이름 */}
        <div className="input-group">
          <label>이름</label>

          <input
            type="text"
            name="name"
            placeholder="이름 입력"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* 전화번호 */}
        <div className="input-group">
          <label>전화번호</label>

          <input
            type="text"
            name="phoneNumber"
            placeholder="전화번호 입력"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* 버튼 */}
        <div className="button-group">

          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            뒤로가기
          </button>

          <button
            className="signup-button-main"
            onClick={handleSignup}
          >
            가입하기
          </button>

        </div>

      </div>
    </div>
  );
}

export default SignupPage;