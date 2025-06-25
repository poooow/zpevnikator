import React, { useState, useRef, useEffect } from "react";
import "./SongBar.scss";
import { Song } from "../types/song";
import BtnArrowBack from "../assets/images/btn_arrow_back";
import {
  FaChevronUp,
  FaChevronDown,
  FaHeart,
  FaShareAlt,
  FaEllipsisV,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useAppSettings } from "../context/AppSettingsContext";
import ShareQR from "./ShareQR";
import { useTheme } from "../context/useTheme";

interface SongBarProps {
  song: Song;
}

const SongBar: React.FC<SongBarProps> = ({ song }: SongBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const {
    setTranspositionDown,
    setTranspositionUp,
    isLiked,
    addLiked,
    removeLiked,
    resetTransposition,
    transposition,
  } = useAppSettings();
  const { theme, toggleTheme } = useTheme();

  const menuRef = useRef<HTMLDivElement>(null);

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
      case "Transpose Down":
        setTranspositionDown();
        break;
      case "Transpose Up":
        setTranspositionUp();
        break;
      case "Reset Transposition":
        resetTransposition();
        break;
      case "Dark Mode":
        toggleTheme();
        setIsMenuOpen(false);
        break;
      case "Like":
        if (isLiked(song.id)) {
          removeLiked(song.id);
        } else {
          addLiked(song.id);
        }
        setTimeout(() => setIsMenuOpen(false), 200);
        break;
      case "Share":
        setIsShareOpen(true);
        setIsMenuOpen(false);
        break;
    }
  };

  const handleGoBack = () => {
    resetTransposition();
    window.history.back();
  };

  return (
    <div className="song-bar" ref={menuRef}>
      <div onClick={handleGoBack} className="arrow-back">
        <BtnArrowBack width="2rem" height="2rem" />
      </div>
      <div className="song-details">
        <div className="title">{song.title}</div>
        <div className="group-name">{song.groupName}</div>
      </div>
      <div className="menu-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          <FaEllipsisV />
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown">
            <div className="menu-item">
              Transpozice:
              <div className="transposition-buttons">
                <button
                  className="transposition-button"
                  onClick={() => handleAction("Transpose Up")}
                >
                  <FaChevronUp color={transposition >= 12 ? "#aaa" : "#000"} />
                </button>
                <button
                  className="transposition-button-number"
                  onClick={() => handleAction("Reset Transposition")}
                >
                  {transposition > 0 ? `+${transposition}` : transposition}
                </button>
                <button
                  className="transposition-button"
                  onClick={() => handleAction("Transpose Down")}
                >
                  <FaChevronDown
                    color={transposition <= -12 ? "#aaa" : "#000"}
                  />
                </button>
              </div>
            </div>
            <button
              className="menu-item"
              onClick={() => handleAction("Dark Mode")}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              <span>Noční režim</span>
            </button>
            <button
              className={`${isLiked(song.id) ? "liked" : "inherit"} menu-item`}
              onClick={() => handleAction("Like")}
            >
              <FaHeart />
              <span>{isLiked(song.id) ? "Nelíbí" : "Líbí"}</span>
            </button>
            <button className="menu-item" onClick={() => handleAction("Share")}>
              <FaShareAlt />
              <span>Sdílet</span>
            </button>
          </div>
        )}
      </div>
      {isShareOpen && (
        <ShareQR songId={song.id} onClose={() => setIsShareOpen(false)} />
      )}
    </div>
  );
};

export default SongBar;
