import React from "react";

import { useNavigate } from "react-router-dom";

// this is the latest app for anuj

const VideoCollage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white">
      {/* ✨ Overlay Text */}
      <div className="fixed top-6 left-8 text-3xl font-bold drop-shadow-lg z-20">
        💖 Our Beautiful Moments 💖
      </div>

      <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md bg-black/30 border border-white/20 p-6">
        {/* 🎥 Video */}
        <video
          src= '/collage.mp4'
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-h-[70vh] object-contain rounded-2xl shadow-lg bg-black"
        />

        {/* 🎊 Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 text-lg font-semibold shadow-xl hover:scale-105"
          >
            Home Page 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCollage;
