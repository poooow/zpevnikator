import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSong } from "../service/songService";
import { Song } from "../types/song";
import { useDatabaseContext } from "../context/useDatabaseContext";
import "./SongPage.scss";
import SongBar from "../components/SongBar";
import LoadingSpinner from "../components/LoadingSpinner";
import SongText from "../components/SongText";

const SongPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { db } = useDatabaseContext();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    if (!id || !db) {
      return;
    }
    const result = getSong(id, db);
    setSong(result);
  }, [id, db]);

  if (!song) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="song-page">
      <SongBar song={song} />
      <SongText songText={song.text} />
    </div>
  );
};

export default SongPage;
