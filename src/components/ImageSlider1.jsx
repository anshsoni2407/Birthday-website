import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";

import ImageSlider from "../components/common/ImageSlider";
import CurtainIntro from "./CurtainIntro";
import Background from "./Background";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================
   Lazy load Page2Slider
   ========================================================= */

const Page2Slider = lazy(() => import("../components/common/Page2Slider"));

/* =========================================================
   SECRET DATE CONFIGURATION
   Day: 10
   Month: 5 = May
   ========================================================= */

const SECRET_DAY = 10;
const SECRET_MONTH = 5;

/* =========================================================
   Month Data
   ========================================================= */

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

/* =========================================================
   Emoji array for the one-time celebration blast
   ========================================================= */

const EmojiForBlast = [
  "💖",
  "💝",
  "🥰",
  "✨",
  "⭐",
  "🌟",
  "💫",
  "🌸",
  "🌺",
  "💐",
  "🦋",
  "🎉",
  "🎊",
];

/* =========================================================
   Generate Blast Emojis
   ========================================================= */

function generateBlastEmojis() {
  const total = 80;
  const arr = [];
  const vh = window.innerHeight;

  for (let i = 0; i < total; i++) {
    const char =
      EmojiForBlast[Math.floor(Math.random() * EmojiForBlast.length)];

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

/* =========================================================
   EmojiBlast
   ========================================================= */

function EmojiBlast({ trigger }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    setEmojis(generateBlastEmojis());

    const timer = setTimeout(() => {
      setEmojis([]);
    }, 7000);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (emojis.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9000]"
      style={{ contain: "layout style paint" }}
    >
      {emojis.map((e) => (
        <motion.div
          key={e.id}
          className="select-none"
          style={e.style}
          initial={{
            x: e.startX,
            y: e.startY,
            rotate: e.rotateStart,
          }}
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

/* =========================================================
   DATE LOCK COMPONENT
   ========================================================= */

function DateLock({ onUnlock }) {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  /* ---------------------------------------------
     Handle Date Verification
     --------------------------------------------- */

  const handleUnlock = useCallback(() => {
    setError("");

    if (!selectedDay || !selectedMonth) {
      setError("Please select your date first 💕");
      return;
    }

    const day = Number(selectedDay);
    const month = Number(selectedMonth);

    /* Correct date */
    if (day === SECRET_DAY && month === SECRET_MONTH) {
      setIsUnlocking(true);

      /*
       * Wait for unlock animation before navigating
       * to Page2Slider.
       */
      const timer = setTimeout(() => {
        onUnlock();
      }, 900);

      return () => clearTimeout(timer);
    }

    /* Wrong date */
    setError("Not quite! Try again 💕");
  }, [selectedDay, selectedMonth, onUnlock]);

  /* ---------------------------------------------
     Clear error whenever user changes date
     --------------------------------------------- */

  useEffect(() => {
    if (selectedDay || selectedMonth) {
      setError("");
    }
  }, [selectedDay, selectedMonth]);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Lock Card */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
          y: 25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] border border-white/20 bg-[#140b18]/95 px-6 py-8 text-white shadow-2xl backdrop-blur-xl"
      >
        {/* Soft glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Lock Icon */}
          <motion.div
            animate={
              isUnlocking
                ? {
                    rotate: [0, -10, 10, -5, 5, 0],
                    scale: [1, 1.1, 1.15, 1.2, 1],
                  }
                : {
                    y: [0, -3, 0],
                  }
            }
            transition={
              isUnlocking
                ? {
                    duration: 0.8,
                  }
                : {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl shadow-lg"
          >
            <AnimatePresence mode="wait">
              {isUnlocking ? (
                <motion.span
                  key="unlock"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  🔓
                </motion.span>
              ) : (
                <motion.span
                  key="lock"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >
                  🔒
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="font-serif text-2xl font-semibold"
            animate={
              isUnlocking
                ? {
                    scale: [1, 1.03, 1],
                  }
                : {}
            }
          >
            {isUnlocking ? "Unlocked! 💖" : "A Little Security"}
          </motion.h2>

          {/* Subtitle */}
          <p className="mt-1 text-sm text-white/60">
            {isUnlocking
              ? "Opening your special surprise..."
              : "Something special is waiting for you 🎁"}
          </p>

          {/* Divider */}
          <div className="my-5 h-px w-full bg-white/10" />

          {!isUnlocking && (
            <>
              {/* Instruction */}
              <p className="mb-5 text-xs text-white/50">
                Enter the special date to unlock 💝
              </p>

              {/* Date Inputs */}
              <div className="flex w-full gap-3">
                {/* Day */}
                <div className="flex-1">
                  <label
                    htmlFor="secret-day"
                    className="mb-2 block text-left text-xs text-white/60"
                  >
                    Day
                  </label>

                  <select
                    id="secret-day"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white outline-none transition-all focus:border-pink-400/60 focus:bg-white/10 focus:ring-2 focus:ring-pink-400/10"
                  >
                    <option value="" disabled className="bg-[#140b18]">
                      Day
                    </option>

                    {Array.from({ length: 31 }, (_, index) => index + 1).map(
                      (day) => (
                        <option key={day} value={day} className="bg-[#140b18]">
                          {day}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Month */}
                <div className="flex-1">
                  <label
                    htmlFor="secret-month"
                    className="mb-2 block text-left text-xs text-white/60"
                  >
                    Month
                  </label>

                  <select
                    id="secret-month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white outline-none transition-all focus:border-pink-400/60 focus:bg-white/10 focus:ring-2 focus:ring-pink-400/10"
                  >
                    <option value="" disabled className="bg-[#140b18]">
                      Month
                    </option>

                    {MONTHS.map((month) => (
                      <option
                        key={month.value}
                        value={month.value}
                        className="bg-[#140b18]"
                      >
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                    className="mt-3 w-full"
                  >
                    <motion.p
                      animate={{
                        x: [0, -5, 5, -4, 4, 0],
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="rounded-lg border border-pink-400/20 bg-pink-500/10 px-3 py-2 text-xs text-pink-200"
                    >
                      {error}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unlock Button */}
              <motion.button
                type="button"
                onClick={handleUnlock}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-semibold text-[#140b18] shadow-lg transition-all hover:shadow-pink-500/20"
              >
                Unlock 🔓
              </motion.button>

              {/* Hint Button */}
              <motion.button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-4 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                {showHint ? "Hide Hint" : "💡 Hint"}
              </motion.button>

              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl border border-yellow-300/10 bg-yellow-300/5 px-4 py-3 text-xs text-yellow-100/80">
                      Hint: Sender's Date of Birth 🎂
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Unlocking message */}
          {isUnlocking && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-5"
            >
              <p className="text-sm text-white/60">
                Date verified successfully ✨
              </p>

              <motion.div className="mx-auto mt-4 h-1 w-24 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{
                    width: "0%",
                  }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function ImageSlider1() {
  const [page, setPage] = useState(1);

  const [curtainOpen, setCurtainOpen] = useState(false);

  const [time, setTime] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  const [showBtn, setShowBtn] = useState(false);

  const [showStory, setShowStory] = useState(false);

  const [hasBlasted, setHasBlasted] = useState(false);

  const [emojiTrigger, setEmojiTrigger] = useState(false);

  /* =========================================================
     DATE LOCK STATE
     ========================================================= */

  const [showDateLock, setShowDateLock] = useState(false);

  /* =========================================================
     COUNTDOWN
     ========================================================= */

  useEffect(() => {
    const target = new Date("2026-01-26T00:00:00").getTime();

    const timer = setInterval(() => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setTime({
          d: 0,
          h: 0,
          m: 0,
          s: 0,
        });

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

  /* =========================================================
     Emoji Blast
     ========================================================= */

  useEffect(() => {
    if (showBtn && curtainOpen && !hasBlasted) {
      setEmojiTrigger(true);
      setHasBlasted(true);
    }
  }, [showBtn, curtainOpen, hasBlasted]);

  /* =========================================================
     Curtain
     ========================================================= */

  const handleCurtainOpen = useCallback(() => {
    setCurtainOpen(true);
  }, []);

  /* =========================================================
     GO TO PAGE 2

     IMPORTANT:
     This no longer directly changes page.

     It ONLY opens DateLock.
     ========================================================= */

  const goToPage2 = useCallback(() => {
    if (page !== 1) return;

    setShowDateLock(true);
  }, [page]);

  /* =========================================================
     DATE UNLOCK SUCCESS

     This is the ONLY place where Page2 is activated.
     ========================================================= */

  const handleDateUnlock = useCallback(() => {
    setShowDateLock(false);
    setPage(2);
  }, []);

  /* =========================================================
     PAGE FLOW
     ========================================================= */

  useEffect(() => {
    if (page === 2) {
      setShowStory(false);

      const timer = setTimeout(() => {
        setShowStory(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [page]);

  /* =========================================================
     Countdown Tiles
     ========================================================= */

  const countdownTiles = useMemo(
    () =>
      Object.entries(time).map(([k, v]) => (
        <div
          key={k}
          className="rounded-xl bg-white/30 px-6 py-4 text-xl font-semibold backdrop-blur animate-pulse"
        >
          {v}

          <span className="mt-1 block text-xs opacity-80">
            {k.toUpperCase()}
          </span>
        </div>
      )),
    [time],
  );

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <Background>
      {/* =====================================================
          CURTAIN
          ===================================================== */}

      {!curtainOpen && (
        <div className="fixed inset-0 z-[9999]">
          <CurtainIntro onOpen={handleCurtainOpen} />
        </div>
      )}

      {/* =====================================================
          EMOJI CELEBRATION
          ===================================================== */}

      {curtainOpen && <EmojiBlast trigger={emojiTrigger} />}

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <>
          {/* =================================================
              PAGE 1

              IMPORTANT:
              Hide Page 1 while DateLock is open.
              ================================================= */}

          {page === 1 && !showDateLock && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="min-h-screen flex flex-col items-center justify-center px-4 py-3 text-center"
            >
              <ImageSlider />

              <h1 className="mb-2 font-serif text-5xl font-bold italic">
                Simran❤️
              </h1>

              <p className="mb-6 opacity-90">Something special is coming…</p>

              <div className="flex flex-wrap justify-center gap-4">
                {countdownTiles}
              </div>

              {showBtn && (
                <motion.button
                  type="button"
                  onClick={goToPage2}
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className="mt-8 rounded-full bg-white px-10 py-4 font-semibold text-pink-600 shadow-lg"
                >
                  Go to Next Page 💖
                </motion.button>
              )}
            </motion.div>
          )}

          {/* =================================================
              DATE LOCK

              page remains 1.
              Page2Slider is NOT rendered.
              ================================================= */}

          <AnimatePresence>
            {page === 1 && showDateLock && (
              <DateLock onUnlock={handleDateUnlock} />
            )}
          </AnimatePresence>

          {/* =================================================
              PAGE 2

              ONLY rendered after successful date verification.
              ================================================= */}

          {page === 2 && (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-xl text-white animate-pulse">
                    Loading…
                  </div>
                </div>
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="min-h-screen flex items-center justify-center px-4"
              >
                <Page2Slider showStory={showStory} />
              </motion.div>
            </Suspense>
          )}
      </>
    </Background>
  );
}
