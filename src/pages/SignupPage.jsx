import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    passwordCheck: "",
    name: "",
    phoneNumber: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendCode = () => {
    console.log("인증코드 발송:", formData.email);
    alert("인증코드를 발송했습니다.");
  };

  const handleVerifyCode = () => {
    console.log("인증 확인:", formData.email, formData.verificationCode);
    setIsEmailVerified(true);
    alert("이메일 인증이 완료되었습니다.");
  };

  const handleSignup = () => {
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    console.log(formData);
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-title">회원가입</div>
        <div className="signup-subtitle">회원 정보를 입력해주세요</div>
        
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
        <div className="input-group">
          <label>이메일</label>
          <div className="email-verify-row">
            <input
              type="email"
              name="email"
              placeholder="이메일 입력"
              value={formData.email}
              onChange={handleChange}
            />
            <button
              type="button"
              className="email-verify-button"
              onClick={handleSendCode}
            >
              인증 발송
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>인증코드</label>
          <div className="email-verify-row">
            <input
              type="text"
              name="verificationCode"
              placeholder="인증코드 입력"
              value={formData.verificationCode}
              onChange={handleChange}
            />
            <button
              type="button"
              className="email-verify-button"
              onClick={handleVerifyCode}
            >
              인증 확인
            </button>
          </div>

          {isEmailVerified && (
            <div className="email-verify-success">이메일 인증 완료</div>
          )}
        </div>

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

        <div className="input-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="passwordCheck"
            placeholder="비밀번호 확인"
            value={formData.passwordCheck}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button className="back-button" onClick={() => navigate("/")}>
            뒤로가기
          </button>

          <button className="signup-button-main" onClick={handleSignup}>
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;