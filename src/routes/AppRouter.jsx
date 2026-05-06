import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../pages/MainPage";
import SignupPage from "../pages/SignupPage";
import CreateMeetingPage from "../pages/CreateMeetingPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/meetings/create" element={<CreateMeetingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;