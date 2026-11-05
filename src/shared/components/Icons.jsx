const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ChevronLeftIcon = ({ size = 18, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const HomeIcon = ({ size = 18, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5" />
  </svg>
);

export const BellIcon =({ size = 22, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 003.4 0" />
  </svg>
);

export const StarIcon = ({ size = 22, filled = false, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base} fill={filled ? "currentColor" : "none"}>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
  </svg>
);

export const CheckCircleIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.8" />
  </svg>
);

export const CoffeeIcon = ({ size = 28, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M17 8h1a4 4 0 010 8h-1" />
    <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4z" />
    <path d="M6 2v2M10 2v2M14 2v2" />
  </svg>
);

export const UtensilsIcon = ({ size = 28, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M3 2v7a2 2 0 002 2h4a2 2 0 002-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 00-5 5v6a2 2 0 002 2h3zm0 0v7" />
  </svg>
);

export const MapPinIcon = ({ size = 28, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={strokeWidth} {...base}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// 카카오 로그인 버튼용 말풍선 심볼 (카카오 로그인 디자인 가이드의 검정 말풍선 모양을 단순하게 그린 것)
export const KakaoSymbolIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.86 5.33 4.66 6.74l-.95 3.48c-.08.3.26.54.52.37l4.13-2.74c.54.06 1.08.1 1.64.1 5.52 0 10-3.58 10-8S17.52 3 12 3z"
    />
  </svg>
);

export const EditIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} {...base}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);
