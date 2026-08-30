import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../features/auth/pages/MainPage";
import SignupPage from "../features/auth/pages/SignupPage";
import GuestLoginPage from "../features/auth/pages/GuestLoginPage";
import KakaoCallbackPage from "../features/auth/pages/KakaoCallbackPage";
import CreateMeetingPage from "../features/meeting/pages/CreateMeetingPage";
import ParticipatePage from "../features/meeting/pages/ParticipatePage";
import HomePage from "../features/meeting/pages/HomePage";
import GetRoomPage from "../features/meeting/pages/GetRoomPage";
import InvitePage from "../features/invite/pages/InvitePage";
import AcceptInvitePage from "../features/invite/pages/AcceptInvitePage";
import TimeSelectionPage from "../features/availability/pages/TimeSelectionPage";
import TimeWaitingPage from "../features/availability/pages/TimeWaitingPage";
import RecommendationPage from "../features/recommendation/pages/RecommendationPage";
import LocationPage from "../features/location/pages/LocationPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/get-room" element={<GetRoomPage />} /> {/* 추가 */}
        <Route path="/create-meeting" element={<CreateMeetingPage />} />
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
