import { useEffect, useRef, useState } from "react";
import ps1 from '../../assets/Anuj/ps1.jpeg'
import ps2 from "../../assets/Anuj/ps1.jpeg";
import ps3 from "../../assets/Anuj/ps1.jpeg";
import ps4 from "../../assets/Anuj/ps1.jpeg";
import ps5 from "../../assets/Anuj/ps1.jpeg";
import ps6 from "../../assets/Anuj/ps1.jpeg";
import ps7 from "../../assets/Anuj/ps1.jpeg";
import ps8 from "../../assets/Anuj/ps1.jpeg";

import images from "../../assets/images";

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


const ImageSlider = () => {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const endX = useRef(0);

  /* AUTO SLIDE */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  /* SWIPE HANDLERS */
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = startX.current - endX.current;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      setIndex((prev) => (prev + 1) % slides.length);
    } else {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }

    startX.current = 0;
    endX.current = 0;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-10">
      {/* SLIDER */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`min-w-full flex justify-center px-4 transition-transform duration-700 ${
                index === i ? "scale-100" : "scale-95 opacity-80"
              }`}
            >
              <div className="relative w-full max-w-[340px] h-[420px] rounded-[2rem] overflow-hidden shadow-2xl bg-black/40 backdrop-blur-lg border border-white/20 flex items-center justify-center">
                <img
                  src={slide.img}
                  alt={`slide-${i}`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />

                <div className="absolute bottom-0 w-full px-5 py-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white text-base text-center leading-relaxed">
                  {slide.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              index === i ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
