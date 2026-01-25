import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import pa1 from "../../assets/Anuj/pa1.jpeg";
import pa2 from "../../assets/Anuj/pa2.jpeg";
import pa3 from "../../assets/Anuj/pa3.jpeg";
import pa4 from "../../assets/Anuj/pa4.jpeg";

const page2Slides = [
  {
    img: pa1,
    text: "PRATYUSH, 💖",
  },
  {
    img: pa2,
    text: "Countdown khatam… ⏳",
  },
  {
    img: pa3,
    text: "Music chal raha… 🎵",
  },
  {
    img: pa4,
    text: "Aur ye sirf shuruaat hai 💕",
    isLast: true,
  },
];

const Page2Slider = ({ showStory }) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const endX = useRef(0);

  /* AUTO SLIDE */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev < page2Slides.length - 1 ? prev + 1 : prev));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  /* SWIPE */
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = startX.current - endX.current;
    if (diff > 50 && index < page2Slides.length - 1) {
      setIndex(index + 1);
    } else if (diff < -50 && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div
      className={`
        bg-gradient-to-br from-purple-400 to-pink-400
        rounded-3xl px-6 py-8 w-full max-w-sm
        shadow-2xl overflow-hidden
        transition-all duration-700 ease-out
        ${showStory ? "opacity-100 scale-100" : "opacity-0 scale-90"}
      `}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* SLIDER */}
      <div
        className=" flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {page2Slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full flex flex-col items-center text-center"
          >
            {/* IMAGE */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden mb-6  shadow-xl">
              <img src={slide.img} className="w-full h-full object-cover" />
            </div>

            {/* TEXT */}
            <p className="text-white text-2xl font-semibold mb-4">
              {slide.text}
            </p>

            {/* LAST SLIDE BUTTON */}
            {slide.isLast && (
              <button
                className="mt-4 px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg shadow-lg animate-pulse"
                onClick={() => navigate("/candleBlow")}
              >
                🎂 It’s time to cut the cake
              </button>
            )}
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-4">
        {page2Slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Page2Slider;
