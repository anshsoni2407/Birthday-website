import React, { useEffect, useRef, useState, useCallback, memo } from "react";

import ps1 from "../../assets/Anuj/ps1.jpeg";
import ps2 from "../../assets/Anuj/ps2.jpeg";
import ps3 from "../../assets/Anuj/ps3.jpeg";
import ps4 from "../../assets/Anuj/ps4.jpeg";
import ps5 from "../../assets/Anuj/ps5.jpeg";
import ps6 from "../../assets/Anuj/ps6.jpeg";
import ps7 from "../../assets/Anuj/ps7.jpeg";
import ps8 from "../../assets/Anuj/ps8.jpeg";

/* ─────────────────────────────────────────────
   SLIDE DATA
───────────────────────────────────────────── */

const slides = [
  {
    img: ps2,
    text: "Tumhari ye muskaan hi mera sabse bada gift hai 💖",
  },
  {
    img: ps1,
    text: "Tum mere liye kisi dua se kam nahi ho 💫❤️",
  },
  {
    img: ps3,
    text: "Har rang tum pe jachta hai 💕",
  },
  {
    img: ps4,
    text: "You make my heart skip a beat ❤️",
  },
  {
    img: ps5,
    text: "You are my all of today and all of my tomorrow 💞",
  },
  {
    img: ps6,
    text: "You are my happy place 🌸",
  },
  {
    img: ps7,
    text: "I pick you, always and forever ♾️❤️",
  },
  {
    img: ps8,
    text: "My world in a picture 🌍💖",
  },
];

/* ─────────────────────────────────────────────
   SHIMMER LOADER
───────────────────────────────────────────── */

const Placeholder = memo(() => {
  return (
    <div className="absolute inset-0 bg-[#eee8d8] overflow-hidden">
      <div className="absolute inset-0 shimmer-effect" />

      <style>{`
        @keyframes image-shimmer {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        .shimmer-effect {
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.45),
            transparent
          );
          animation: image-shimmer 1.5s infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer-effect {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
});

Placeholder.displayName = "Placeholder";

/* ─────────────────────────────────────────────
   IMAGE SLIDER
───────────────────────────────────────────── */

const ImageSlider = memo(() => {
  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(() => new Set());

  const startX = useRef(0);
  const endX = useRef(0);

  /* ─────────────────────────────────────────
     MARK IMAGE AS LOADED
  ───────────────────────────────────────── */

  const handleImageLoad = useCallback((imageIndex) => {
    setLoadedImages((previous) => {
      if (previous.has(imageIndex)) {
        return previous;
      }

      const updated = new Set(previous);
      updated.add(imageIndex);

      return updated;
    });
  }, []);

  /* ─────────────────────────────────────────
     PRELOAD NEXT IMAGE
  ───────────────────────────────────────── */

  useEffect(() => {
    const nextIndex = (index + 1) % slides.length;

    if (loadedImages.has(nextIndex)) {
      return;
    }

    const image = new Image();

    image.src = slides[nextIndex].img;

    image.onload = () => {
      handleImageLoad(nextIndex);
    };
  }, [index, loadedImages, handleImageLoad]);

  /* ─────────────────────────────────────────
     AUTO SLIDE
  ───────────────────────────────────────── */

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((previous) => (previous + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  /* ─────────────────────────────────────────
     PREVIOUS
  ───────────────────────────────────────── */

  const previousSlide = useCallback(() => {
    setIndex((previous) => {
      return (previous - 1 + slides.length) % slides.length;
    });
  }, []);

  /* ─────────────────────────────────────────
     NEXT
  ───────────────────────────────────────── */

  const nextSlide = useCallback(() => {
    setIndex((previous) => {
      return (previous + 1) % slides.length;
    });
  }, []);

  /* ─────────────────────────────────────────
     TOUCH / SWIPE
  ───────────────────────────────────────── */

  const handleTouchStart = useCallback((event) => {
    startX.current = event.touches[0].clientX;
    endX.current = event.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((event) => {
    endX.current = event.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const difference = startX.current - endX.current;

    if (Math.abs(difference) < 50) {
      return;
    }

    if (difference > 0) {
      nextSlide();
    } else {
      previousSlide();
    }

    startX.current = 0;
    endX.current = 0;
  }, [nextSlide, previousSlide]);

  /* ─────────────────────────────────────────
     CURRENT SLIDE
  ───────────────────────────────────────── */

  const currentSlide = slides[index];

  const isLoaded = loadedImages.has(index);

  return (
    <div className="relative w-full max-w-[430px] mx-auto px-4 pb-8">
      {/* ─────────────────────────────────────
          SLIDER AREA
      ───────────────────────────────────── */}
      <div
        className="relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider Track */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translate3d(-${index * 100}%, 0, 0)`,
            willChange: "transform",
          }}
        >
          {slides.map((slide, slideIndex) => {
            const imageLoaded = loadedImages.has(slideIndex);

            return (
              <div
                key={slideIndex}
                className="min-w-full flex justify-center px-2"
              >
                {/* MEMORY / POLAROID CARD */}
                <div
                  className="
              relative
              w-full
              max-w-[380px]
              bg-[#f4efdf]
              rounded-[18px]
              p-[10px]
              pb-[18px]
              shadow-[0_18px_45px_rgba(0,0,0,0.28)]
              border border-white/60
              animate-[tilt_4s_ease-in-out_infinite]
            "
                >
                  {/* IMAGE AREA */}
                  <div
                    className="
                relative
                w-full
                h-[390px]
                sm:h-[410px]
                rounded-[13px]
                overflow-hidden
                bg-[#e8e0cd]
                flex
                items-center
                justify-center
              "
                  >
                    {/* Loader */}
                    {!imageLoaded && <Placeholder />}

                    {/* Image */}
                    <img
                      src={slide.img}
                      alt={`Memory ${slideIndex + 1}`}
                      loading={slideIndex === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={slideIndex === 0 ? "high" : "auto"}
                      onLoad={() => handleImageLoad(slideIndex)}
                      className="
                  w-full
                  h-full
                  object-contain
                  transition-opacity
                  duration-500
                "
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                      }}
                    />
                  </div>

                  {/* CAPTION */}
                  <div
                    className="
                min-h-[62px]
                px-3
                pt-4
                flex
                items-center
                justify-center
                text-center
              "
                  >
                    <p
                      className="
                  text-[#5c4a68]
                  text-[17px]
                  sm:text-[18px]
                  leading-relaxed
                  font-medium
                  italic
                  tracking-wide
                "
                    >
                      {slide.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tilt Animation */}
        <style>{`
    @keyframes tilt {
      0%,
      100% {
        transform: rotate(-1.5deg);
      }

      50% {
        transform: rotate(1deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-\\[tilt_4s_ease-in-out_infinite\\] {
        animation: none !important;
      }
    }
  `}</style>
      </div>

      {/* ─────────────────────────────────────
          NAVIGATION
      ───────────────────────────────────── */}

      <div className="flex items-center justify-center gap-5 mt-5">
        {/* PREVIOUS */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous memory"
          className="
            w-[46px]
            h-[46px]
            rounded-full
            border
            border-white/15
            bg-black/5
            text-white/80
            flex
            items-center
            justify-center
            text-lg
            transition-all
            duration-300
            hover:bg-white/10
            hover:border-white/30
            hover:scale-105
            active:scale-95
          "
        >
          ←
        </button>

        {/* DOTS */}

        <div className="flex items-center gap-[7px]">
          {slides.map((_, dotIndex) => {
            const active = index === dotIndex;

            return (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`Go to memory ${dotIndex + 1}`}
                className={`
                  h-[8px]
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    active
                      ? "w-[28px] bg-[#e8b83f]"
                      : "w-[8px] bg-white/20 hover:bg-white/40"
                  }
                `}
              />
            );
          })}
        </div>

        {/* NEXT */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next memory"
          className="
            w-[46px]
            h-[46px]
            rounded-full
            border
            border-white/15
            bg-black/5
            text-white/80
            flex
            items-center
            justify-center
            text-lg
            transition-all
            duration-300
            hover:bg-white/10
            hover:border-white/30
            hover:scale-105
            active:scale-95
          "
        >
          →
        </button>
      </div>

      {/* ─────────────────────────────────────
          SWIPE HINT
      ───────────────────────────────────── */}

      <p
        className="
          text-center
          text-white/40
          text-[12px]
          tracking-wider
          mt-4
        "
      >
        — swipe, or tap the arrows —
      </p>
    </div>
  );
});

ImageSlider.displayName = "ImageSlider";

export default ImageSlider;
