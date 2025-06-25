import { Song } from "../types/song";
import "./SongRow.scss";

interface SongRowProps {
  song: Song;
}

const SongRow: React.FC<SongRowProps> = ({ song }) => {
  return (
    <div
      onClick={() => (window.location.href = `/song/${song.id}`)}
      className="song-row"
    >
      <div className="title">{song.title}</div>
      <div className="group-name">{song.groupName}</div>
      <div className="snippet" dangerouslySetInnerHTML={{ __html: song.snippet || "" }}></div>
    </div>
  );
};

export default SongRow;
