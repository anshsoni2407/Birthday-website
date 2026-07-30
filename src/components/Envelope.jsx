import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Asset imports – keep background exactly as in ForManisha.jsx
import bgPhone from "../assets/Anuj/bgPhone.png"; // background image
import EnvelopeClosed from "../assets/Env.png"; // closed envelope image
import EnvelopeOpened from "../assets/openEnv.png"; // opened envelope static image
import LetterImg from "../assets/letter.jpg"; // final letter image

/* ---------- Decorative floating hearts – pre-computed with durations ---------- */
const HEARTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 12 + Math.random() * 8,
  delay: Math.random() * 5,
  duration: 6 + Math.random() * 4, // pre-computed so it doesn't change per render
}));

export default function Envelope() {
  const navigate = useNavigate();
  // stage flow: closed → opened → letter
  const [stage, setStage] = useState("closed");
  const [animating, setAnimating] = useState(false);
  const [showHomeBtn, setShowHomeBtn] = useState(false);

  /* ---- Handlers – memoized with useCallback ---- */
  const handleClosedClick = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    // wait for exit animation (400 ms) then switch stage
    setTimeout(() => {
      setStage("opened");
      setAnimating(false);
    }, 400);
  }, [animating]);

  const handleOpenedClick = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStage("letter");
      setAnimating(false);
    }, 400);
  }, [animating]);

  const handleLetterClick = useCallback(() => {
    // once the image is shown, reveal the Home button after a short pause
    setTimeout(() => setShowHomeBtn(true), 200);
  }, []);

  const goHome = useCallback(() => navigate("/"), [navigate]);

  /* ---- Ensure the Home button appears only after the letter image is rendered ---- */
  useEffect(() => {
    if (stage === "letter") {
      // reset button visibility each time we enter the letter stage
      setShowHomeBtn(false);
    }
  }, [stage]);

  /* ---- Memoize heart elements to avoid re-creation on state changes ---- */
  const heartElements = useMemo(
    () =>
      HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-500 select-none pointer-events-none"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            top: "100%",
            willChange: "transform, opacity",
            contain: "layout style paint",
          }}
          animate={{ y: [-20, -window.innerHeight - 40], opacity: [0, 1, 0] }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear",
          }}
        >
          ❤️
        </motion.div>
      )),
    []
  );

  return (
    <div
      className="min-h-screen py-3 text-white overflow-x-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgPhone})` }}
    >
      {/* Floating hearts – same ambience as ForManisha */}
      {heartElements}

      {/* Stage rendering – ONLY ONE visible at a time */}
      <AnimatePresence mode="wait">
        {stage === "closed" && (
          <motion.div
            key="closed"
            className="absolute inset-0 flex flex-col items-center justify-center"
            // No entry animation – visible immediately
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            // Fade out on exit
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
            onClick={handleClosedClick}
          >
            <img
              src={EnvelopeClosed}
              alt="Closed envelope"
              className="w-64 rounded-xl shadow-xl cursor-pointer"
              loading="eager"
              decoding="async"
            />
            <p className="mt-4 text-xl font-medium drop-shadow text-white">
              💌 Tap the Envelope
            </p>
          </motion.div>
        )}

        {stage === "opened" && (
          <motion.div
            key="opened"
            className="absolute inset-0 flex flex-col items-center justify-center"
            // Fade‑in entry
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            // Fade out on exit
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
            onClick={handleOpenedClick}
          >
            <img
              src={EnvelopeOpened}
              alt="Opened envelope"
              className="w-64 rounded-xl shadow-xl cursor-pointer"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-4 text-xl font-medium drop-shadow text-white">
              💌 Tap the Envelope
            </p>
          </motion.div>
        )}

        {stage === "letter" && (
          <motion.div
            key="letter"
            className="absolute inset-0 flex flex-col items-center justify-center"
            // Fade‑in entry
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
          >
            <img
              src={LetterImg}
              alt="Letter"
              className="w-64 rounded-xl shadow-xl cursor-pointer"
              loading="lazy"
              decoding="async"
              onClick={handleLetterClick}
            />
            <p className="mt-4 text-xl font-medium drop-shadow text-white">
              💖 Tap to Continue
            </p>
            {/* Home button – appears after the image is clicked */}
            {showHomeBtn && (
              <motion.button
                className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-xl hover:scale-105"
                whileHover={{ scale: 1.05 }}
                animate={{
                  y: [0, -5, 0],
                  transition: { repeat: Infinity, duration: 3 },
                }}
                onClick={goHome}
              >
                🏠 Go Back to Home Page
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
