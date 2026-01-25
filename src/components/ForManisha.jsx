import { useEffect, useRef, useState } from "react";
import ImageSlider from "../components/common/ImageSlider";
import musicFile from "../assets/music.mp3";
import Page2Slider from "../components/common/Page2Slider";
import CurtainIntro from "./CurtainIntro";

const ForManisha = () => {
  const effectsRef = useRef(null);
  const musicRef = useRef(null);

  const [page, setPage] = useState(1);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [showBtn, setShowBtn] = useState(false);
  const [showStory, setShowStory] = useState(false);

  /* COUNTDOWN */
  useEffect(() => {
    const target = new Date("2026-01-18T00:00:00").getTime();
    let blasted = false;

    const timer = setInterval(() => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        setShowBtn(true);
        if (!blasted) {
          blasted = true;
          blast();
        }
        return;
      }

      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const heartRain = () => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "💖";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";

    effectsRef.current.appendChild(heart);

    setTimeout(() => heart.remove(), 8000);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      heartRain();
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (page === 2) {
      setShowStory(false);
      const t = setTimeout(() => setShowStory(true), 500);
      return () => clearTimeout(t);
    }
  }, [page]);

  /* 🎵 Curtain open hone ke baad music start */
  useEffect(() => {
    if (!curtainOpen) return;

    const audio = musicRef.current;
    if (!audio) return;

    audio.play().then(() => setPlaying(true));
  }, [curtainOpen]);

  const blast = () => {
    for (let i = 0; i < 120; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = `hsl(${Math.random() * 360},90%,65%)`;
      c.style.animationDuration = 3 + Math.random() * 3 + "s";
      effectsRef.current.appendChild(c);
      setTimeout(() => c.remove(), 8000);
    }
  };

  const toggleMusic = () => {
    const audio = musicRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="min-h-screen py-3 bg-gradient-to-br from-pink-300 to-purple-400 text-white overflow-x-hidden relative">
      {!curtainOpen && <CurtainIntro onOpen={() => setCurtainOpen(true)} />}

      <style>{`
        .heart { position:absolute; bottom:-30px; font-size:30px; animation: floatUp linear forwards; }
        .confetti { position:absolute; top:-10px; width:8px; height:14px; animation: fall linear forwards; }
        @keyframes floatUp { to { transform: translateY(-110vh) scale(1.5); opacity: 0; } }
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
      `}</style>

      <div ref={effectsRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* 🎵 audio */}
      <audio ref={musicRef} src={musicFile} loop />

      {/* 🎵 music button */}
      <button
        onClick={toggleMusic}
        className={`fixed bottom-4 right-4 px-6 py-3 rounded-full font-semibold z-50 ${
          playing ? "bg-pink-200 text-pink-700" : "bg-white text-pink-600"
        }`}
      >
        {playing ? "⏸️" : "🎵"}
      </button>

      {page === 1 && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center z-10">
          <ImageSlider />

          <h1 className="text-5xl font-bold mb-2">PRATYUSH 😎</h1>
          <p className="opacity-90 mb-6">Something special is coming…</p>

          <div className="flex gap-4 flex-wrap justify-center">
            {Object.entries(time).map(([k, v]) => (
              <div
                key={k}
                className="bg-white/30 backdrop-blur px-6 py-4 rounded-xl text-xl font-semibold animate-pulse"
              >
                {v}
                <span className="block text-xs mt-1 opacity-80">
                  {k.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {showBtn && (
            <button
              onClick={() => setPage(2)}
              className="mt-8 px-10 py-4 rounded-full bg-white text-pink-600 font-semibold"
            >
              Go to Next Page 💖
            </button>
          )}
        </div>
      )}

      {page === 2 && (
        <div className="min-h-screen flex items-center justify-center px-4 z-10">
          <Page2Slider showStory={showStory} />
        </div>
      )}
    </div>
  );
};

export default ForManisha;
