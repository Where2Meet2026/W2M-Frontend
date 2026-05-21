import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ParticipatePage from "../pages/ParticipatePage";
import KakaoCallbackPage from "../pages/KakaoCallbackPage"; // 추가

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/kakao-callback" element={<KakaoCallbackPage />} /> {/* 추가 */}
        <Route path="/participate/:meetingId" element={<ParticipatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;