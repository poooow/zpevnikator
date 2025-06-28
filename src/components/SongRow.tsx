import { Song } from "../types/song";
import "./SongRow.scss";
import { useNavigate } from "react-router-dom";

interface SongRowProps {
  song: Song;
}

const SongRow: React.FC<SongRowProps> = ({ song }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/song/${song.id}`)} className="song-row">
      <div className="title">{song.title}</div>
      <div className="group-name">{song.groupName}</div>
      <div
        className="snippet"
        dangerouslySetInnerHTML={{ __html: song.snippet || "" }}
      ></div>
    </div>
  );
};

export default SongRow;
