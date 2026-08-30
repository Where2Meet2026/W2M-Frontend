import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateTimerRef = useRef(null);
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const isNew = params.get("isNew");
  const email = params.get("email");
  const name = params.get("name");

  const status = token
    ? {
        type: "success",
        title: "카카오 로그인이 완료되었습니다.",
        message: "잠시 후 다음 화면으로 이동합니다.",
      }
    : isNew === "true"
      ? {
          type: "success",
          title: "추가 정보 입력이 필요합니다.",
          message: "회원가입 화면으로 이동합니다.",
        }
      : {
          type: "error",
          title: "로그인을 완료할 수 없습니다.",
          message: "로그인 화면으로 돌아갑니다.",
        };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      
      const targetPath = localStorage.getItem("returnUrl");
      const nextPath = targetPath && targetPath.startsWith("/") ? targetPath : "/home";

      navigateTimerRef.current = setTimeout(() => {
        navigate(nextPath, { replace: true });
      }, 1000);
    } else if (isNew === "true") {
      navigateTimerRef.current = setTimeout(() => {
        navigate("/signup", { replace: true, state: { email, name, isSocial: true } });
      }, 1000);
    } else {
      navigateTimerRef.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1400);
    }

    return () => {
      if (navigateTimerRef.current) {
        clearTimeout(navigateTimerRef.current);
      }
    };
  }, [email, isNew, name, navigate, token]);

  return (
    <PageShell className="flex flex-col items-center justify-center px-6 py-10">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-sm font-extrabold ${
          status.type === "error"
            ? "bg-red-50 text-red-500"
            : "bg-[#FEE500] text-[#191600]"
        }`}>
          K
        </div>
        <p className={`text-base font-extrabold ${
          status.type === "error" ? "text-red-600" : "text-[#191f28]"
        }`}>
          {status.title}
        </p>
        <p className="mt-2 text-center text-sm leading-[1.7] text-gray-500">
          {status.message}
        </p>
    </PageShell>
  );
}

export default KakaoCallbackPage;
