import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { searchPlacesByKeyword } from "../api/locationApi";
import PageShell from "../../../shared/components/PageShell";

function LocationPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  const [keyword, setKeyword] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedKeyword = keyword.trim();
  const isSearching = trimmedKeyword.length > 0;

  useEffect(() => {
    if (!isSearching) {
      setPlaces([]);
      setErrorMessage("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const result = await searchPlacesByKeyword(trimmedKeyword);
        setPlaces(result);
      } catch (error) {
        console.error(error);
        setPlaces([]);
        setErrorMessage("장소 검색 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [trimmedKeyword, isSearching]);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setKeyword("");
  };

  const handleClearSelection = () => {
    setSelectedPlace(null);
    setKeyword("");
    setPlaces([]);
    setErrorMessage("");
  };

  return (
    <PageShell className="flex flex-col overflow-y-auto px-6 py-10">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-gray-100 transition active:scale-95"
        aria-label="뒤로가기"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* 헤더 */}
      <section className="mb-10">
        <p className="mb-2.5 text-xs font-extrabold tracking-[0.5px] text-blue-500">
          WHERE2MEET
        </p>
        <h1 className="mb-2.5 text-[28px] font-extrabold leading-tight tracking-[-1px]">
          출발 위치를 입력해주세요
        </h1>
        <p className="m-0 text-sm leading-[1.7] text-gray-500">
          약속 장소를 추천받기 위해 출발할 위치를 선택해 주세요.
        </p>
      </section>

      {/* 선택된 장소 카드 */}
      <section className="mb-7 rounded-3xl bg-gray-50 px-5 py-[22px]">
        <div className="mb-4 flex items-center justify-between">
          <p className="m-0 text-[13px] font-bold text-gray-400">현재 선택 위치</p>
          {selectedPlace && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-extrabold text-blue-600">
                선택 완료
              </span>
              <button
                onClick={handleClearSelection}
                className="rounded-full border-0 bg-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-500"
              >
                초기화
              </button>
            </div>
          )}
        </div>

        {selectedPlace ? (
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
              <p className="m-0 text-[17px] font-extrabold">{selectedPlace.name}</p>
            </div>
            <p className="m-0 pl-5 text-[13px] leading-[1.6] text-gray-500">
              {selectedPlace.address}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
            <p className="m-0 text-[15px] font-semibold text-gray-400">
              아직 선택된 위치가 없습니다.
            </p>
          </div>
        )}
      </section>

      {/* 검색 입력 */}
      <div className="mb-5">
        <label className="mb-2.5 block text-[13px] font-bold text-gray-700">
          출발지 검색
        </label>
        <div className="relative">
          <svg
            className="absolute left-[18px] top-1/2 -translate-y-1/2"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장소명을 입력하세요"
            className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-12 text-[15px] font-medium text-[#191f28] outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              className="absolute right-3.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-gray-200"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      {isSearching && (
        <div className="mb-7 flex flex-col gap-3">
          {isLoading ? (
            <div className="rounded-3xl bg-gray-50 px-5 py-8 text-center">
              <p className="m-0 text-sm font-bold text-gray-500">장소를 검색하고 있어요...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl bg-red-50 px-5 py-6 text-center">
              <p className="m-0 text-sm font-bold text-red-600">{errorMessage}</p>
            </div>
          ) : places.length > 0 ? (
            places.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              return (
                <button
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className={`w-full rounded-3xl border-[1.5px] px-5 py-5 text-left shadow-sm transition ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`m-0 mb-1 text-[17px] font-extrabold ${isSelected ? "text-white" : "text-[#191f28]"}`}>
                        {place.name}
                      </p>
                      <p className={`m-0 text-[13px] font-semibold ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                        {place.category || "장소"}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white">
                        선택됨
                      </span>
                    )}
                  </div>
                  <p className={`mt-3 text-[13px] leading-[1.6] ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                    {place.address}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="rounded-3xl bg-gray-50 px-5 py-8 text-center">
              <p className="mb-2 text-2xl">🔍</p>
              <p className="m-0 mb-1 text-sm font-bold text-gray-500">검색 결과가 없습니다</p>
              <p className="m-0 text-xs text-gray-400">다른 장소명으로 다시 검색해보세요</p>
            </div>
          )}
        </div>
      )}

      {/* Tip 박스 */}
      {!isSearching && !selectedPlace && (
        <div className="mb-7 rounded-[20px] bg-blue-50 px-5 py-[18px]">
          <p className="mb-1.5 text-[13px] font-extrabold text-blue-600">💡 Tip</p>
          <p className="m-0 text-[13px] leading-[1.65] text-blue-800">
            장소명을 입력하기 시작하면 아래에 검색 결과가 표시됩니다.
          </p>
        </div>
      )}

      {/* 선택 완료 안내 */}
      {!isSearching && selectedPlace && (
        <div className="mb-7 rounded-[20px] bg-green-50 px-5 py-[18px]">
          <p className="mb-1.5 text-[13px] font-extrabold text-green-600">✅ 출발지 선택 완료</p>
          <p className="m-0 text-[13px] leading-[1.65] text-green-700">
            다음 버튼을 눌러 약속 장소 추천을 받아보세요.
          </p>
        </div>
      )}

      {/* 다음 버튼 */}
      <div className="mt-auto pt-8">
        <button
          disabled={!selectedPlace}
          onClick={() => navigate(`/recommendation-loading/${meetingId}`)}
          className="h-[54px] w-full rounded-2xl border-0 bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
        >
          다음
        </button>
      </div>
    </PageShell>
  );
}

export default LocationPage;
