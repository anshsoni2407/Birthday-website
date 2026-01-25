import { useRef } from "react";
import musicFile from "../assets/music.mp3";

const CurtainIntro = ({ onOpen }) => {
  const audioRef = useRef(null);

  const handleOpen = () => {
    audioRef.current.play(); // start music on click
    onOpen();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      <audio ref={audioRef} src={musicFile} loop />

      {/* LEFT CURTAIN */}
      <div
        className="
          absolute top-0 left-0 h-full w-1/2
          bg-gradient-to-r from-red-950 via-red-800 to-red-600
          shadow-[inset_-15px_0_30px_rgba(0,0,0,0.6)]
        "
      />

      {/* RIGHT CURTAIN */}
      <div
        className="
          absolute top-0 right-0 h-full w-1/2
          bg-gradient-to-l from-red-950 via-red-800 to-red-600
          shadow-[inset_15px_0_30px_rgba(0,0,0,0.6)]
        "
      />

      {/* CENTER SPLIT LINE */}
      <div className="absolute left-1/2 top-0 h-full w-[3px] bg-black/40" />

      {/* BUTTON */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={handleOpen}
          className="
            px-10 py-4
            bg-white text-red-700 font-bold
            rounded-full
            animate-pulse
            shadow-[0_0_30px_rgba(255,255,255,0.7)]
          "
        >
          🎭 Open Curtains 🎵
        </button>
      </div>
    </div>
  );
};

export default CurtainIntro;
