import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Imported assets
import Envelope from "../assets/Env.png"; // closed envelope
import openEnvelope from "../assets/openEnv.png"; // flap image
import letter from "../assets/letter.jpg"; // letter content image

/* ---------- HEART ANIMATION ---------- */
const HEARTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  size: 12 + Math.random() * 8,
}));

/* ---------- FRAMER MOTION VARIANTS ---------- */
const envelopeContainerVariants = {
  closed: { scale: 1, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" },
  opened: {
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    transition: { duration: 1, ease: "easeOut" },
  },
};

const flapVariants = {
  closed: { rotate: 0 },
  opened: {
    rotate: -120,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const letterSlide = {
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: -120,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, bounce: 0.4 },
  },
};

const letterOpen = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const imageFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function EnvelopeComponent() {
  const navigate = useNavigate();

  // State machine for envelope and letter
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  // Sequential effects
  useEffect(() => {
    if (envelopeOpened) {
      const t = setTimeout(() => setLetterVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [envelopeOpened]);

  useEffect(() => {
    if (letterVisible) {
      const t = setTimeout(() => setLetterOpened(true), 1500);
      return () => clearTimeout(t);
    }
  }, [letterVisible]);

  useEffect(() => {
    if (letterOpened) {
      const t = setTimeout(() => setImageVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [letterOpened]);

  const handleEnvelopeClick = () => setEnvelopeOpened(true);
  const handleLetterClick = () => setLetterOpened(true);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 relative overflow-hidden">
      {/* Floating hearts */}
      {HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-500 select-none pointer-events-none"
          style={{ left: `${h.left}%`, fontSize: `${h.size}px`, top: "100%" }}
          animate={{ y: [-20, -window.innerHeight - 40], opacity: [0, 1, 0] }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: h.delay, ease: "linear" }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Envelope and letter flow */}
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center gap-6 z-10"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Envelope */}
          <motion.div
            className="relative cursor-pointer"
            variants={envelopeContainerVariants}
            initial="closed"
            animate={envelopeOpened ? "opened" : "closed"}
            onClick={!envelopeOpened ? handleEnvelopeClick : undefined}
          >
            <img src={Envelope} alt="Envelope" className="block w-64 h-auto rounded-xl shadow-lg" />
            <motion.img
              src={openEnvelope}
              alt="Envelope flap"
              className="absolute inset-0 w-full h-full"
              style={{ transformOrigin: "bottom left" }}
              variants={flapVariants}
              initial="closed"
              animate={envelopeOpened ? "opened" : "closed"}
            />
          </motion.div>

          {/* Letter sliding out */}
          <AnimatePresence>
            {letterVisible && (
              <motion.div
                className="relative"
                variants={letterSlide}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="cursor-pointer"
                  variants={letterOpen}
                  initial="hidden"
                  animate={letterOpened ? "visible" : "hidden"}
                  onClick={handleLetterClick}
                >
                  <div className="w-48 h-64 bg-white/90 rounded-xl shadow-md flex items-center justify-center text-xl">
                    💌 Tap the letter
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full letter image */}
          <AnimatePresence>
            {imageVisible && (
              <motion.img
                src={letter}
                alt="Letter content"
                className="rounded-xl shadow-2xl max-w-md w-full"
                variants={imageFade}
                initial="hidden"
                animate="visible"
              />
            )}
          </AnimatePresence>

          {/* Navigation button after the letter is shown */}
          {imageVisible && (
            <button
              onClick={() => navigate("/candleBlow")}
              className="px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 text-lg font-semibold shadow-xl hover:scale-105"
            >
              Continue to Candle ✨
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
