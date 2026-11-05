import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../api/authApi";
import PageShell from "../../../shared/components/PageShell";
import BackButton from "../../../shared/components/BackButton";
import { KakaoSymbolIcon } from "../../../shared/components/Icons";

function GuestLoginPage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(null);

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
      setNotice({ type: "error", message: "아이디와 비밀번호를 입력해주세요." });
      return;
    }

    try {
      setIsLoading(true);
      setNotice(null);
      const data = await login(email, password);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      const returnUrl = localStorage.getItem("returnUrl") || `/invite/accept/${inviteCode}`;
      // 여기서 바로 지우지 않음 (AcceptInvitePage에서 지움)
      navigate(returnUrl);
      
    } catch (error) {
      console.error("로그인 에러:", error);
      setNotice({
        type: "error",
        message: error.message || "로그인하지 못했어요. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 시에도 returnUrl 확인 및 보강
    if (!localStorage.getItem("returnUrl")) {
      localStorage.setItem("returnUrl", `/invite/accept/${inviteCode}`);
    }
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  return (
    <PageShell>
        <BackButton className="mb-10" />

        <section className="mb-10">
          <h1 className="mb-2.5 text-[26px] font-extrabold leading-tight tracking-[-1px]">
            모임 참여를 위해 로그인해주세요
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            로그인하면 초대받은 모임으로 바로 이동해요.
          </p>
        </section>

        <section className="mb-7">
          <div className="mb-5">
            <input
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
              type="text"
              placeholder="아이디"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <input
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </section>

        {notice && (
          <section className={`mb-7 rounded-[20px] px-5 py-[18px] ${
            notice.type === "success" ? "bg-blue-50" : "bg-red-50"
          }`}>
            <p className={`m-0 text-[13px] font-extrabold leading-[1.65] ${
              notice.type === "success" ? "text-blue-700" : "text-red-700"
            }`}>
              {notice.message}
            </p>
          </section>
        )}

        <section className="mt-auto pt-8">
          <button 
            className="mb-3 h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          <button
            className="mb-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border-0 bg-[#FEE500] text-[15px] font-extrabold text-black/85 transition hover:bg-[#f2d900] active:scale-95"
            onClick={handleKakaoLogin}
          >
            <KakaoSymbolIcon />
            카카오로 시작하기
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-gray-400">
            <span>아직 계정이 없나요?</span>
            <button
              className="border-0 bg-transparent text-[13px] font-extrabold text-blue-500"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>
        </section>
    </PageShell>
  );
}

export default GuestLoginPage;
