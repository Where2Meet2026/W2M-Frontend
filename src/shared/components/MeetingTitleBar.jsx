// 진행 화면(시간 선택·대기·추천 시간)의 위쪽에 두는 한 줄짜리 모임 이름 바.
// 예전에는 "현재 모임"이라는 라벨 + 이름 + 설명이 큰 카드 한 장을 차지했는데, 이름과 상태 배지만 한 줄로 보여준다.
//   <MeetingTitleBar title={meetingData.title} badge="3개 선택" description={meetingData.description} />
function MeetingTitleBar({ title, badge, description }) {
  return (
    <section className="mb-7 rounded-2xl bg-gray-50 px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          <p className="m-0 min-w-0 truncate text-[15px] font-extrabold text-[#191f28]">{title}</p>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="m-0 mt-2 pl-[18px] text-[13px] leading-[1.6] text-gray-500">{description}</p>
      )}
    </section>
  );
}

export default MeetingTitleBar;
