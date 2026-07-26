import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import gif from "../assets/Anuj/gif.mp4";

const CandleBlow = memo(() => {
  const [stage, setStage] = useState("before"); // before | blowing | after
  const [listening, setListening] = useState(false);
  const [showBlowGif, setShowBlowGif] = useState(false);
  const blownRef = useRef(false);
  // Ref mirror for showBlowGif – used inside rAF to avoid stale closure
  const showBlowGifRef = useRef(false);
  // Timestamp when GIF became visible, used to enforce minimum 2‑second display
  const gifShownAtRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();

  /* 🔁 Reset stage when page loads */
  useEffect(() => {
    setStage("before");
    setListening(false);
  }, []);

  /* Keep ref in sync with state */
  useEffect(() => {
    showBlowGifRef.current = showBlowGif;
  }, [showBlowGif]);

  // 💨 Detect air blow – uses refs to avoid stale closures
  const detectBlow = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const volume =
      dataArrayRef.current.reduce((a, b) => a + b, 0) /
      dataArrayRef.current.length;

    // Volume >= 70 -> blow candle immediately
    if (volume > 70) {
      if (!blownRef.current) {
        blownRef.current = true;
        // Inline blowCandle logic to avoid dependency
        cancelAnimationFrame(animationRef.current);
        setListening(false);
        setShowBlowGif(false);
        setStage("blowing");
        setTimeout(() => {
          setStage("after");
        }, 2500);
      }
      return; // stop further monitoring
    }

    // Volume between 20 and 70 -> show GIF
    if (volume >= 20 && volume <= 70) {
      if (!showBlowGifRef.current) {
        gifShownAtRef.current = Date.now();
        setShowBlowGif(true);
      }
    } else {
      // Volume < 20 -> hide GIF only after it has been visible for >=2 seconds
      if (showBlowGifRef.current && gifShownAtRef.current) {
        const elapsed = Date.now() - gifShownAtRef.current;
        if (elapsed >= 2000) {
          setShowBlowGif(false);
          gifShownAtRef.current = null;
        }
      }
    }

    // Continue monitoring via animation frame (unless blown)
    animationRef.current = requestAnimationFrame(detectBlow);
  }, []);

  // 🎤 Start mic & detect blow
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();

      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount,
      );

      source.connect(analyserRef.current);
      setListening(true);
      detectBlow();
    } catch (err) {
      alert("Microphone permission denied ❌");
    }
  }, [detectBlow]);

  const resetCandle = useCallback(() => {
    setStage("before");
    setListening(false);
  }, []);

  const goToEnvelope = useCallback(() => {
    resetCandle();
    navigate('/date-lock')
    // navigate("/env");
  }, [resetCandle, navigate]);

  /* Cleanup: cancel rAF, close AudioContext, stop mic stream */
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-pulse">
        🎉 Happy Birthday 🎉
      </h1>

      {/* BEFORE */}
      {stage === "before" && (
        <>
          <img
            src="/bg/ChatGPT_Image_Jan_17__2026__02_33_21_AM-removebg-preview.png"
            alt="Cake with candle"
            className="w-72 md:w-80 animate-fadeIn relative"
            loading="eager"
            decoding="async"
          />

          <button
            onClick={startListening}
            className="mt-6 px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-all shadow-lg text-lg font-semibold"
          >
            {listening ? "Blow the Candle 💨" : "Start Mic 🎤"}
          </button>

          {/* Instruction text – only when listening and GIF not visible */}
          {listening && !showBlowGif && (
            <p className="mt-4 text-lg animate-bounce">Blow into the mic 🎂</p>
          )}
          {/* Fixed‑size container for GIF to prevent layout shifts */}
          <div className="mt-4 w-48 h-48 flex items-center justify-center overflow-hidden">
            <video
              src={gif}
              alt="Blow Hard"
              className="w-full h-full object-contain"
              style={{
                opacity: showBlowGif ? 1 : 0,
                transition: "opacity 0.5s",
                willChange: "opacity",
              }}
              preload="metadata"
              playsInline
              muted
            />
          </div>
        </>
      )}

      {/* BLOWING */}
      {stage === "blowing" && (
        <img
          src="/bg/happy-birthday-23826_256.gif"
          alt="Blowing candle"
          className="w-72 md:w-80 animate-fadeIn"
          loading="lazy"
          decoding="async"
        />
      )}

      {/* AFTER */}
      {stage === "after" && (
        <>
          <img
            src="/bg/pngegg.png"
            alt="After blow"
            className="w-72 md:w-80 animate-fadeIn"
            loading="lazy"
            decoding="async"
          />

          <button
            onClick={goToEnvelope}
            className="mt-4 text-xl font-semibold bg-pink-400 text-white py-4 px-6 rounded-2xl"
          >
            🎊 Another Surprise 🎊
          </button>
        </>
      )}
    </div>
  );
});

CandleBlow.displayName = "CandleBlow";

export default CandleBlow;
