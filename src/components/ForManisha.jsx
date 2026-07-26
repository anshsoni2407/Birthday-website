import { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from "react";
import ImageSlider from "../components/common/ImageSlider";
import musicFile from "../assets/music.mp3";
import CurtainIntro from "./CurtainIntro";
import bgPhone from "../assets/Anuj/bgPhone.png";
import { motion } from "framer-motion";

/* Lazy load Page2Slider – not needed until user navigates to page 2 */
const Page2Slider = lazy(() => import("../components/common/Page2Slider"));

/* ---------- Emoji arrays – kept separate per user requirement ---------- */
const EmojiForBG = [
  "❤️", "💖", "💕", "💗", "💓", "💞",
  "💝", "🩷", "🌸", "🌺", "🦋", "🎀",
];
const EmojiForBlast = [
  "💖", "💝", "🥰", "✨", "⭐", "🌟",
  "💫", "🌸", "🌺", "💐", "🦋", "🎉", "🎊",
];

/* ---------- CSS for heart rain – extracted to a constant to avoid re-creation ---------- */
const HEART_STYLE = `
  .heart {
    position: absolute;
    bottom: -30px;
    font-size: 30px;
    will-change: transform, opacity;
    contain: layout style paint;
    animation: floatUp linear forwards;
  }
  @keyframes floatUp {
    to {
      transform: translate3d(0, -110vh, 0) scale(1.5);
      opacity: 0;
    }
  }
`;

/**
 * Pre-generate blast emoji data once (not on every trigger).
 * Returns a function that generates the array so each trigger gets new random values.
 */
function generateBlastEmojis() {
  const total = 80; // reduced from 251 for performance
  const arr = [];
  const vh = window.innerHeight;
  for (let i = 0; i < total; i++) {
    const char = EmojiForBlast[Math.floor(Math.random() * EmojiForBlast.length)];
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -30 : 30;
    const startY = -30;
    const driftX = (Math.random() - 0.5) * 200;
    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 2.5;
    const size = 16 + Math.random() * 24;
    const opacity = 0.6 + Math.random() * 0.4;
    const rotateStart = Math.random() * 360;
    const rotateEnd = rotateStart + (Math.random() * 720 - 360);

    arr.push({
      id: i,
      char,
      fromLeft,
      startX,
      startY,
      driftX,
      duration,
      delay,
      size,
      opacity,
      rotateStart,
      rotateEnd,
      endY: vh + 200,
      // Pre-compute style object to avoid re-creation in render
      style: {
        fontSize: `${size}px`,
        opacity,
        position: "absolute",
        left: fromLeft ? 0 : "auto",
        right: fromLeft ? "auto" : 0,
        top: startY,
        willChange: "transform, opacity",
        contain: "layout style paint",
      },
    });
  }
  return arr;
}

/**
 * EmojiBlast – renders a burst of emojis from the top left & right corners.
 * Optimized: reduced count, pre-computed styles, will-change hints, contain.
 */
function EmojiBlast({ trigger }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    setEmojis(generateBlastEmojis());
    // Cleanup after longest possible animation (duration 4s + delay 2.5s + buffer)
    const timer = setTimeout(() => setEmojis([]), 7000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (emojis.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9000]" style={{ contain: "layout style paint" }}>
      {emojis.map((e) => (
        <motion.div
          key={e.id}
          className="select-none"
          style={e.style}
          initial={{ x: e.startX, y: e.startY, rotate: e.rotateStart }}
          animate={{
            x: e.startX + e.driftX,
            y: e.endY,
            rotate: e.rotateEnd,
            opacity: 0,
          }}
          transition={{
            duration: e.duration,
            ease: "easeOut",
            delay: e.delay,
          }}
        >
          {e.char}
        </motion.div>
      ))}
    </div>
  );
}

/* Max concurrent heart DOM elements to prevent memory bloat on low-end devices */
const MAX_HEARTS = 15;

export default function ForManisha() {
  const effectsRef = useRef(null);
  const musicRef = useRef(null);
  const heartCountRef = useRef(0);

  const [page, setPage] = useState(1);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [showBtn, setShowBtn] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [hasBlasted, setHasBlasted] = useState(false);
  const [emojiTrigger, setEmojiTrigger] = useState(false);

  /* COUNTDOWN – uses refs to avoid unnecessary object allocations */
  useEffect(() => {
    const target = new Date("2026-01-26T00:00:00").getTime();
    const timer = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        setShowBtn(true);
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

  /* Heart rain – optimized: uses translate3d, capped DOM count, will-change */
  const heartRain = useCallback(() => {
    if (!effectsRef.current) return;
    if (heartCountRef.current >= MAX_HEARTS) return; // cap concurrent hearts

    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = EmojiForBG[Math.floor(Math.random() * EmojiForBG.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";
    heart.style.fontSize = 20 + Math.random() * 30 + "px";
    heart.style.opacity = 0.5 + Math.random() * 0.5;

    heartCountRef.current++;
    effectsRef.current.appendChild(heart);

    // Remove after animation completes
    const removeTime = 6500; // slightly longer than max animation
    setTimeout(() => {
      heart.remove();
      heartCountRef.current--;
    }, removeTime);
  }, []);

  useEffect(() => {
    if (!curtainOpen) return;
    const interval = setInterval(heartRain, 1000);
    return () => clearInterval(interval);
  }, [curtainOpen, heartRain]);

  // Trigger emoji blast after curtains are open and button appears
  useEffect(() => {
    if (showBtn && curtainOpen && !hasBlasted) {
      setEmojiTrigger(true);
      setHasBlasted(true);
    }
  }, [showBtn, curtainOpen, hasBlasted]);

  // Music handling
  useEffect(() => {
    if (!curtainOpen) return;
    const audio = musicRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [curtainOpen]);

  const toggleMusic = useCallback(() => {
    const audio = musicRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const handleCurtainOpen = useCallback(() => setCurtainOpen(true), []);
  const goToPage2 = useCallback(() => setPage(2), []);

  // Page flow
  useEffect(() => {
    if (page === 2) {
      setShowStory(false);
      const t = setTimeout(() => setShowStory(true), 500);
      return () => clearTimeout(t);
    }
  }, [page]);

  /* Memoize countdown tiles to avoid re-render of the array each second */
  const countdownTiles = useMemo(
    () =>
      Object.entries(time).map(([k, v]) => (
        <div
          key={k}
          className="bg-white/30 backdrop-blur px-6 py-4 rounded-xl text-xl font-semibold animate-pulse"
        >
          {v}
          <span className="block text-xs mt-1 opacity-80">
            {k.toUpperCase()}
          </span>
        </div>
      )),
    [time]
  );

  return (
    <div
      className="min-h-screen py-3 text-white overflow-x-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgPhone})` }}
    >
      {/* Optimized heart rain CSS – uses translate3d + will-change + contain */}
      <style>{HEART_STYLE}</style>
      <div
        ref={effectsRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ contain: "layout style paint" }}
      />

      {/* Curtain – appears first */}
      {!curtainOpen && (
        <div className="fixed inset-0 z-[9999]">
          <CurtainIntro onOpen={handleCurtainOpen} />
        </div>
      )}

      {/* Emoji celebration – only after curtain opens */}
      {curtainOpen && <EmojiBlast trigger={emojiTrigger} />}

      {/* 🎵 audio – preload metadata only */}
      <audio ref={musicRef} src={musicFile} loop preload="metadata" />
      {/* 🎵 music button */}
      <button
        onClick={toggleMusic}
        className={`fixed bottom-4 right-4 px-6 py-3 rounded-full font-semibold z-50 ${
          playing ? "bg-pink-200 text-pink-700" : "bg-white text-pink-600"
        }`}
      >
        {playing ? "⏸️" : "🎵"}
      </button>

      {/* Main content – only visible after curtain is opened */}
      {curtainOpen && (
        <>
          {page === 1 && (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center z-10">
              <ImageSlider />
              <h1 className="text-5xl font-bold mb-2">PRATYUSH 😎</h1>
              <p className="opacity-90 mb-6">Something special is coming…</p>
              <div className="flex gap-4 flex-wrap justify-center">
                {countdownTiles}
              </div>
              {showBtn && (
                <button
                  onClick={goToPage2}
                  className="mt-8 px-10 py-4 rounded-full bg-white text-pink-600 font-semibold"
                >
                  Go to Next Page 💖
                </button>
              )}
            </div>
          )}

          {page === 2 && (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-white text-xl animate-pulse">Loading…</div>
                </div>
              }
            >
              <div className="min-h-screen flex items-center justify-center px-4 z-10">
                <Page2Slider showStory={showStory} />
              </div>
            </Suspense>
          )}
        </>
      )}
    </div>
  );
}
