import BtnArrowBack from "../assets/images/btn_arrow_back";
import "./LikedBar.scss";

const LikedBar: React.FC = () => {
  return (
    <div className="liked-bar" onClick={() => window.history.back()}>
      <BtnArrowBack width="2rem" height="2rem" />
      <span className="title">Oblíbené</span>
    </div>
  );
};

export default LikedBar;
