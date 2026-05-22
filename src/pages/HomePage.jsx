import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        {/* 중앙 버튼 영역 */}
        <div className="home-button-group">
          <button 
            className="home-btn" 
            onClick={() => navigate("/get-room")}
          >
            내 방 조회
          </button>
          
          <button 
            className="home-btn" 
            onClick={() => navigate("/login")}
          >
            모임 만들기
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
