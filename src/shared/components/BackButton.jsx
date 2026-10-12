import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "./Icons";

function BackButton({ onClick, className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate(-1))}
      aria-label="뒤로가기"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#374151] transition active:scale-95 ${className}`}
    >
      <ChevronLeftIcon />
    </button>
  );
}

export default BackButton;
