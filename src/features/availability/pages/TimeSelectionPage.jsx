import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails } from "../../meeting/api/meetingApi";
import { getMyParticipant } from "../../meeting/api/participantApi";
import { saveAvailabilities, getAvailabilities } from "../api/availabilityApi";
import PageShell from "../../../shared/components/PageShell";

function TimeSelectionPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "", description: "" });
  const [participantId, setParticipantId] = useState(null);
  
  // 상태 관리: 선택된 날짜별 시간대 (Map: "YYYY-MM-DD" -> Set of "HH:00")
  const [dateToTimes, setDateToTimes] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date()); // 달력 표시용 기준 날짜
  const [selectedDateStr, setSelectedDateStr] = useState(null); // 현재 시간을 선택 중인 날짜 ("YYYY-MM-DD")
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(true);
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

  const formatDisplayTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const amTimes = Array.from({ length: 12 }, (_, i) => {
    return `${String(i).padStart(2, "0")}:00`;
  });
  
  const pmTimes = Array.from({ length: 12 }, (_, i) => {
    return `${String(i + 12).padStart(2, "0")}:00`;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. 모임 상세 정보와 내 참여 정보 동시 로드
        const [details, myInfo] = await Promise.all([
          getMeetingDetails(meetingId),
          getMyParticipant(meetingId)
        ]);
        
        setMeetingData({
          title: details.title || details.name || details.meetingName || "",
          description: details.description || "",
        });
        setParticipantId(myInfo.participantId);
        
        // 2. 기존 저장된 가능 시간 로드
        try {
          const availabilities = await getAvailabilities(myInfo.participantId);
          const loadedData = {};
          
          availabilities.forEach(range => {
            const start = new Date(range.startDateTime);
            const end = new Date(range.endDateTime);
            const dateKey = range.startDateTime.split("T")[0];
            
            if (!loadedData[dateKey]) {
              loadedData[dateKey] = new Set();
            }
            
            // 1시간 단위로 쪼개서 Set에 추가
            let current = new Date(start);
            while (current < end) {
              const h = String(current.getHours()).padStart(2, "0");
              const m = String(current.getMinutes()).padStart(2, "0");
              loadedData[dateKey].add(`${h}:${m}`);
              current.setHours(current.getHours() + 1);
            }
          });
          
          setDateToTimes(loadedData);
        } catch {
          console.log("기존 저장된 데이터가 없습니다."); 
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        showNotice({ type: "error", message: "정보를 불러오는데 실패했습니다. 참여 여부를 확인해주세요." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [meetingId]);

  // 달력 생성 로직
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleDateClick = (date) => {
    if (!date || date < today || date >= twoWeeksLater) return;
    const dateStr = formatDate(date);
    setSelectedDateStr(dateStr);
    if (!dateToTimes[dateStr]) {
      setDateToTimes(prev => ({ ...prev, [dateStr]: new Set() }));
    }
  };

  const handleTimeMouseDown = (time) => {
    if (!selectedDateStr) return;
    setIsDragging(true);
    const currentTimes = new Set(dateToTimes[selectedDateStr] || []);
    const mode = !currentTimes.has(time);
    setDragMode(mode);
    
    if (mode) currentTimes.add(time);
    else currentTimes.delete(time);
    
    setDateToTimes(prev => ({ ...prev, [selectedDateStr]: currentTimes }));
  };

  const handleTimeMouseEnter = (time) => {
    if (!isDragging || !selectedDateStr) return;
    const currentTimes = new Set(dateToTimes[selectedDateStr] || []);
    if (dragMode) currentTimes.add(time);
    else currentTimes.delete(time);
    setDateToTimes(prev => ({ ...prev, [selectedDateStr]: currentTimes }));
  };

  const handleSave = async () => {
    if (!participantId) {
      showNotice({ type: "error", message: "참여 정보를 찾을 수 없습니다." });
      return;
    }

    if (selectedDateStr && (dateToTimes[selectedDateStr]?.size || 0) === 0) {
      showNotice({ type: "error", message: "선택한 날짜의 시간대를 선택해주세요." });
      return;
    }

    try {
      const formattedRanges = [];
      
      Object.entries(dateToTimes).forEach(([dateStr, timesSet]) => {
        const sortedTimes = Array.from(timesSet).sort();
        if (sortedTimes.length === 0) return;

        // 연속된 시간을 하나의 범위로 묶는 로직
        let start = null;
        let prevTimeValue = null;

        sortedTimes.forEach((t, idx) => {
          const [hour, min] = t.split(":").map(Number);
          const currentTimeValue = hour + min / 60;
          
          if (start === null) {
            start = currentTimeValue;
          } else if (currentTimeValue !== prevTimeValue + 1.0) {
            const sH = Math.floor(start);
            const sM = (start % 1) * 60;
            const eH = Math.floor(prevTimeValue + 1.0);
            const eM = ((prevTimeValue + 1.0) % 1) * 60;

            formattedRanges.push({
              startDateTime: `${dateStr}T${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}:00`,
              endDateTime: `${dateStr}T${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}:00`
            });
            start = currentTimeValue;
          }
          prevTimeValue = currentTimeValue;
          
          if (idx === sortedTimes.length - 1) {
            const sH = Math.floor(start);
            const sM = (start % 1) * 60;
            const eH = Math.floor(prevTimeValue + 1.0);
            const eM = ((prevTimeValue + 1.0) % 1) * 60;

            formattedRanges.push({
              startDateTime: `${dateStr}T${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}:00`,
              endDateTime: `${dateStr}T${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}:00`
            });
          }
        });
      });

      if (formattedRanges.length === 0) {
        showNotice({ type: "error", message: "선택된 시간대가 없습니다." });
        return;
      }

      await saveAvailabilities(participantId, formattedRanges);
      navigate(`/time-waiting/${meetingId}`);
    } catch (error) {
      showNotice({ type: "error", message: `저장 실패: ${error.message}` });
    }
  };

  const selectedTimeCount = Object.values(dateToTimes).reduce((count, timesSet) => {
    return count + (timesSet?.size || 0);
  }, 0);

  return (
    <PageShell
      className="relative flex select-none flex-col overflow-y-auto px-6 py-10"
      onMouseUp={() => setIsDragging(false)}
    >
        <button
          onClick={() => navigate(-1)}
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
            가능한 시간을 선택해주세요
          </h1>
          <p className="m-0 text-sm leading-[1.7] text-gray-500">
            날짜를 선택한 뒤 만날 수 있는 시간대를 눌러주세요.
          </p>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-[13px] font-bold text-gray-400">현재 모임</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
              {selectedTimeCount}개 선택
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <p className="m-0 min-w-0 truncate text-[17px] font-extrabold">
              {isLoading ? "모임 정보를 불러오는 중..." : meetingData.title || "모임"}
            </p>
          </div>
          <p className="m-0 pl-5 text-[13px] leading-[1.6] text-gray-500">
            {meetingData.description || "선택한 시간은 저장 후 수정할 수 있습니다."}
          </p>
        </section>

        <section className="mb-7 rounded-3xl border-[1.5px] border-gray-100 bg-white px-4 py-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg font-extrabold text-gray-600"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              type="button"
            >
              &lt;
            </button>
            <p className="m-0 text-[17px] font-extrabold">
              {year}년 {month + 1}월
            </p>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg font-extrabold text-gray-600"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              type="button"
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="pb-2 text-center text-xs font-bold text-gray-400">
                {d}
              </div>
            ))}
            {calendarDays.map((date, idx) => {
              const dateStr = date ? formatDate(date) : "";
              const isNotSelectable = date && (date < today || date >= twoWeeksLater);
              const isSelected = selectedDateStr === dateStr;
              const hasTime = date && dateToTimes[dateStr]?.size > 0;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!date || isNotSelectable}
                  className={`flex aspect-square items-center justify-center rounded-full text-sm font-bold transition ${
                    !date
                      ? "cursor-default"
                      : isSelected
                        ? "bg-blue-500 text-white"
                        : hasTime
                          ? "bg-blue-100 text-blue-600"
                          : isNotSelectable
                            ? "cursor-not-allowed text-gray-300"
                            : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  {date?.getDate()}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-7 rounded-3xl bg-gray-50 px-4 py-5">
          <div className="mb-4 rounded-2xl bg-white px-4 py-3 text-center text-[13px] font-extrabold text-gray-600">
            {selectedDateStr ? `${selectedDateStr} 시간 선택` : "날짜를 먼저 선택하세요"}
          </div>

          <div className="max-h-[360px] overflow-y-auto pr-1">
            {[
              { label: "오전", times: amTimes },
              { label: "오후", times: pmTimes },
            ].map((group) => (
              <div key={group.label} className="mb-5 last:mb-0">
                <p className="mb-2.5 text-[13px] font-extrabold text-gray-700">
                  {group.label}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {group.times.map((time) => {
                    const isActive = dateToTimes[selectedDateStr]?.has(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={!selectedDateStr}
                        className={`flex h-10 items-center justify-center rounded-xl border-[1.5px] text-xs font-extrabold transition ${
                          !selectedDateStr
                            ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300"
                            : isActive
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                        }`}
                        onMouseDown={() => handleTimeMouseDown(time)}
                        onMouseEnter={() => handleTimeMouseEnter(time)}
                        onClick={() => {
                          if (!selectedDateStr) return;
                        }}
                      >
                        {formatDisplayTime(time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-8">
          <button
            className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            onClick={handleSave}
            disabled={isLoading}
          >
            입력 완료
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
    </PageShell>
  );
}

export default TimeSelectionPage;
