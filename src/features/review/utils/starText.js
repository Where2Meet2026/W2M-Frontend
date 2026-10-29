// "★★★★☆" 텍스트 표기 (목록 카드, 평균)
export const starText = (rating) => {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(n) + "☆".repeat(5 - n);
};
