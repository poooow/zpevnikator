import LikedBar from "../components/LikedBar";
import SongRow from "../components/SongRow";
import { getLikedSongs } from "../service/songService";
import { useAppSettings } from "../context/AppSettingsContext";
import { useDatabaseContext } from "../context/useDatabaseContext";
import "./Liked.scss";

const Liked: React.FC = () => {
  const { liked } = useAppSettings();
  const { db } = useDatabaseContext();

  if (!db) return null;
  const likedSongs = getLikedSongs(liked, db);

  return (
    <div className="liked">
      <LikedBar />
      <div className="song-container">
        {likedSongs?.map((song) => (
          <SongRow key={song.id} song={song} />
        ))}
        {likedSongs?.length === 0 && (
          <div className="no-results">
            <p>Nic tu není. Písničku sem přidáš líbíkem v menu. </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;
