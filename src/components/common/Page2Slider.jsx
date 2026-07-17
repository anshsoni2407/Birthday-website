import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import pa1 from "../../assets/Anuj/pa1.jpeg";
import pa2 from "../../assets/Anuj/pa2.jpeg";
import pa3 from "../../assets/Anuj/pa3.jpeg";
import pa4 from "../../assets/Anuj/pa4.jpeg";

// Memory objects – title and text for each image
const memories = [
  { img: pa1, title: "The Beginning ❤️", text: "Beautiful memories always stay forever." },
  { img: pa2, title: "Countdown khatam… ⏳", text: "The excitement builds as we approach the day." },
  { img: pa3, title: "Music chal raha… 🎵", text: "Melodies that echo the love in the air." },
  { img: pa4, title: "Aur ye sirf shuruaat hai 💕", text: "The journey has just begun, stay tuned!", isLast: true },
  { img: pa3, title: "Music chal raha… 🎵", text: "Melodies that echo the love in the air." },
  { img: pa4, title: "Aur ye sirf shuruaat hai 💕", text: "The journey has just begun, stay tuned!", isLast: true },
  { img: pa3, title: "Music chal raha… 🎵", text: "Melodies that echo the love in the air." },
  { img: pa4, title: "Aur ye sirf shuruaat hai 💕", text: "The journey has just begun, stay tuned!", isLast: true },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

const Page2Slider = ({ showStory }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const openModal = (memory) => setSelected(memory);
  const closeModal = () => setSelected(null);

  return (
    <div
      className={`
        ${showStory ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        transition-opacity duration-500 ease-out
        flex flex-col min-h-screen w-full max-w-2xl mx-auto
      `}
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-t-2xl">
        <button onClick={() => navigate(-1)} className="text-white text-xl" aria-label="Back">
          ←
        </button>
        <h1 className="text-white text-lg font-semibold">Memories Gallery 💖</h1>
        <div className="w-6" />
      </header>

      {/* Gallery – squares, bottom‑aligned */}
      <div className="flex-1 flex flex-col justify-end p-4 w-full">
        <div className="grid grid-cols-2 gap-4">
          {memories.map((mem, idx) => (
            <motion.div
              key={idx}
              className="relative cursor-pointer aspect-square overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openModal(mem)}
            >
              <img src={mem.img} alt={mem.title} className="w-full h-full object-cover rounded-2xl shadow-lg" />
            </motion.div>
          ))}
        </div>
        {/* Persistent button at bottom */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/candleBlow')}
            className="bg-pink-600 text-white py-2 px-6 rounded-full hover:bg-pink-700 transition"
          >
            🎂 It's time to cut the cake
          </button>
        </div>
      </div>

      {/* Modal for memory details */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl p-4 max-w-md w-full mx-4 overflow-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.img} alt={selected.title} className="w-full h-auto object-cover rounded-xl mb-4" />
              <h2 className="text-xl font-bold mb-2 text-center">{selected.title}</h2>
              <p className="text-gray-700 mb-4 text-center">{selected.text}</p>
              {selected.isLast && (
                <button
                  onClick={() => { closeModal(); navigate('/candleBlow'); }}
                  className="w-full bg-pink-600 text-white py-2 rounded-lg mt-2 hover:bg-pink-700 transition"
                >
                  🎂 It's time to cut the cake
                </button>
              )}
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" aria-label="Close">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page2Slider;
