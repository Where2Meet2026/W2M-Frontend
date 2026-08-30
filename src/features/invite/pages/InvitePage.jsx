import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../../meeting/api/meetingApi";

function InvitePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ name: "", inviteCode: "" });
  const [notice, setNotice] = useState(null);
  const noticeTimerRef = useRef(null);

  const showNotice = (nextNotice) => {
    setNotice(nextNotice);

    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = setTimeout(() => {
      setNotice(null);
      noticeTimerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetingDetails(meetingId);
        setMeetingData({ 
          name: data.title || data.name || data.meetingName, 
          inviteCode: data.inviteCode 
        });
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        showNotice({ type: "error", message: "모임 정보를 불러오는데 실패했습니다." });
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchMeetingData();
    }
  }, [meetingId]);

  const handleCopyLink = () => {
    if (meetingData.inviteCode) {
      const inviteLink = `${window.location.origin}/invite/accept/${meetingData.inviteCode}`;
      navigator.clipboard.writeText(inviteLink);
      showNotice({ type: "success", message: "초대 링크가 복사되었습니다." });
    }
  };

  const handleMessageShare = () => {
    if (meetingData.inviteCode) {
      const inviteLink = `${window.location.origin}/invite/accept/${meetingData.inviteCode}`;
      const message = encodeURIComponent(
        `${meetingData.name || "모임"}에 초대합니다.\n${inviteLink}`
      );
      window.location.href = `sms:?body=${message}`;
    }
  };

  const handleKakaoShare = () => {
    showNotice({ type: "error", message: "카카오톡 공유 기능은 SDK 설정이 필요합니다." });
    // 실제 SDK 연동 시 여기에 로직 구현
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#111]">
      <main className="relative flex min-h-screen w-[390px] flex-col overflow-hidden bg-white px-6 py-10 text-[#191f28]">
        <button
          onClick={handleBack}
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
            친구를 초대해볼까요?
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            초대 코드나 링크를 공유해서 모임 참여자를 모아보세요.
          </p>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="m-0 text-[13px] font-bold text-gray-400">초대할 모임</p>
            <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              공유 가능
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
              {isLoading ? "모임 정보를 불러오는 중..." : meetingData.name || "모임"}
            </p>
          </div>
          <p className="m-0 mt-2 pl-5 text-[13px] leading-[1.6] text-gray-500">
            모임 ID: {meetingId}
          </p>
        </section>

        <section className="mb-8 rounded-3xl border-[1.5px] border-dashed border-blue-200 bg-blue-50 px-5 py-6 text-center">
          <p className="mb-3 text-[13px] font-extrabold text-blue-600">초대 링크</p>
          <button
            onClick={handleCopyLink}
            disabled={isLoading || !meetingData.inviteCode}
            className="w-full rounded-2xl border-0 bg-white px-4 py-5 text-left text-[13px] font-bold leading-[1.6] text-[#191f28] shadow-sm transition active:scale-[0.98] disabled:text-gray-300"
          >
            {isLoading
              ? "..."
              : meetingData.inviteCode
                ? `${window.location.origin}/invite/accept/${meetingData.inviteCode}`
                : "초대 링크가 없습니다"}
          </button>
          <p className="mt-3 text-xs font-semibold leading-[1.6] text-blue-700">
            링크를 누르면 바로 복사됩니다.
          </p>
        </section>

        <section className="mb-7">
          <p className="mb-4 text-[13px] font-bold text-gray-700">공유 방법</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleKakaoShare}
              className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border-0 bg-[#FEE500] text-xs font-extrabold text-[#191600] transition active:scale-95"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#191600] text-sm text-[#FEE500]">
                K
              </span>
              카카오톡
            </button>

            <button
              onClick={handleMessageShare}
              className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-gray-100 bg-white text-xs font-extrabold text-gray-700 shadow-sm transition active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
              문자 메시지
            </button>
          </div>
        </section>

        <div className="mt-auto pt-8">
          <button
            className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
            onClick={handleBack}
          >
            완료
          </button>
        </div>

        {notice && (
          <div className="pointer-events-none absolute bottom-24 left-6 right-6 z-30 text-center">
            <p className={`m-0 text-[13px] font-extrabold leading-[1.6] drop-shadow-sm ${
              notice.type === "success" ? "text-blue-600" : "text-red-500"
            }`}>
              {notice.message}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default InvitePage;
