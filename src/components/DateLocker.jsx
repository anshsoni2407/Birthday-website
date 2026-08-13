import React, { useState, useCallback, useMemo, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Background from "./Background";

/* ---------- Floating heart data (pre-computed, same style as Envelope) ---------- */
const HEARTS = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  emoji: ["❤️", "💖", "💕", "💗", "💓", "💞", "🩷", "🌸"][i % 8],
  left: Math.random() * 100,
  size: 14 + Math.random() * 10,
  delay: Math.random() * 6,
  duration: 7 + Math.random() * 5,
}));

const DateLocker = memo(() => {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const [date, setDate] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const targetDate = "2026-07-20";

  const handleDateChange = useCallback((e) => {
    setDate(e.target.value);
    setShake(false);
    setAttempted(false);
  }, []);

  /* Open native date picker on any click/focus inside the input */
  const openPicker = useCallback(() => {
    if (
      dateInputRef.current &&
      typeof dateInputRef.current.showPicker === "function"
    ) {
      try {
        dateInputRef.current.showPicker();
      } catch {
        // Silently ignore – some browsers throw if already open
      }
    }
  }, []);

  const handleUnlock = useCallback(() => {
    if (date === targetDate) {
      setIsUnlocked(true);
      setAttempted(false);
    } else {
      setShake(true);
      setAttempted(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [date, targetDate]);

  const handleContinue = useCallback(() => {
    navigate("/env");
  }, [navigate]);

  /* Floating hearts – memoized so they don't re-render on state change */
  const heartElements = useMemo(
    () =>
      HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-400 select-none pointer-events-none"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            top: "100%",
            willChange: "transform, opacity",
          }}
          animate={{ y: [-20, -window.innerHeight - 40], opacity: [0, 0.7, 0] }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear",
          }}
        >
          {h.emoji}
        </motion.div>
      )),
    [],
  );

  return (
    <Background overlay="bg-black/40">
      <div className="min-h-dvh flex items-center justify-center relative overflow-hidden">
        {/* Floating hearts ambience */}
        {heartElements}

        {/* Main card */}
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ====== LOCKED STATE ====== */
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 w-[90%] max-w-md"
            >
              <div
                className={`
                backdrop-blur-xl bg-white/10 border border-white/20
                rounded-3xl shadow-2xl p-8 text-center
                ${shake ? "animate-shake" : ""}
              `}
              >
                {/* Lock icon */}
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🔒
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  A Secret Lock 💋
                </h2>
                <p className="text-white/70 text-sm sm:text-base mb-6 leading-relaxed">
                  Do you remember the date of our first kiss?
                  <br />
                  Enter it to unlock the surprise…
                </p>

                {/* Date input */}
                <div
                  className={`
                  relative mb-4 w-full overflow-hidden rounded-2xl
                  bg-white/15 backdrop-blur-sm
                  border border-white/25
                  transition-all duration-300
                  focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-400/40
                `}
                >
                  {/* Custom floating placeholder */}
                  <span
                    className="absolute pointer-events-none transition-all duration-300 ease-out text-white"
                    style={
                      date
                        ? {
                            top: "6px",
                            left: "16px",
                            fontSize: "11px",
                            opacity: 0.5,
                            transform: "translate3d(0, 0, 0)",
                          }
                        : {
                            top: "50%",
                            left: "50%",
                            fontSize: "inherit",
                            opacity: 0.55,
                            transform: "translate3d(-50%, -50%, 0)",
                          }
                    }
                  >
                    Select Our First Kiss Date 💋
                  </span>

                  <input
                    ref={dateInputRef}
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    onClick={openPicker}
                    onFocus={openPicker}
                    className={`
                    block w-full min-w-0 box-border
                    px-4 sm:px-5 cursor-pointer
                    bg-transparent
                    text-white text-center text-base sm:text-lg font-medium
                    outline-none border-none
                    [color-scheme:dark]
                    appearance-none
                    ${date ? "pt-6 pb-2" : "py-4"}
                    transition-all duration-300
                  `}
                  />
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {attempted && !isUnlocked && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-300 text-sm mb-3"
                    >
                      Hmm, that's not right… try again 💭
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Unlock button */}
                <motion.button
                  onClick={handleUnlock}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                  w-full py-4 rounded-2xl
                  bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600
                  text-white font-bold text-lg
                  shadow-[0_4px_30px_rgba(236,72,153,0.4)]
                  hover:shadow-[0_4px_40px_rgba(236,72,153,0.6)]
                  transition-shadow duration-300
                "
                >
                  ✨ Unlock ✨
                </motion.button>

                {/* Hint */}
                <p className="text-white/30 text-xs mt-5">
                  Hint: A special day in July 2026 💫
                </p>
              </div>
            </motion.div>
          ) : (
            /* ====== UNLOCKED STATE ====== */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 w-[90%] max-w-md"
            >
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
                {/* Unlocked celebration */}
                <motion.div
                  className="text-7xl mb-4"
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  🔓
                </motion.div>

                <motion.h2
                  className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  You Remember! 💖
                </motion.h2>

                <motion.p
                  className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  I knew you would 🥰
                  <br />
                  <span className="text-pink-300">
                    That day changed everything…
                  </span>
                </motion.p>

                {/* Sparkle emojis */}
                <motion.div
                  className="flex justify-center gap-3 text-3xl mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {["💕", "✨", "💖", "✨", "💕"].map((e, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    >
                      {e}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Continue button */}
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="
                  w-full py-4 rounded-2xl
                  bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500
                  text-white font-bold text-lg
                  shadow-[0_4px_30px_rgba(168,85,247,0.4)]
                  hover:shadow-[0_4px_40px_rgba(168,85,247,0.6)]
                  transition-shadow duration-300
                "
                >
                  ✨Continue to Surprise✨
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shake animation keyframes */}
        <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      </div>
    </Background>
  );
});

DateLocker.displayName = "DateLocker";

export default DateLocker;
