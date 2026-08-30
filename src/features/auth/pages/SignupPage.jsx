import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, sendCode, verifyCode } from "../api/authApi";
import PageShell from "../../../shared/components/PageShell";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", verificationCode: "", password: "", passwordCheck: "", name: "", phoneNumber: "",
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const navigateTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current) {
        clearTimeout(navigateTimerRef.current);
      }
    };
  }, []);

  const showNotice = (type, message) => {
    setNotice({ type, message });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (name === "email") {
      setIsEmailVerified(false);
    }
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      showNotice("error", "이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setNotice(null);
      await sendCode(formData.email);
      showNotice("success", "인증코드를 발송했습니다.");
    } catch (error) {
      showNotice("error", error.message || "인증코드 발송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      showNotice("error", "인증코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setNotice(null);
      await verifyCode(formData.email, formData.verificationCode);
      setIsEmailVerified(true);
      showNotice("success", "이메일 인증이 완료되었습니다.");
    } catch (error) {
      showNotice("error", error.message || "이메일 인증에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isEmailVerified) {
      showNotice("error", "이메일 인증을 완료해주세요.");
      return;
    }

    if (formData.password !== formData.passwordCheck) {
      showNotice("error", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);
      setNotice(null);
      await signup({ email: formData.email, password: formData.password, name: formData.name, phoneNumber: formData.phoneNumber });
      showNotice("success", "회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
      navigateTimerRef.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (error) {
      showNotice("error", error.message || "회원가입 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const inputClass = "w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 transition";

  return (
    <PageShell className="overflow-y-auto px-6 py-10">
        <div className="w-full">

        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">회원가입</h1>
          <p className="mt-1 text-sm text-gray-400">회원 정보를 입력해주세요</p>
        </div>

        {notice && (
          <div className={`mb-6 rounded-2xl px-4 py-3 ${
            notice.type === "success" ? "bg-blue-50" : "bg-red-50"
          }`}>
            <p className={`m-0 text-[13px] font-bold leading-[1.6] ${
              notice.type === "success" ? "text-blue-700" : "text-red-700"
            }`}>
              {notice.message}
            </p>
          </div>
        )}

        <div className="space-y-5">

          {/* 이름 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">이름</label>
            <input type="text" name="name" placeholder="이름 입력" value={formData.name} onChange={handleChange} className={inputClass} />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">전화번호</label>
            <input type="text" name="phoneNumber" placeholder="전화번호 입력" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">이메일</label>
            <div className="flex gap-2">
              <input type="email" name="email" placeholder="이메일 입력" value={formData.email} onChange={handleChange} className={inputClass} />
              <button onClick={handleSendCode} disabled={isLoading} className="shrink-0 h-11 px-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition active:scale-95 disabled:bg-gray-200 disabled:text-gray-400">
                인증 발송
              </button>
            </div>
          </div>

          {/* 인증코드 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">인증코드</label>
            <div className="flex gap-2">
              <input type="text" name="verificationCode" placeholder="인증코드 입력" value={formData.verificationCode} onChange={handleChange} className={inputClass} />
              <button onClick={handleVerifyCode} disabled={isLoading} className="shrink-0 h-11 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition active:scale-95 disabled:bg-gray-100 disabled:text-gray-400">
                인증 확인
              </button>
            </div>
            {isEmailVerified && (
              <p className="mt-2 text-xs font-bold text-green-500">✓ 이메일 인증 완료</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호 입력" value={formData.password} onChange={handleChange} className={inputClass} />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">비밀번호 확인</label>
            <input type="password" name="passwordCheck" placeholder="비밀번호 확인" value={formData.passwordCheck} onChange={handleChange} className={inputClass} />
          </div>

        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-8">
          <button onClick={() => navigate("/")} className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-xl transition active:scale-95">
            뒤로가기
          </button>
          <button onClick={handleSignup} disabled={isLoading} className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition active:scale-95 disabled:bg-gray-200 disabled:text-gray-400">
            {isLoading ? "처리 중..." : "가입하기"}
          </button>
        </div>

        </div>
    </PageShell>
  );
}

export default SignupPage;
