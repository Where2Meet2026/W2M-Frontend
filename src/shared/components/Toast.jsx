import { useEffect } from "react";
import { CheckCircleIcon } from "./Icons";

function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex h-[52px] w-[345px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-[#191f28] px-4 text-white">
      <CheckCircleIcon />
      <p className="m-0 whitespace-nowrap text-sm font-bold">{message}</p>
    </div>
  );
}

export default Toast;
