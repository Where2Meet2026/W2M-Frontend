import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const isNew = params.get("isNew");

    if (token) {
      // 기존 유저: 토큰 저장 후 로그인 처리
      localStorage.setItem("token", token);
      
      const targetPath = localStorage.getItem("returnUrl");
      console.log("KakaoCallback: 확보된 targetPath ->", targetPath);

      alert("카카오 로그인 성공!");
      
      if (targetPath) {
        // [수정] 여기서 지우지 않고 이동만 함. 목적지인 AcceptInvitePage에서 지워야 레이스 컨디션을 방지함.
        navigate(targetPath);
      } else {
        navigate("/home");
      }
    } else if (isNew === "true") {
      // 신규 유저: 정보 추출 후 회원가입 페이지로 유도
      const email = params.get("email");
      const name = params.get("name");
      alert("신규 소셜 계정입니다. 추가 정보를 입력해주세요.");
      // 회원가입 페이지로 이동할 때 이메일과 이름을 넘겨줄 수 있습니다.
      navigate("/signup", { state: { email, name, isSocial: true } });
    } else {
      // 에러 상황
      alert("로그인 처리 중 오류가 발생했습니다.");
      navigate("/");
    }
  }, [navigate, location]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div>카카오 로그인 처리 중...</div>
    </div>
  );
}

export default KakaoCallbackPage;
