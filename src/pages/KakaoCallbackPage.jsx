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
      alert("카카오 로그인 성공!");
      navigate("/home"); // HomePage로 이동
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
