// 리뷰 작성(이름 15px) / 리뷰 목록(이름 17px) 화면 공통 장소 카드
function PlaceCard({ name, subText, large = false }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="h-11 w-11 shrink-0 rounded-[10px] bg-[#f0f0f0]" />
      <div className="min-w-0">
        <p className={`m-0 truncate font-bold text-[#191f28] ${large ? "text-[17px]" : "text-[15px]"}`}>{name}</p>
        {subText && <p className="m-0 mt-0.5 truncate text-[11px] text-[#9ca3af]">{subText}</p>}
      </div>
    </div>
  );
}

export default PlaceCard;
