import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../api/authApi";

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
        message: error.message || "로그인 중 오류가 발생했습니다.",
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
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#111]">
      <main className="flex min-h-screen w-[390px] flex-col bg-white px-6 py-10 text-[#191f28]">
        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-gray-100 transition active:scale-95"
          aria-label="뒤로가기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <section className="mb-10">
          <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">
            WHERE2MEET
          </p>
          <h1 className="mb-2.5 text-[26px] font-extrabold leading-tight tracking-[-1px]">
            모임 참여를 위해 로그인해주세요
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            로그인하면 초대받은 모임 참여 화면으로 바로 이동합니다.
          </p>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-400">초대 코드</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              대기 중
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
              {inviteCode}
            </p>
          </div>
          <p className="m-0 mt-2 pl-5 text-[13px] leading-[1.6] text-gray-500">
            로그인 후 초대를 수락할 수 있습니다.
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

        <div className="mb-7 rounded-[20px] bg-blue-50 px-5 py-[18px]">
          <p className="mb-1.5 text-[13px] font-extrabold text-blue-600">
            Tip
          </p>
          <p className="m-0 text-[11px] leading-[1.65] text-blue-800">
            초대 링크로 들어온 경우 로그인 후 원래 초대 화면으로 돌아갑니다.
          </p>
        </div>

        <section className="mt-auto pt-8">
          <button 
            className="mb-3 h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          <button
            className="mb-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border-0 bg-[#FEE500] text-[15px] font-extrabold text-[#191600] transition hover:bg-[#f2d900] active:scale-95"
            onClick={handleKakaoLogin}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#191600] text-xs font-extrabold text-[#FEE500]">
              K
            </span>
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
      </main>
    </div>
  );
}

export default GuestLoginPage;
