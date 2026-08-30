import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import PageShell from "../../../shared/components/PageShell";

function MainPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setNotice({ type: "error", message: "아이디와 비밀번호를 입력해주세요." });
      return;
    }
    try {
      setIsLoading(true);
      setNotice(null);
      const data = await login(email, password);
      if (data.token) localStorage.setItem("token", data.token);

      const returnUrl = localStorage.getItem("returnUrl");
      navigate(returnUrl && returnUrl.startsWith("/") ? returnUrl : "/home", { replace: true });
    } catch (error) {
      setNotice({ type: "error", message: error.message || "로그인 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell className="flex flex-col justify-center px-6 py-10">
        <div className="w-full">

          {/* 로고 */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-blue-500">WHERE2MEET</h1>
            <p className="mt-2 text-sm text-gray-400">모두를 위한 중간 지점 찾기</p>
          </div>

          {/* 카드 */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            {notice && (
              <div className={`mb-5 rounded-2xl px-4 py-3 ${
                notice.type === "success" ? "bg-blue-50" : "bg-red-50"
              }`}>
                <p className={`m-0 text-[13px] font-bold leading-[1.6] ${
                  notice.type === "success" ? "text-blue-700" : "text-red-700"
                }`}>
                  {notice.message}
                </p>
              </div>
            )}

            <div className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="아이디(이메일)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="mb-3 h-12 w-full rounded-xl bg-blue-500 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>

            <button
              onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/kakao"}
              className="mb-4 h-12 w-full rounded-xl bg-yellow-400 text-sm font-bold text-gray-900 transition hover:bg-yellow-500 active:scale-95"
            >
              카카오로 시작하기
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate("/signup")}
                className="text-sm text-gray-400 transition hover:text-gray-600"
              >
                아직 계정이 없으신가요? <span className="font-semibold text-blue-500">회원가입</span>
              </button>
            </div>

          </div>
        </div>
    </PageShell>
  );
}

export default MainPage;
  
