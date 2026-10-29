import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import { socialSignup } from "../api/authApi";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateTimerRef = useRef(null);
  const signupStartedRef = useRef(false);
  const [signupError, setSignupError] = useState("");
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const isNew = params.get("isNew");
  const email = params.get("email");
  const name = params.get("name");
  const providerId = params.get("providerId");

  const status = signupError
    ? {
        type: "error",
        title: "카카오 회원가입을 완료할 수 없습니다.",
        message: `${signupError} 로그인 화면으로 돌아갑니다.`,
      }
    : token
      ? {
          type: "success",
          title: "카카오 로그인이 완료되었습니다.",
          message: "잠시 후 다음 화면으로 이동합니다.",
        }
      : isNew === "true"
        ? {
            type: "success",
            title: "카카오 계정으로 가입하고 있어요.",
            message: "잠시만 기다려주세요.",
          }
        : {
            type: "error",
            title: "로그인을 완료할 수 없습니다.",
            message: "로그인 화면으로 돌아갑니다.",
          };

  useEffect(() => {
    const goLater = (path, delay) => {
      navigateTimerRef.current = setTimeout(() => navigate(path, { replace: true }), delay);
    };

    if (token) {
      localStorage.setItem("token", token);

      const targetPath = localStorage.getItem("returnUrl");
      goLater(targetPath && targetPath.startsWith("/") ? targetPath : "/home", 1000);
    } else if (isNew === "true") {
      // 신규 카카오 사용자: 별도 가입 폼 없이 카카오가 준 정보로 바로 가입하고 로그인한다.
      // (개발 모드에서 효과가 두 번 실행돼도 가입 요청은 한 번만 보낸다.)
      if (signupStartedRef.current) return;
      signupStartedRef.current = true;

      (async () => {
        try {
          if (!email || !providerId) {
            throw new Error("카카오 계정 정보(이메일)를 가져오지 못했어요.");
          }
          const data = await socialSignup({
            email,
            name: name || email.split("@")[0],
            providerId,
          });
          localStorage.setItem("token", data.token);
          // 가입 직후라서 알림 동의 화면부터 보여준다.
          goLater("/notification", 800);
        } catch (error) {
          setSignupError(error.message || "회원가입 중 오류가 발생했어요.");
          goLater("/", 2200);
        }
      })();
    } else {
      goLater("/", 1400);
    }

    return () => {
      // 가입 요청이 진행 중인 동안에는 타이머만 정리한다.
      if (navigateTimerRef.current) {
        clearTimeout(navigateTimerRef.current);
      }
    };
  }, [email, isNew, name, navigate, providerId, token]);

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
