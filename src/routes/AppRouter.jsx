import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ParticipatePage from "../pages/ParticipatePage";
import InvitePage from "../pages/InvitePage"; // 추가
import AcceptInvitePage from "../pages/AcceptInvitePage"; // 추가
import GuestLoginPage from "../pages/GuestLoginPage"; // 추가
import TimeSelectionPage from "../pages/TimeSelectionPage"; // 추가
import TimeWaitingPage from "../pages/TimeWaitingPage"; // 추가
import RecommendationPage from "../pages/RecommendationPage"; // 추가
import KakaoCallbackPage from "../pages/KakaoCallbackPage";
import HomePage from "../pages/HomePage";
import GetRoomPage from "../pages/GetRoomPage"; // 추가
import LocationPage from "../pages/LocationPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/get-room" element={<GetRoomPage />} /> {/* 추가 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/kakao-callback" element={<KakaoCallbackPage />} />
        <Route path="/participate/:meetingId" element={<ParticipatePage />} />
        <Route path="/location/:meetingId" element ={<LocationPage/>} />
        <Route path="/invite/:meetingId" element={<InvitePage />} /> {/* 추가 */}
        <Route path="/invite/accept/:inviteCode" element={<AcceptInvitePage />} /> {/* 추가 */}
        <Route path="/invite/login/:inviteCode" element={<GuestLoginPage />} /> {/* 추가 */}
        <Route path="/time-selection/:meetingId" element={<TimeSelectionPage />} /> {/* 추가 */}
        <Route path="/time-waiting/:meetingId" element={<TimeWaitingPage />} /> {/* 추가 */}
        <Route path="/recommendation/:meetingId" element={<RecommendationPage />} /> {/* 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;