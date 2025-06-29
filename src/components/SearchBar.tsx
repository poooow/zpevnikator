import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/useTheme";
import { FaHeart, FaEllipsisV, FaMoon, FaSun } from "react-icons/fa";
import "./SearchBar.scss";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const menuRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value);
    onSearch(event.target.value);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action: string) => {
    switch (action) {
      case "Dark Mode":
        toggleTheme();
        setIsMenuOpen(false);
        break;
      case "Like":
        navigate("/liked");
        break;
    }
  };

  return (
    <div className="search-bar" ref={menuRef}>
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
