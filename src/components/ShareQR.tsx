import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./ShareQR.scss";

interface ShareQRProps {
  songId: number;
  onClose: () => void;
}

const ShareQR = ({ songId, onClose }: ShareQRProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.origin;
  const songUrl = `${appDomain}/song/${songId}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="share-qr-backdrop">
      <div className="share-qr-container" ref={modalRef}>
        <QRCodeSVG value={songUrl} size={250} level="H" className="qr-code"/>
        <p className="share-url">{songUrl}</p>
      </div>
    </div>
  );
};

export default ShareQR;
