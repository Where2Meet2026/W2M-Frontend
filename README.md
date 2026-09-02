# W2M-Frontend

Where2Meet(W2M) 서비스의 프론트엔드입니다.

---

## 기술 스택

| 구분 | 내용 |
|---|---|
| Language | JavaScript |
| Framework | React 19 |
| Build Tool | Vite |
| Package Manager | npm |
| Styling | Tailwind CSS |
| API Client | fetch (표준 Web API) |
| Routing | React Router |
| Lint | ESLint |

---

## 요구사항

프로젝트를 실행하기 전에 아래 프로그램이 설치되어 있어야 합니다.

- Node.js 20 이상
- npm

설치 여부는 아래 명령어로 확인할 수 있습니다.

```bash
node -v
npm -v
```

---

## 실행 방법

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd W2M-Frontend
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 최상단에 `.env` 파일을 만들고 아래 값을 채웁니다. (팀원에게 실제 값을 공유받으세요)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAO_REST_API_KEY=<카카오 REST API 키>
```

- `VITE_API_BASE_URL`: 요청을 보낼 백엔드 서버 주소
- `VITE_KAKAO_REST_API_KEY`: 카카오 장소 검색(로컬 API)에 사용

`.env` 파일은 개인 로컬 설정 파일이므로 Git에 커밋하지 않습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시되는 주소(기본 `http://localhost:5173`)로 접속합니다.

---

## 주요 명령어

| 명령어 | 설명 |
|---|---|
| `npm install` | 프로젝트에 필요한 라이브러리를 설치합니다. |
| `npm run dev` | 개발 서버를 실행합니다. |
| `npm run build` | 배포용 파일을 생성합니다. |
| `npm run lint` | 코드 스타일 및 문법 문제를 검사합니다. |

---

## 폴더 구조

코드는 화면이 아니라 **기능(도메인) 단위**로 먼저 나뉘고, 그 안에서 다시
화면(`pages`)과 API 호출(`api`)로 나뉩니다. 백엔드의 도메인 패키지 이름과
동일하게 맞춰서, 어떤 화면이 어떤 백엔드 API를 쓰는지 폴더 이름만 보고
알 수 있게 했습니다.

아래 트리에서 실제 존재하는 파일은 이름을 그대로 표기하고, 아직 코드가 없는
스켈레톤 폴더(`.gitkeep`만 존재)는 `(스켈레톤)`으로 표기합니다.

```txt
src/
├─ app/
│  ├─ App.jsx                 최상위 컴포넌트, AppRouter만 렌더링
│  └─ AppRouter.jsx            주소(URL)별로 어떤 화면을 보여줄지 매핑
│
├─ shared/
│  ├─ api/
│  │  └─ client.js             백엔드 요청 공통 처리 (baseURL, 인증 헤더, 에러 처리)
│  └─ components/
│     └─ PageShell.jsx         모든 화면이 공유하는 공통 레이아웃 껍데기
│
├─ features/
│  ├─ auth/                    로그인 · 회원가입 · 카카오 로그인
│  │  ├─ pages/
│  │  │  ├─ MainPage.jsx         로그인/카카오 로그인 진입 화면
│  │  │  ├─ SignupPage.jsx       자체 회원가입 (이메일 인증 포함)
│  │  │  ├─ GuestLoginPage.jsx   초대 수락 전 로그인 유도 화면
│  │  │  └─ KakaoCallbackPage.jsx 카카오 로그인 콜백 처리
│  │  └─ api/                  authApi.js
│  │
│  ├─ meeting/                 모임 생성/조회/삭제, 내 모임 목록, 참여 현황
│  │  ├─ pages/
│  │  │  ├─ HomePage.jsx         홈 (내 방 조회 / 모임 만들기 진입)
│  │  │  ├─ CreateMeetingPage.jsx 모임 생성
│  │  │  ├─ GetRoomPage.jsx      내 모임 목록 (방장/참여자 구분, 방 삭제)
│  │  │  └─ ParticipatePage.jsx  모임 참여 화면 (초대 공유, 다음 단계 진입)
│  │  ├─ components/
│  │  │  └─ RoomItem.jsx         모임 목록의 방 1개 카드
│  │  └─ api/                  meetingApi.js, participantApi.js
│  │
│  ├─ invite/                  초대 링크 공유 및 수락
│  │  └─ pages/
│  │     ├─ InvitePage.jsx       초대 링크 생성 및 공유 (카카오톡/링크 복사)
│  │     └─ AcceptInvitePage.jsx 초대 링크로 접속했을 때 참여 수락 처리
│  │
│  ├─ availability/            가능한 시간대 입력/조회
│  │  ├─ pages/
│  │  │  ├─ TimeSelectionPage.jsx 날짜·시간 선택 (캘린더 + 드래그 선택)
│  │  │  └─ TimeWaitingPage.jsx  전원 시간 입력 완료 대기 (폴링)
│  │  └─ api/                  availabilityApi.js
│  │
│  ├─ recommendation/          공통 시간대 추천 및 확정
│  │  ├─ pages/
│  │  │  └─ RecommendationPage.jsx 추천 시간 목록 표시 및 방장 확정
│  │  └─ api/                  recommendationApi.js
│  │
│  ├─ location/                출발 위치 검색/저장 (카카오 장소 검색)
│  │  ├─ pages/
│  │  │  └─ LocationPage.jsx     시간 확정 이후 출발 위치 1회 입력
│  │  └─ api/                  locationApi.js
│  │
│  ├─ candidate/ (스켈레톤)     장소 후보 3개 비교 + 좋아요·싫어요 반응 (미구현)
│  │  ├─ pages/                예정: CandidatePage.jsx
│  │  └─ api/                  예정: candidateApi.js
│  │
│  ├─ vote/ (스켈레톤)          최종 투표 + 최종 확정 결과 화면 (미구현)
│  │  ├─ pages/                예정: ResultPage.jsx
│  │  └─ api/                  예정: voteApi.js (CandidatePage에서 가져다 씀)
│  │
│  ├─ review/ (스켈레톤)        확정 장소 후기 작성/조회, 익명 (미구현)
│  │  ├─ pages/
│  │  └─ api/
│  │
│  └─ notification/ (스켈레톤)  Web Push 구독 등록/해제 (미구현)
│     ├─ pages/
│     └─ api/
│
├─ main.jsx                    앱이 실행되는 진짜 시작점
└─ index.css                   전역 스타일
```

새 화면을 추가할 때는, 기존 기능에 속하면 그 폴더 안에 페이지를 추가하고,
새로운 개념이면 `features` 아래에 폴더를 새로 만들어 `pages/`, `api/`
구조를 그대로 따릅니다.

```txt
features
├─ candidate
│  ├─ pages/     여기에 화면 컴포넌트 추가
│  └─ api/       여기에 fetch 호출 함수 추가
```

여러 기능에서 같이 쓰는 컴포넌트가 생기면 `shared/components`에 둡니다.

---

## 화면 공통 레이아웃

모든 화면은 배경색 위에 흰 카드가 폰 화면처럼 떠 있는 구조를 공유합니다.
이 껍데기를 페이지마다 따로 만들지 않고 `shared/components/PageShell.jsx`
하나로 통일했습니다.

```jsx
import PageShell from "../../../shared/components/PageShell";

function SomePage() {
  return (
    <PageShell className="flex flex-col overflow-y-auto px-6 py-10">
      {/* 화면 내용 */}
    </PageShell>
  );
}
```

- `className`으로 페이지마다 다른 정렬/스크롤 방식을 지정합니다 (기본값
  `"flex flex-col px-6 py-10"`이라 대부분의 화면은 안 넘겨도 됩니다).
- 바깥 배경색, 카드 너비 등 공통 스타일은 `PageShell.jsx` 한 곳만 고치면
  모든 화면에 한 번에 적용됩니다.

---

## API 통신 구조

`shared/api/client.js`에 baseURL, 인증 토큰 첨부, 에러 처리를 한 번만
정의해두고, 각 기능의 `api/*.js`는 이 client를 가져다 엔드포인트별
함수만 짧게 작성합니다.

```js
// shared/api/client.js
export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
```

```js
// features/meeting/api/meetingApi.js
import { apiClient } from "../../../shared/api/client";

export const getMeetingDetails = (meetingId) =>
  apiClient.get(`/api/meetings/${meetingId}`);
```

토큰 첨부나 에러 처리를 함수마다 반복할 필요가 없고, "토큰 만료 시 자동
로그아웃" 같은 공통 로직이 필요해지면 `client.js` 한 곳만 고치면 됩니다.

카카오 로컬 API처럼 우리 백엔드가 아닌 외부 API를 부르는 `locationApi.js`는
이 client 대상이 아니라 별도로 fetch를 직접 호출합니다.

한 기능의 데이터를 다른 기능 화면에서도 써야 할 때는(예: 초대 화면에서
모임 정보를 보여줄 때), 그 데이터를 소유한 기능의 api를 그대로 가져다
씁니다.

```js
// features/invite/pages/InvitePage.jsx
import { getMeetingDetails } from "../../meeting/api/meetingApi";
```

---

## 환경변수

| 이름 | 설명 | 예시 |
|---|---|---|
| `VITE_API_BASE_URL` | 백엔드 API 서버 주소 | `http://localhost:8080` |
| `VITE_KAKAO_REST_API_KEY` | 카카오 장소 검색 API 키 | - |

Vite에서 브라우저 코드에 노출되는 환경변수는 반드시 `VITE_`로 시작해야 합니다.

---

## 브랜치 전략

| 브랜치 | 용도 |
|---|---|
| `main` | 배포 가능한 안정 버전 |
| `dev` | 개발 통합 브랜치 |
| `feature/*` | 기능 개발 브랜치 |
| `fix/*` | 버그 수정 브랜치 |

작업은 `dev` 브랜치에서 새 브랜치를 만들어 진행합니다.

```bash
git checkout dev
git checkout -b feature/location
```

작업 완료 후 GitHub에서 Pull Request를 생성하고, 리뷰 후 `dev` 브랜치에 병합합니다.

---

## 커밋 메시지 예시

| 타입 | 설명 | 예시 |
|---|---|---|
| `init` | 프로젝트 초기 설정 | `init: project setup` |
| `feat` | 새로운 기능 추가 | `feat: add location save page` |
| `fix` | 버그 수정 | `fix: handle login error` |
| `docs` | 문서 수정 | `docs: update README` |
| `style` | 스타일 수정 | `style: update button layout` |
| `refactor` | 코드 구조 개선 | `refactor: split meeting api by domain` |

---

## Git에 올리지 않는 파일

```txt
node_modules
dist
.env
```

- `node_modules`: 설치된 라이브러리 폴더입니다. `npm install`로 다시 생성할 수 있습니다.
- `dist`: 빌드 결과물 폴더입니다. `npm run build`로 다시 생성할 수 있습니다.
- `.env`: 개인 로컬 환경변수 파일입니다.
