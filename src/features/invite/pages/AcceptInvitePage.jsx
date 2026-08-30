import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingByInviteCode } from "../../meeting/api/meetingApi";
import { joinMeeting } from "../../meeting/api/participantApi";
import PageShell from "../../../shared/components/PageShell";

function AcceptInvitePage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // 1. 로그인 여부 판단을 최상단에서 수행
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "null" && token !== "undefined";

  useEffect(() => {
    if (!isAuthenticated) {
      // 목적지 주소를 명확하게 고정 (로그인 페이지가 저장되는 것 방지)
      const targetPath = `/invite/accept/${inviteCode}`;
      localStorage.setItem("returnUrl", targetPath);
      console.log("AcceptInvitePage: 목적지 저장됨 ->", targetPath);
      
      // 로그인 안 되어 있으면 초대 전용 로그인 페이지로 즉시 리다이렉트
      navigate(`/invite/login/${inviteCode}`, { replace: true });
      return;
    }

    // [추가] 로그인이 확인되어 성공적으로 페이지에 머물게 된 경우에만 returnUrl 삭제
    localStorage.removeItem("returnUrl");

    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetingByInviteCode(inviteCode);
        setMeetingData(data);
      } catch (err) {
        console.error("초대 정보 로드 실패:", err);
        setError("유효하지 않은 초대 코드이거나 정보를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (inviteCode) {
      fetchMeeting();
    }
  }, [inviteCode, navigate, isAuthenticated]);

  // 로그인하지 않은 경우 화면을 그리지 않음
  if (!isAuthenticated) return null;

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      const result = await joinMeeting(inviteCode);
      // 참여 성공 후 해당 모임 페이지로 이동
      navigate(`/participate/${result.meetingId}`);
    } catch (err) {
      console.error("참여 실패:", err);
      setSubmitError(err.message || "모임 참여 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    navigate("/");
  };

  if (error) {
    return (
      <PageShell>
          <section className="mt-auto rounded-3xl bg-red-50 px-5 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <p className="m-0 text-sm font-extrabold leading-[1.7] text-red-600">{error}</p>
          </section>

          <div className="mt-auto pt-8">
            <button
              className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
              onClick={() => navigate("/")}
            >
              홈으로 가기
            </button>
          </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
        <button
          onClick={handleDecline}
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
          <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px]">
            모임 초대가 도착했어요!
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            초대받은 모임 정보를 확인하고 참여를 수락해주세요.
          </p>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-400">초대받은 모임</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              참여 대기
            </span>
          </div>

          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
              {isLoading ? "모임 정보를 불러오는 중..." : meetingData?.title || meetingData?.name || "모임"}
            </p>
          </div>
          <p className="m-0 pl-5 text-[13px] leading-[1.6] text-gray-500">
            {isLoading ? "잠시만 기다려주세요." : meetingData?.description || "모임 설명이 없습니다."}
          </p>
        </section>

        <section className="mb-7 rounded-[20px] bg-blue-50 px-5 py-[18px]">
          <p className="mb-1.5 text-[13px] font-extrabold text-blue-600">
            초대 코드
          </p>
          <p className="m-0 break-all text-[13px] leading-[1.65] text-blue-800">
            {inviteCode}
          </p>
        </section>

        <section className="mb-7 rounded-3xl border-[1.5px] border-dashed border-gray-200 bg-white px-5 py-8 text-center">
          <p className="m-0 text-base font-extrabold text-[#191f28]">
            초대를 수락하시겠습니까?
          </p>
          <p className="mt-2 text-[13px] leading-[1.6] text-gray-400">
            수락하면 해당 모임의 참여자 목록에 추가됩니다.
          </p>
        </section>

        {submitError && (
          <section className="mb-7 rounded-[20px] bg-red-50 px-5 py-[18px]">
            <p className="mb-1.5 text-[13px] font-extrabold text-red-600">
              참여할 수 없습니다
            </p>
            <p className="m-0 text-[13px] leading-[1.65] text-red-700">
              {submitError}
            </p>
          </section>
        )}

        <div className="mt-auto pt-8">
          <button
            className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            onClick={handleAccept}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "참여 중..." : "수락하기"}
          </button>
        </div>
    </PageShell>
  );
}

export default AcceptInvitePage;
