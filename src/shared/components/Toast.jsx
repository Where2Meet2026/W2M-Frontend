import { useEffect } from "react";
import { AlertCircleIcon, CheckCircleIcon } from "./Icons";

// 방금 한 동작의 결과를 화면 아래에 잠깐 보여주는 안내 (useToast와 같이 쓴다).
// type: "success"(기본, 초록 체크) | "error"(빨간 느낌표). 메시지가 길면 줄바꿈된다.
function Toast({ message, type = "success", onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className="fixed bottom-24 left-1/2 z-50 flex min-h-[52px] w-[345px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-[#191f28] px-4 py-3 text-white shadow-lg"
    >
      <span className={`shrink-0 ${isError ? "text-red-400" : "text-green-400"}`}>
        {isError ? <AlertCircleIcon /> : <CheckCircleIcon />}
      </span>
      <p className="m-0 text-sm font-bold leading-[1.5]">{message}</p>
    </div>
  );
}

export default Toast;
