import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomItem from "../components/RoomItem";
import { getMyMeetings } from "../api/meetingApi";

function GetRoomPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setNotice(null);
      const data = await getMyMeetings();
      // 백엔드 필드명을 RoomItem에서 사용하는 필드명으로 매핑
      const formattedRooms = data.map(room => ({
        ...room,
        id: room.meetingId,
        name: room.title
      }));
      setRooms(formattedRooms);
    } catch (error) {
      console.error("내 방 목록 조회 실패:", error);
      setNotice({
        type: "error",
        message: error.message || "목록을 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex min-h-screen justify-center bg-[#111]">
      <main className="flex min-h-screen w-[390px] flex-col overflow-y-auto bg-white px-6 py-10 text-[#191f28]">

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-gray-100 transition active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <section className="mb-10">
          <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">WHERE2MEET</p>
          <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px] text-[#191f28]">내 방 목록</h1>
          <p className="mt-2.5 text-sm leading-[1.7] text-gray-500">참여 중인 모임을 확인하세요.</p>
        </section>

        {notice && (
          <section className={`mb-7 rounded-[20px] px-5 py-[18px] ${
            notice.type === "success" ? "bg-blue-50" : "bg-red-50"
          }`}>
            <p className={`m-0 text-[13px] font-extrabold leading-[1.65] ${
              notice.type === "success" ? "text-blue-700" : "text-red-700"
            }`}>
              {notice.message}
            </p>
          </section>
        )}

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-400">참여 중인 모임</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              {isLoading ? "..." : `${rooms.length}개`}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isLoading ? "bg-gray-300" : (rooms.length > 0 ? "bg-blue-500" : "bg-gray-300")}`} />
            <p className="m-0 text-[15px] font-bold text-gray-600">
              {isLoading ? "로딩 중..." : (rooms.length > 0 ? "참여 가능한 모임이 있습니다." : "아직 참여 중인 모임이 없습니다.")}
            </p>
          </div>
        </section>

        {/* 방 목록 */}
        {isLoading ? (
          <section className="mb-7 text-center py-10">
            <p className="text-sm text-gray-400">목록을 불러오는 중입니다...</p>
          </section>
        ) : rooms.length > 0 ? (
          <section className="mb-7 space-y-3">
            {rooms.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                onClick={() => navigate(`/participate/${room.id}`)}
                onRefresh={fetchRooms}
                onNotice={setNotice}
              />
            ))}
          </section>
        ) : (
          <section className="mb-7 rounded-3xl border-[1.5px] border-dashed border-gray-200 bg-white px-5 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <p className="text-sm font-extrabold text-gray-600">아직 참여 중인 방이 없습니다</p>
            <p className="mt-1 text-xs leading-[1.6] text-gray-400">새로운 모임을 만들거나 초대 링크로 참여해보세요.</p>
          </section>
        )}

        <div className="mt-auto pt-8">
          <button
            onClick={() => navigate("/create-meeting")}
            className="h-[54px] w-full rounded-2xl bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95"
          >
            모임 만들기
          </button>
        </div>

      </main>
    </div>
  );
}

export default GetRoomPage;
