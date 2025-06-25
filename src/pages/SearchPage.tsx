import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SongRow from "../components/SongRow";
import { searchSongs } from "../service/songService";
import { Song } from "../types/song";
import { useDatabaseContext } from "../context/useDatabaseContext";
import "./SearchPage.scss";
import IconArrowUp from "../assets/images/icon_arrow_up";
import Giraffe from "../assets/images/giraffe";

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Song[] | null>(null);

  const { db } = useDatabaseContext();

  const handleSearch = (query: string) => {
    if (!db) {
      console.error("Database is not initialized");
      return;
    }
    const result = searchSongs(query, db);
    setSearchResults(result);
  };

  return (
    <div className="search-page">
      <SearchBar onSearch={handleSearch} />
      <div className="song-container">
        {searchResults?.map((song) => (
          <SongRow key={song.id} song={song} />
        ))}
      </div>
      {searchResults === null && (
        <div className="start-search">
          <div className="arrow">
            <IconArrowUp width="6rem" height="6rem" />
            <p>Můžete začít hledat</p>
          </div>
          <div className="giraffe">
            <Giraffe />
          </div>
        </div>
      )}
      {searchResults?.length === 0 && (
        <div className="no-results">
          <p>
            Nebyly nalezeny
            <br /> žádné písničky
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
