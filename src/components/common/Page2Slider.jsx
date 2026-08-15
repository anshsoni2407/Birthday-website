import React, { useState, useCallback, useEffect, memo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import as1 from "../../assets/images/as1.jpeg";
import as2 from "../../assets/images/as2.jpeg";
import as3 from "../../assets/images/as3.jpeg";
import as4 from "../../assets/images/as4.jpeg";
import as5 from "../../assets/images/as5.jpeg";
import as6 from "../../assets/images/as6.jpeg";
import as7 from "../../assets/images/as7.jpeg";
import as8 from "../../assets/images/as8.jpeg";

/* ─────────────────────────────────────────────
   MEMORY DATA
───────────────────────────────────────────── */

const memories = [
  {
    img: as1,
    title: "Somehow, you became my favorite part of every day ❤️",
  },
  {
    img: as2,
    title: "I still get that little smile every time I look at you 🥹❤️",
  },
  {
    img: as3,
    title:
      "With you, even the simplest moments feel a little more special 🎵💕",
  },
  {
    img: as4,
    title: "I don't need perfect moments, I just need you in them ❤️",
  },
  {
    img: as5,
    title: "You have no idea how happy you make me just by being yourself 🥰",
  },
  {
    img: as6,
    title:
      "If I could relive one moment again and again, I'd probably choose one with you ❤️",
  },
  {
    img: as7,
    title:
      "No matter how many memories we make, I'll always want one more with you 💕",
  },
  {
    img: as8,
    title:
      "And honestly, I hope this is just the beginning of our forever ❤️♾️",
    isLast: true,
  },
];

/* ─────────────────────────────────────────────
   MODAL ANIMATION
───────────────────────────────────────────── */

const overlayVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 12,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    scale: 0.94,
    y: 8,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

/* ─────────────────────────────────────────────
   PAGE 2 SLIDER
───────────────────────────────────────────── */

const Page2Slider = memo(({ showStory }) => {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ─────────────────────────────────────────
     SELECTED MEMORY
  ───────────────────────────────────────── */

  const selected = selectedIndex !== null ? memories[selectedIndex] : null;

  /* ─────────────────────────────────────────
     OPEN MODAL
  ───────────────────────────────────────── */

  const openModal = useCallback((index) => {
    setSelectedIndex(index);
    setImageLoaded(false);
  }, []);

  /* ─────────────────────────────────────────
     CLOSE MODAL
  ───────────────────────────────────────── */

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    setImageLoaded(false);
  }, []);

  /* ─────────────────────────────────────────
     NAVIGATION
  ───────────────────────────────────────── */

  const goToCake = useCallback(() => {
    navigate("/candleBlow");
  }, [navigate]);

  /* ─────────────────────────────────────────
     NEXT MEMORY
  ───────────────────────────────────────── */

  const nextMemory = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return 0;

      return (current + 1) % memories.length;
    });

    setImageLoaded(false);
  }, []);

  /* ─────────────────────────────────────────
     PREVIOUS MEMORY
  ───────────────────────────────────────── */

  const previousMemory = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return 0;

      return (current - 1 + memories.length) % memories.length;
    });

    setImageLoaded(false);
  }, []);

  /* ─────────────────────────────────────────
     GO TO CAKE FROM MODAL
  ───────────────────────────────────────── */

  const goToCakeFromModal = useCallback(() => {
    setSelectedIndex(null);
    navigate("/candleBlow");
  }, [navigate]);

  /* ─────────────────────────────────────────
     KEYBOARD CONTROLS
  ───────────────────────────────────────── */

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowRight") {
        nextMemory();
      }

      if (event.key === "ArrowLeft") {
        previousMemory();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeModal, nextMemory, previousMemory]);

  /* ─────────────────────────────────────────
     LOCK BODY SCROLL
  ───────────────────────────────────────── */

  useEffect(() => {
    if (selectedIndex !== null) {
      const previousOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return undefined;
  }, [selectedIndex]);

  /* ─────────────────────────────────────────
     TOUCH START
  ───────────────────────────────────────── */

  const handleTouchStart = useCallback((event) => {
    touchStartX.current = event.touches[0].clientX;

    touchEndX.current = event.touches[0].clientX;
  }, []);

  /* ─────────────────────────────────────────
     TOUCH MOVE
  ───────────────────────────────────────── */

  const handleTouchMove = useCallback((event) => {
    touchEndX.current = event.touches[0].clientX;
  }, []);

  /* ─────────────────────────────────────────
     TOUCH END
  ───────────────────────────────────────── */

  const handleTouchEnd = useCallback(() => {
    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) < 50) {
      return;
    }

    if (difference > 0) {
      nextMemory();
    } else {
      previousMemory();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [nextMemory, previousMemory]);

  return (
    <div
      className={`
    ${showStory ? "opacity-100" : "opacity-0 scale-95"}
    relative
    my-10
    mx-auto
    flex
    min-h-screen
    w-full
    max-w-2xl
    flex-col
    rounded-[22px]
    border-2
    border-[#F4EFDF]/90
    bg-black/5
    shadow-[0_10px_40px_rgba(0,0,0,0.15)]
    backdrop-blur-[2px]
    transition-all
    duration-500
    ease-out
  `}
    >
      {/* ─────────────────────────────────────
      FLOATING HEADER / GALLERY TITLE
  ───────────────────────────────────── */}

      <header
        className="
      pointer-events-none
      absolute
      left-1/2
      top-0
      z-20
      flex
      w-full
      -translate-x-1/2
      -translate-y-1/2
      items-center
      justify-center
    "
      >
        <h1
          className="
        whitespace-nowrap
        rounded-full
        border
        border-[#F4EFDF]
        bg-[#F4EFDF]
        px-10
        py-1.5
        text-center
        text-sm
        font-semibold
        tracking-wide
        text-black
        shadow-[0_4px_15px_rgba(0,0,0,0.12)]
        sm:px-8
        sm:text-base
      "
        >
          Memories Gallery 💖
        </h1>
      </header>

      {/* ─────────────────────────────────────
          GALLERY
      ───────────────────────────────────── */}

      <div
        className="
          flex-1
          flex
          flex-col
          justify-end
          p-4
          w-full
        "
      >
        <div className="grid grid-cols-2 gap-4">
          {memories.map((memory, index) => (
            <motion.button
              key={index}
              type="button"
              className="
                relative
                cursor-pointer
                aspect-square
                overflow-hidden
                rounded-2xl
                outline-none
              "
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => openModal(index)}
              aria-label={`Open ${memory.title}`}
            >
              <img
                src={memory.img}
                alt={memory.title}
                loading="lazy"
                decoding="async"
                className="
                  w-full
                  h-full
                  object-cover
                  rounded-2xl
                  shadow-lg
                "
              />
            </motion.button>
          ))}
        </div>

        {/* Cake Button */}

        <div className="flex justify-center mt-4">
          <button
            onClick={goToCake}
            className="
              bg-pink-600
              text-white
              py-2
              px-6
              rounded-full
              hover:bg-pink-700
              active:scale-95
              transition-all
            "
          >
            🎂 It's time to cut the cake
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════
          FULLSCREEN MEMORY PREVIEW
      ═════════════════════════════════════ */}

      {createPortal(
        <AnimatePresence>
          {selected && (
            <motion.div
              className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              p-4
              sm:p-6
              bg-[#080512]/90
              backdrop-blur-md
              overflow-hidden
              cursor-pointer
            "
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
            >
              {/* ─────────────────────────────
                CLOSE BUTTON
            ───────────────────────────── */}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  closeModal();
                }}
                className="
                absolute
                top-5
                right-5
                sm:top-7
                sm:right-7
                z-[110]
                w-11
                h-11
                rounded-full
                bg-black/30
                border
                border-white/20
                text-white
                text-xl
                flex
                items-center
                justify-center
                backdrop-blur-md
                hover:bg-white/10
                hover:scale-105
                active:scale-95
                transition-all
              "
                aria-label="Close image preview"
              >
                ✕
              </button>

              {/* ─────────────────────────────
                PREVIOUS BUTTON
            ───────────────────────────── */}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousMemory();
                }}
                className="
                absolute
                left-3
                sm:left-6
                md:left-10
                z-[110]
                w-11
                h-11
                sm:w-12
                sm:h-12
                rounded-full
                bg-black/30
                border
                border-white/20
                text-white
                text-lg
                flex
                items-center
                justify-center
                backdrop-blur-md
                hover:bg-white/10
                hover:scale-105
                active:scale-95
                transition-all
              "
                aria-label="Previous memory"
              >
                ←
              </button>

              {/* ─────────────────────────────
                NEXT BUTTON
            ───────────────────────────── */}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextMemory();
                }}
                className="
                absolute
                right-3
                sm:right-6
                md:right-10
                z-[110]
                w-11
                h-11
                sm:w-12
                sm:h-12
                rounded-full
                bg-black/30
                border
                border-white/20
                text-white
                text-lg
                flex
                items-center
                justify-center
                backdrop-blur-md
                hover:bg-white/10
                hover:scale-105
                active:scale-95
                transition-all
              "
                aria-label="Next memory"
              >
                →
              </button>

              {/* ─────────────────────────────
                MEMORY CARD
            ───────────────────────────── */}

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(event) => event.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full max-w-[390px] flex justify-center"
              >
                {/* TILTING MEMORY CARD */}
                <div
                  className="
      relative
      w-full
      max-h-[88vh]
      bg-[#f4efdf]
      rounded-[18px]
      p-[10px]
      pb-[18px]
      border
      border-white/70
      shadow-[0_25px_70px_rgba(0,0,0,0.45)]
      flex
      flex-col
      animate-[modalTilt_4s_ease-in-out_infinite]
    "
                >
                  {/* IMAGE */}
                  <div
                    className="
        relative
        w-full
        h-[55vh]
        sm:h-[58vh]
        max-h-[560px]
        rounded-[13px]
        overflow-hidden
        bg-[#e8e0cd]
        flex
        items-center
        justify-center
      "
                  >
                    {/* Loading shimmer */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 overflow-hidden bg-[#e8e0cd]">
                        <div className="absolute inset-0 shimmer-preview" />

                        <style>{`
            @keyframes preview-shimmer {
              0% {
                transform: translateX(-100%);
              }

              100% {
                transform: translateX(100%);
              }
            }

            .shimmer-preview {
              width: 60%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,0.45),
                transparent
              );
              animation: preview-shimmer 1.4s infinite;
            }
          `}</style>
                      </div>
                    )}

                    {/* IMAGE */}
                    <img
                      key={selected.img}
                      src={selected.img}
                      alt={selected.title}
                      decoding="async"
                      onLoad={() => setImageLoaded(true)}
                      draggable={false}
                      className="
          w-full
          h-full
          object-contain
          select-none
          transition-opacity
          duration-300
        "
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                      }}
                    />
                  </div>

                  {/* TITLE */}
                  <div className="text-center px-3 pt-4">
                    <h2
                      className="
          text-[#5c4a68]
          text-[18px]
          sm:text-[20px]
          font-semibold
          leading-tight
        "
                    >
                      {selected.title}
                    </h2>
                  </div>

                  {/* DESCRIPTION */}
                  <div
                    className="
        text-center
        px-4
        pt-2
        pb-1
      "
                  ></div>
                </div>

                {/* TILT ANIMATION */}
                <style>{`
    @keyframes modalTilt {
      0%,
      100% {
        transform: rotate(-1.2deg);
      }

      50% {
        transform: rotate(1.2deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-\\[modalTilt_4s_ease-in-out_infinite\\] {
        animation: none !important;
      }
    }
  `}</style>
              </motion.div>
              {/* ─────────────────────────────
                DOTS
            ───────────────────────────── */}

              <div
                className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                flex
                items-center
                gap-[7px]
              "
              >
                {memories.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex(index);
                      setImageLoaded(false);
                    }}
                    className={`
                    h-[7px]
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      selectedIndex === index
                        ? "w-[26px] bg-[#e8b83f]"
                        : "w-[7px] bg-white/30 hover:bg-white/50"
                    }
                  `}
                    aria-label={`View memory ${index + 1}`}
                  />
                ))}
              </div>

              {/* ─────────────────────────────
                CAKE BUTTON
            ───────────────────────────── */}

              {selected.isLast && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToCakeFromModal();
                  }}
                  className="
                  absolute
                  bottom-14
                  left-1/2
                  -translate-x-1/2
                  bg-[#f4b942]
                  text-[#39251f]
                  font-semibold
                  px-6
                  py-2.5
                  rounded-full
                  shadow-lg
                  hover:scale-105
                  active:scale-95
                  transition-all
                "
                >
                  🎂 It's time to cut the cake
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
});

Page2Slider.displayName = "Page2Slider";

export default Page2Slider;
