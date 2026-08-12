import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Background from "./Background";

// Assets
import EnvelopeClosed from "../assets/Env.png";
import EnvelopeOpened from "../assets/openEnv.png";
import LetterImg from "../assets/letter.jpg";

/* ─────────────────────────────────────────────
   FLOATING HEART DATA
───────────────────────────────────────────── */

const HEARTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: 5 + Math.random() * 90,
  size: 14 + Math.random() * 10,
  delay: Math.random() * 5,
  duration: 7 + Math.random() * 4,
}));

/* ─────────────────────────────────────────────
   STAGE ANIMATIONS
───────────────────────────────────────────── */

const stageVariants = {
  initial: {
    opacity: 0,
    scale: 0.94,
    y: 15,
  },

  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

/* ─────────────────────────────────────────────
   ENVELOPE CARD
───────────────────────────────────────────── */

const cardClass = `
  relative
  flex
  flex-col
  items-center
  justify-center
  w-full
  max-w-[360px]
  px-5
  py-7
  sm:px-7
  sm:py-8
  rounded-[28px]
  bg-white/10
  backdrop-blur-xl
  border
  border-white/20
  shadow-[0_25px_70px_rgba(0,0,0,0.30)]
`;

/* ─────────────────────────────────────────────
   IMAGE LOADER
───────────────────────────────────────────── */

function ImageLoader() {
  return (
    <div
      className="
        absolute
        inset-0
        rounded-[22px]
        overflow-hidden
        bg-white/10
      "
    >
      <div className="envelope-shimmer absolute inset-0" />

      <style>{`
        @keyframes envelope-shimmer {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        .envelope-shimmer {
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.20),
            transparent
          );
          animation: envelope-shimmer 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .envelope-shimmer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ENVELOPE COMPONENT
───────────────────────────────────────────── */

export default function Envelope() {
  const navigate = useNavigate();

  /*
    Flow:
    closed → opened → letter
  */

  const [stage, setStage] = useState("closed");

  const [animating, setAnimating] = useState(false);

  const [showHomeBtn, setShowHomeBtn] = useState(false);

  const [closedLoaded, setClosedLoaded] = useState(false);

  const [openedLoaded, setOpenedLoaded] = useState(false);

  const [letterLoaded, setLetterLoaded] = useState(false);

  /* Timer references */

  const stageTimerRef = useRef(null);

  const homeTimerRef = useRef(null);

  /* ─────────────────────────────────────────
     CLEAR TIMERS
  ───────────────────────────────────────── */

  const clearTimers = useCallback(() => {
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }

    if (homeTimerRef.current) {
      clearTimeout(homeTimerRef.current);
      homeTimerRef.current = null;
    }
  }, []);

  /* ─────────────────────────────────────────
     CLOSED → OPENED
  ───────────────────────────────────────── */

  const handleClosedClick = useCallback(() => {
    if (animating) return;

    setAnimating(true);

    stageTimerRef.current = setTimeout(() => {
      setStage("opened");
      setAnimating(false);
      stageTimerRef.current = null;
    }, 400);
  }, [animating]);

  /* ─────────────────────────────────────────
     OPENED → LETTER
  ───────────────────────────────────────── */

  const handleOpenedClick = useCallback(() => {
    if (animating) return;

    setAnimating(true);

    stageTimerRef.current = setTimeout(() => {
      setStage("letter");
      setShowHomeBtn(false);
      setAnimating(false);
      stageTimerRef.current = null;
    }, 400);
  }, [animating]);

  /* ─────────────────────────────────────────
     LETTER CLICK
  ───────────────────────────────────────── */

  const handleLetterClick = useCallback(() => {
    if (homeTimerRef.current) {
      clearTimeout(homeTimerRef.current);
    }

    homeTimerRef.current = setTimeout(() => {
      setShowHomeBtn(true);
      homeTimerRef.current = null;
    }, 200);
  }, []);

  /* ─────────────────────────────────────────
     GO HOME
  ───────────────────────────────────────── */

  const goHome = useCallback(
    (event) => {
      event?.stopPropagation();

      clearTimers();

      navigate("/");
    },
    [navigate, clearTimers],
  );

  /* ─────────────────────────────────────────
     RESET LETTER STATE
  ───────────────────────────────────────── */

  useEffect(() => {
    if (stage === "letter") {
      setShowHomeBtn(false);
      setLetterLoaded(false);
    }
  }, [stage]);

  /* ─────────────────────────────────────────
     CLEANUP
  ───────────────────────────────────────── */

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  /* ─────────────────────────────────────────
     FLOATING HEARTS
  ───────────────────────────────────────── */

  const heartElements = useMemo(() => {
    return HEARTS.map((heart) => (
      <motion.span
        key={heart.id}
        className="
          absolute
          pointer-events-none
          select-none
          text-pink-300
          drop-shadow-[0_0_8px_rgba(244,114,182,0.35)]
        "
        style={{
          left: `${heart.left}%`,
          bottom: "-30px",
          fontSize: `${heart.size}px`,
          willChange: "transform, opacity",
        }}
        animate={{
          y: [-10, -700],
          opacity: [0, 0.75, 0],
          x: [0, 8, -5, 0],
        }}
        transition={{
          duration: heart.duration,
          delay: heart.delay,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
      >
        ❤️
      </motion.span>
    ));
  }, []);

  /* ─────────────────────────────────────────
     UI
  ───────────────────────────────────────── */

  return (
    <Background overlay="bg-black/10">
      {/* ─────────────────────────────────────
          DECORATIVE HEART LAYER
      ───────────────────────────────────── */}

      <div
        className="
          fixed
          inset-0
          z-[1]
          pointer-events-none
          overflow-hidden
        "
        aria-hidden="true"
      >
        {heartElements}
      </div>

      {/* ─────────────────────────────────────
          MAIN CONTENT
      ───────────────────────────────────── */}

      <div
        className="
          relative
          z-10
          min-h-dvh
          w-full
          flex
          items-center
          justify-center
          px-4
          py-8
          overflow-hidden
        "
      >
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════
              CLOSED ENVELOPE
          ═══════════════════════════════════ */}

          {stage === "closed" && (
            <motion.div
              key="closed"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cardClass}
              onClick={handleClosedClick}
            >
              {/* Small decorative icon */}

              <div
                className="
                  absolute
                  top-4
                  right-5
                  text-xl
                  opacity-70
                "
              >
                💕
              </div>

              {/* IMAGE CONTAINER */}

              <div
                className="
                  relative
                  w-[230px]
                  h-[230px]
                  sm:w-[260px]
                  sm:h-[260px]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                "
              >
                {!closedLoaded && <ImageLoader />}

                <img
                  src={EnvelopeClosed}
                  alt="Closed envelope"
                  loading="eager"
                  decoding="async"
                  onLoad={() => setClosedLoaded(true)}
                  className="
                    w-full
                    h-full
                    object-contain
                    rounded-2xl
                    drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]
                    transition-all
                    duration-500
                    hover:scale-105
                    active:scale-95
                  "
                  style={{
                    opacity: closedLoaded ? 1 : 0,
                  }}
                />
              </div>

              {/* TEXT */}

              <div className="text-center mt-5">
                <p
                  className="
                    text-white
                    text-xl
                    sm:text-2xl
                    font-semibold
                    drop-shadow-lg
                  "
                >
                  💌 Tap the Envelope
                </p>

                <p
                  className="
                    mt-2
                    text-white/60
                    text-sm
                  "
                >
                  Something special is waiting for you...
                </p>
              </div>

              {/* Small hint */}

              <div
                className="
                  mt-5
                  px-4
                  py-2
                  rounded-full
                  bg-white/10
                  border
                  border-white/10
                  text-white/60
                  text-xs
                "
              >
                Tap to open ✨
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              OPENED ENVELOPE
          ═══════════════════════════════════ */}

          {stage === "opened" && (
            <motion.div
              key="opened"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cardClass}
              onClick={handleOpenedClick}
            >
              <div
                className="
                  absolute
                  top-4
                  left-5
                  text-xl
                  opacity-70
                "
              >
                ✨
              </div>

              <div
                className="
                  absolute
                  top-4
                  right-5
                  text-xl
                  opacity-70
                "
              >
                💕
              </div>

              {/* IMAGE */}

              <div
                className="
                  relative
                  w-[230px]
                  h-[230px]
                  sm:w-[260px]
                  sm:h-[260px]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                "
              >
                {!openedLoaded && <ImageLoader />}

                <img
                  src={EnvelopeOpened}
                  alt="Opened envelope"
                  loading="eager"
                  decoding="async"
                  onLoad={() => setOpenedLoaded(true)}
                  className="
                    w-full
                    h-full
                    object-contain
                    rounded-2xl
                    drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]
                    transition-all
                    duration-500
                    hover:scale-105
                    active:scale-95
                  "
                  style={{
                    opacity: openedLoaded ? 1 : 0,
                  }}
                />
              </div>

              {/* TEXT */}

              <div className="text-center mt-5">
                <p
                  className="
                    text-white
                    text-xl
                    sm:text-2xl
                    font-semibold
                    drop-shadow-lg
                  "
                >
                  💌 One more step...
                </p>

                <p
                  className="
                    mt-2
                    text-white/60
                    text-sm
                  "
                >
                  Tap again to reveal your letter 💖
                </p>
              </div>

              <div
                className="
                  mt-5
                  px-4
                  py-2
                  rounded-full
                  bg-white/10
                  border
                  border-white/10
                  text-white/60
                  text-xs
                "
              >
                Tap to continue ✨
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              LETTER
          ═══════════════════════════════════ */}

          {stage === "letter" && (
            <motion.div
              key="letter"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              className="
                relative
                flex
                flex-col
                items-center
                justify-center
                w-full
                max-w-[390px]
                px-4
                py-5
              "
            >
              {/* Letter glow */}

              <div
                className="
                  absolute
                  w-[250px]
                  h-[250px]
                  rounded-full
                  bg-pink-400/20
                  blur-3xl
                  pointer-events-none
                "
              />

              {/* LETTER CARD */}

              <motion.div
                className="
                  relative
                  w-full
                  max-w-[350px]
                  p-3
                  rounded-[24px]
                  bg-[#f4efdf]
                  border
                  border-white/70
                  shadow-[0_25px_70px_rgba(0,0,0,0.40)]
                  cursor-pointer
                "
                whileHover={{
                  scale: 1.02,
                  rotate: -1,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={handleLetterClick}
              >
                {/* Image wrapper */}

                <div
                  className="
                    relative
                    w-full
                    rounded-[18px]
                    overflow-hidden
                    bg-[#e8e0cd]
                  "
                >
                  {!letterLoaded && <ImageLoader />}

                  <img
                    src={LetterImg}
                    alt="Birthday letter"
                    loading="eager"
                    decoding="async"
                    onLoad={() => setLetterLoaded(true)}
                    className="
                      block
                      w-full
                      h-auto
                      max-h-[65vh]
                      object-contain
                      rounded-[18px]
                      select-none
                      transition-opacity
                      duration-500
                    "
                    draggable={false}
                    style={{
                      opacity: letterLoaded ? 1 : 0,
                    }}
                  />
                </div>

                {/* Card caption */}

                <div className="text-center py-3 px-2">
                  <p
                    className="
                      text-[#5c4a68]
                      text-sm
                      font-medium
                      italic
                    "
                  >
                    A little something from my heart 💖
                  </p>
                </div>
              </motion.div>

              {/* CONTINUE TEXT */}

              {!showHomeBtn && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                  }}
                  className="
                    mt-5
                    text-white
                    text-lg
                    font-medium
                    drop-shadow-lg
                  "
                >
                  💖 Tap to Continue
                </motion.p>
              )}

              {/* HOME BUTTON */}

              <AnimatePresence>
                {showHomeBtn && (
                  <motion.button
                    type="button"
                    initial={{
                      opacity: 0,
                      y: 15,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={goHome}
                    className="
                      mt-6
                      px-7
                      py-3
                      rounded-full
                      bg-gradient-to-r
                      from-pink-500
                      to-purple-600
                      text-white
                      font-semibold
                      shadow-[0_12px_35px_rgba(236,72,153,0.35)]
                      border
                      border-white/20
                    "
                  >
                    🏠 Go Back to Home Page
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Background>
  );
}
