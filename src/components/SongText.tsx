import "./SongText.scss";
import { useState, useMemo } from "react";
import transpose from "../helpers/transpose";
import { useAppSettings } from "../context/AppSettingsContext";

interface SongTextProps {
  songText: string;
}

const SongText: React.FC<SongTextProps> = ({ songText }) => {
  const { transposition } = useAppSettings();
  const [formattedText, setFormattedText] = useState("");

  useMemo(() => {
    const transposeHTML = (_: string, chord: string) => {
      return `<span class="chord">${transpose(chord, transposition)}</span>`;
    };

    const formatted = songText
      .replace(/(.+)/g, '<div class="row">$1&nbsp;</div>')
      .replace(
        /\[([a-zA-Z0-9_#+-/()]{2}\])(.{1,2})(\[[a-zA-Z0-9_#+-/()]+)\]/g,
        "[$1$3]$2"
      )
      .replace(
        /\[([a-zA-Z0-9_#+-/()]{3}\])(.{1,3})(\[[a-zA-Z0-9_#+-/()]+)\]/g,
        "[$1$3]$2"
      )
      .replace(
        /\[([a-zA-Z0-9_#+-/()]{4}\])(.{1,4})(\[[a-zA-Z0-9_#+-/()]+)\]/g,
        "[$1$3]$2"
      )
      .replace(
        /\[([a-zA-Z0-9_#+-/()]{5}\])(.{1,5})(\[[a-zA-Z0-9_#+-/()]+)\]/g,
        "[$1$3]$2"
      )
      .replace(/\[([a-zA-Z0-9_#+-/()\s]+)\]/g, transposeHTML)
      .replace(/<\/span>\s*<span class="chord">/g, " ")
      .replace(/(?:\r\n|\r|\n)/g, "\n")
      .replace(
        /(\.|=)(R[0-9]{0,2}|Ref|Rf|\*|[0-9]{1,2})(\.:|\.|:)/g,
        '<span class="verseNumber">$2</span>'
      );

    setFormattedText(formatted);
  }, [songText, transposition]);

  return (
    <div
      className="song-text"
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  );
};

export default SongText;
