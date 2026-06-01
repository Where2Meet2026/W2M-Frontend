import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signup, socialSignup, sendCode, verifyCode } from "../api/authApi";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const socialData = location.state || {};
  const isSocial = socialData.isSocial;

  const [formData, setFormData] = useState({
    email: socialData.email || "",
    verificationCode: "",
    password: "",
    passwordCheck: "",
    name: socialData.name || "",
    phoneNumber: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(isSocial); // 소셜은 이미 인증된 것으로 간주
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    try {
      setIsLoading(true);
      await sendCode(formData.email);
      alert("인증코드를 발송했습니다.");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      alert("인증코드를 입력해주세요.");
      return;
    }
    try {
      setIsLoading(true);
      await verifyCode(formData.email, formData.verificationCode);
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!isSocial && formData.password !== formData.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("회원가입 시도 중...", formData);
      
      let response;
      if (isSocial) {
        response = await socialSignup({
          email: formData.email,
          name: formData.name,
          phoneNumber: formData.phoneNumber
        });
        // 소셜 가입 시 백엔드에서 토큰을 주므로 바로 저장 (자동 로그인)
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber
        });
      }
      
      alert("회원가입이 완료되었습니다!");
      
      // 저장된 돌아갈 주소가 있다면 그곳으로, 없으면 홈/메인으로
      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl) {
        // 소셜 가입은 바로 이동 가능 (이미 로그인됨)
        // 일반 가입은 로그인이 필요하므로 메인(/)으로 가되 returnUrl은 유지
        if (isSocial) {
          localStorage.removeItem("returnUrl");
          navigate(returnUrl);
        } else {
          navigate("/");
        }
      } else {
        navigate(isSocial ? "/home" : "/");
      }
      
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-title">회원가입</div>
        <div className="signup-subtitle">
          {isSocial ? "소셜 계정 추가 정보를 입력해주세요" : "회원 정보를 입력해주세요"}
        </div>
        
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
              readOnly={isSocial}
            />
            {!isSocial && (
              <button
                type="button"
                className="email-verify-button"
                onClick={handleSendCode}
              >
                인증 발송
              </button>
            )}
          </div>
        </div>

        {!isSocial && (
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
        )}

        {!isSocial && (
          <>
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
          </>
        )}

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