import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { searchPlacesByKeyword } from "../api/locationApi";

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
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", justifyContent: "center" }}>
      <main style={{
        display: "flex",
        minHeight: "100vh",
        width: "390px",
        flexDirection: "column",
        background: "white",
        padding: "40px 24px 40px",
        color: "#191f28",
      }}>

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#f3f4f6", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", marginBottom: 40, flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#3b82f6", letterSpacing: "0.5px", marginBottom: 10 }}>
            WHERE2MEET
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.25, margin: "0 0 10px" }}>
            출발 위치를 입력해주세요
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            약속 장소를 추천받기 위해 출발할 위치를 선택해 주세요.
          </p>
        </div>

        {/* 선택된 장소 카드 */}
        <section style={{
          background: "#f9fafb",
          borderRadius: 24,
          padding: "22px 20px",
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", margin: 0 }}>현재 선택 위치</p>
            {selectedPlace && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{
                  background: "#dbeafe", color: "#2563eb",
                  fontSize: 11, fontWeight: 800,
                  padding: "4px 12px", borderRadius: 999,
                }}>선택 완료</span>
                <button
                  onClick={handleClearSelection}
                  style={{
                    background: "#e5e7eb", color: "#6b7280",
                    fontSize: 11, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 999,
                    border: "none", cursor: "pointer",
                  }}
                >초기화</button>
              </div>
            )}
          </div>

          {selectedPlace ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                <p style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{selectedPlace.name}</p>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                {selectedPlace.address}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#9ca3af", margin: 0 }}>
                아직 선택된 위치가 없습니다.
              </p>
            </div>
          )}
        </section>

        {/* 검색 입력 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>
            출발지 검색
          </label>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)" }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="장소명을 입력하세요"
              style={{
                height: 54, width: "100%", borderRadius: 16,
                border: "1.5px solid #e5e7eb", background: "white",
                padding: "0 48px 0 48px", fontSize: 15, fontWeight: 500,
                outline: "none", boxSizing: "border-box", color: "#191f28",
                fontFamily: "inherit",
              }}
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  width: 24, height: 24, borderRadius: "50%",
                  background: "#e5e7eb", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
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
          <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            {isLoading ? (
              <div style={{ borderRadius: 24, background: "#f9fafb", padding: "32px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", margin: 0 }}>장소를 검색하고 있어요...</p>
              </div>
            ) : errorMessage ? (
              <div style={{ borderRadius: 24, background: "#fef2f2", padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: 0 }}>{errorMessage}</p>
              </div>
            ) : places.length > 0 ? (
              places.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    style={{
                      width: "100%", borderRadius: 24,
                      border: isSelected ? "1.5px solid #3b82f6" : "1.5px solid #f3f4f6",
                      background: isSelected ? "#3b82f6" : "white",
                      padding: "20px", textAlign: "left", cursor: "pointer",
                      boxShadow: isSelected ? "0 8px 24px rgba(59,130,246,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 17, fontWeight: 800, color: isSelected ? "white" : "#191f28", margin: "0 0 4px" }}>
                          {place.name}
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "rgba(255,255,255,0.7)" : "#9ca3af", margin: 0 }}>
                          {place.category || "장소"}
                        </p>
                      </div>
                      {isSelected && (
                        <span style={{
                          background: "rgba(255,255,255,0.2)", color: "white",
                          fontSize: 11, fontWeight: 700,
                          padding: "4px 10px", borderRadius: 999, flexShrink: 0,
                        }}>선택됨</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, marginTop: 12, lineHeight: 1.6, color: isSelected ? "rgba(255,255,255,0.8)" : "#6b7280" }}>
                      {place.address}
                    </p>
                  </button>
                );
              })
            ) : (
              <div style={{ borderRadius: 24, background: "#f9fafb", padding: "32px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>🔍</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", margin: "0 0 4px" }}>검색 결과가 없습니다</p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>다른 장소명으로 다시 검색해보세요</p>
              </div>
            )}
          </div>
        )}

        {/* Tip 박스 */}
        {!isSearching && !selectedPlace && (
          <div style={{ background: "#eff6ff", borderRadius: 20, padding: "18px 20px", marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", margin: "0 0 6px" }}>💡 Tip</p>
            <p style={{ fontSize: 13, color: "#1e40af", lineHeight: 1.65, margin: 0 }}>
              장소명을 입력하기 시작하면 아래에 검색 결과가 표시됩니다.
            </p>
          </div>
        )}

        {/* 선택 완료 안내 */}
        {!isSearching && selectedPlace && (
          <div style={{ background: "#f0fdf4", borderRadius: 20, padding: "18px 20px", marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", margin: "0 0 6px" }}>✅ 출발지 선택 완료</p>
            <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.65, margin: 0 }}>
              다음 버튼을 눌러 약속 장소 추천을 받아보세요.
            </p>
          </div>
        )}

        {/* 다음 버튼 */}
        <div style={{ marginTop: "auto", paddingTop: 32 }}>
          <button
            disabled={!selectedPlace}
            onClick={() => navigate(`/recommendation-loading/${meetingId}`)}
            style={{
              height: 54, width: "100%", borderRadius: 16, border: "none",
              background: selectedPlace ? "#3b82f6" : "#e5e7eb",
              color: selectedPlace ? "white" : "#9ca3af",
              fontSize: 16, fontWeight: 800, cursor: selectedPlace ? "pointer" : "default",
              transition: "all 0.15s",
            }}
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}

export default LocationPage;