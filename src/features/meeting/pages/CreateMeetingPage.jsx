import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/meetingApi";

function CreateMeetingPage() {
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleCreate = async () => {
    if (!meetingName.trim()) {
      showNotice({ type: "error", message: "모임 이름을 입력해주세요." });
      return;
    }

    try {
      setIsSubmitting(true);
      setNotice(null);

      const data = await createMeeting(meetingName, description);
      const meetingId = data.id || data.meetingId || 1;
      navigate(`/participate/${meetingId}`);
    } catch (error) {
      showNotice({ type: "error", message: error.message || "모임 생성 중 오류가 발생했습니다." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#111]">
      <main className="relative flex min-h-screen w-[390px] flex-col overflow-hidden bg-white px-6 py-10 text-[#191f28]">

        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-gray-100 transition active:scale-95"
          aria-label="뒤로가기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <section className="mb-10">
          <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">WHERE2MEET</p>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-1px] text-[#191f28]">모임을 만들어볼까요?</h1>
          <p className="mt-2.5 text-sm leading-[1.7] text-gray-500">모임 이름과 설명을 입력해주세요.</p>
        </section>

        <section className="mb-8 space-y-5">
          <div>
            <label className="mb-2.5 block text-[13px] font-bold text-gray-700">모임 이름</label>
            <input
              type="text"
              placeholder="모임 이름 입력"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              disabled={isSubmitting}
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="mb-2.5 block text-[13px] font-bold text-gray-700">설명</label>
            <input
              type="text"
              placeholder="모임에 대한 간단한 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
        </section>

        <div className="mt-auto pt-8">
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="h-[54px] w-full rounded-2xl bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isSubmitting ? "생성 중..." : "모임 생성하기"}
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

export default CreateMeetingPage;
