import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ParticipatePage from "../pages/ParticipatePage";
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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;