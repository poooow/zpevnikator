import React, { useState } from "react";
import { useTheme } from "../context/useTheme";
import { FaHeart, FaEllipsisV, FaMoon, FaSun } from "react-icons/fa";
import "./SearchBar.scss";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value);
    onSearch(event.target.value);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "Dark Mode":
        toggleTheme();
        setIsMenuOpen(false);
        break;
      case "Like":
        window.location.href = "/liked";
        break;
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Hledat autora, písničku, nebo část textu ..."
        value={searchPhrase}
        onChange={handleChange}
        className="input"
      />
      <div className="menu-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          <FaEllipsisV />
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown">
            <button
              className="menu-item"
              onClick={() => handleAction("Dark Mode")}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              <span>Noční režim</span>
            </button>
            <button className="menu-item" onClick={() => handleAction("Like")}>
              <FaHeart />
              <span>Oblíbené</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
