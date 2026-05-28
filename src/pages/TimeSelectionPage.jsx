import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMeetingDetails, saveAvailabilities, getAvailabilities } from "../api/meetingApi";
import "./TimeSelectionPage.css";

function TimeSelectionPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({ title: "", description: "" });
  
  // 상태 관리: 선택된 날짜별 시간대 (Map: "YYYY-MM-DD" -> Set of "HH:00")
  const [dateToTimes, setDateToTimes] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date()); // 달력 표시용 기준 날짜
  const [selectedDateStr, setSelectedDateStr] = useState(null); // 현재 시간을 선택 중인 날짜 ("YYYY-MM-DD")
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(true);

  const times = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetingDetails(meetingId);
        setMeetingData(data);
        
        // 실제 운영 시 participantId를 가져오는 과정이 필요함 (현재 임시 1)
        const participantId = 1; 
        try {
          const availabilities = await getAvailabilities(participantId);
          // DB 데이터를 dateToTimes 형식으로 변환하는 로직 (추후 구현)
        } catch (e) { console.error("기존 데이터 없음"); }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
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
    if (!date || date < today) return;
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
    try {
      const participantId = 1; // 임시
      const formattedRanges = [];
      
      Object.entries(dateToTimes).forEach(([dateStr, timesSet]) => {
        const sortedTimes = Array.from(timesSet).sort();
        if (sortedTimes.length === 0) return;

        // 연속된 시간을 하나의 범위로 묶는 로직
        let start = null;
        let prevHour = null;

        sortedTimes.forEach((t, idx) => {
          const hour = parseInt(t.split(":")[0]);
          if (start === null) {
            start = hour;
          } else if (hour !== prevHour + 1) {
            formattedRanges.push({
              startDateTime: `${dateStr}T${String(start).padStart(2, "0")}:00:00`,
              endDateTime: `${dateStr}T${String(prevHour + 1).padStart(2, "0")}:00:00`
            });
            start = hour;
          }
          prevHour = hour;
          
          if (idx === sortedTimes.length - 1) {
            formattedRanges.push({
              startDateTime: `${dateStr}T${String(start).padStart(2, "0")}:00:00`,
              endDateTime: `${dateStr}T${String(prevHour + 1).padStart(2, "0")}:00:00`
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
      navigate(`/participate/${meetingId}`);
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
        <div className="meeting-desc">날짜를 선택하고 시간을 드래그하세요</div>
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
              const isPast = date && date < today;
              const isSelected = selectedDateStr === dateStr;
              const hasTime = date && dateToTimes[dateStr]?.size > 0;

              return (
                <div 
                  key={idx} 
                  className={`day-cell ${!date ? "empty" : ""} ${isPast ? "past" : ""} ${isSelected ? "selected" : ""} ${hasTime ? "has-time" : ""}`}
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
          <div className="time-grid">
            {times.map(time => (
              <div 
                key={time}
                className={`time-slot ${dateToTimes[selectedDateStr]?.has(time) ? "active" : ""} ${!selectedDateStr ? "disabled" : ""}`}
                onMouseDown={() => handleTimeMouseDown(time)}
                onMouseEnter={() => handleTimeMouseEnter(time)}
              >
                {time}
              </div>
            ))}
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
