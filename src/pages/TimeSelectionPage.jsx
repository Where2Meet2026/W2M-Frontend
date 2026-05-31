import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails, saveAvailabilities, getAvailabilities, getMyParticipant } from "../api/meetingApi";
import "./TimeSelectionPage.css";

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
        
        setMeetingData(details);
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
        } catch (e) { 
          console.log("기존 저장된 데이터가 없습니다."); 
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("정보를 불러오는데 실패했습니다. 참여 여부를 확인해주세요.");
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
      alert("참여 정보를 찾을 수 없습니다.");
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
        alert("선택된 시간대가 없습니다.");
        return;
      }

      await saveAvailabilities(participantId, formattedRanges);
      alert("모든 시간대가 저장되었습니다.");
      navigate(`/time-waiting/${meetingId}`);
    } catch (error) {
      alert("저장 실패: " + error.message);
    }
  };

  return (
    <div className="time-selection-page" onMouseUp={() => setIsDragging(false)}>
      <div className="back-button-container" onClick={() => navigate(-1)}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="time-header">
        <div className="meeting-title">{meetingData.title || "모임 이름"}</div>
        <div className="meeting-desc">날짜를 선택하고 시간을 선택하세요</div>
      </div>

      <div className="selection-container">
        {/* 왼쪽: 한 달 달력 */}
        <div className="calendar-section">
          <div className="calendar-nav">
            <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>&lt;</button>
            <span className="current-month">{year}년 {month + 1}월</span>
            <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>&gt;</button>
          </div>
          <div className="calendar-grid">
            {["일", "월", "화", "수", "목", "금", "토"].map(d => <div key={d} className="day-label">{d}</div>)}
            {calendarDays.map((date, idx) => {
              const dateStr = date ? formatDate(date) : "";
              const isNotSelectable = date && (date < today || date >= twoWeeksLater);
              const isSelected = selectedDateStr === dateStr;
              const hasTime = date && dateToTimes[dateStr]?.size > 0;

              return (
                <div 
                  key={idx} 
                  className={`day-cell ${!date ? "empty" : ""} ${isNotSelectable ? "past" : ""} ${isSelected ? "selected" : ""} ${hasTime ? "has-time" : ""}`}
                  onClick={() => handleDateClick(date)}
                >
                  {date?.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽: 시간 선택 그리드 */}
        <div className="time-section">
          <div className="selected-date-label">
            {selectedDateStr ? `${selectedDateStr} 시간 선택` : "날짜를 먼저 선택하세요"}
          </div>
          
          <div className="time-scroll-area">
            <div className="time-group">
              <div className="time-group-header">오전</div>
              <div className="time-grid">
                {amTimes.map(time => (
                  <div 
                    key={time}
                    className={`time-slot ${dateToTimes[selectedDateStr]?.has(time) ? "active" : ""} ${!selectedDateStr ? "disabled" : ""}`}
                    onMouseDown={() => handleTimeMouseDown(time)}
                    onMouseEnter={() => handleTimeMouseEnter(time)}
                  >
                    {formatDisplayTime(time)}
                  </div>
                ))}
              </div>
            </div>

            <div className="time-group">
              <div className="time-group-header">오후</div>
              <div className="time-grid">
                {pmTimes.map(time => (
                  <div 
                    key={time}
                    className={`time-slot ${dateToTimes[selectedDateStr]?.has(time) ? "active" : ""} ${!selectedDateStr ? "disabled" : ""}`}
                    onMouseDown={() => handleTimeMouseDown(time)}
                    onMouseEnter={() => handleTimeMouseEnter(time)}
                  >
                    {formatDisplayTime(time)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="save-btn" onClick={handleSave}>입력 완료</button>
      </div>
    </div>
  );
}

export default TimeSelectionPage;
