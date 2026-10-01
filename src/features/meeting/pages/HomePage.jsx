import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../../shared/components/PageShell";
import NotificationSettingsSheet from "../../notification/components/NotificationSettingsSheet";

function HomePage() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <PageShell className="relative flex flex-col justify-center px-6 py-10">
        <button
          onClick={() => setShowSettings(true)}
          aria-label="알림 설정"
          className="absolute right-6 top-10 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 003.4 0" />
          </svg>
        </button>
        {showSettings && <NotificationSettingsSheet onClose={() => setShowSettings(false)} />}
        <div className="w-full">

        {/* 로고 */}
        <div className="mb-14 text-center">
          <h1 className="text-3xl font-black tracking-tight text-blue-500">WHERE2MEET</h1>
          <p className="mt-2 text-sm text-gray-400">무엇을 하시겠어요?</p>
        </div>

        {/* 버튼 그룹 */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/get-room")}
            className="w-full h-16 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-left px-6 flex items-center gap-4 shadow-sm transition active:scale-95"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">내 방 조회</p>
              <p className="text-xs text-gray-400 mt-0.5">참여 중인 모임 목록 보기</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/create-meeting")}
            className="w-full h-16 bg-blue-500 hover:bg-blue-600 rounded-2xl text-left px-6 flex items-center gap-4 shadow-sm transition active:scale-95"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">모임 만들기</p>
              <p className="text-xs text-blue-100 mt-0.5">새로운 모임 생성하기</p>
            </div>
          </button>
        </div>

        </div>
    </PageShell>
  );
}

export default HomePage;
