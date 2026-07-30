import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

/* ──────────────────────────────────────
   Helper: pick gradient color by strength
   ────────────────────────────────────── */
const getBarColor = (v) => {
  if (v <= 20) return "linear-gradient(90deg, #6b7280, #9ca3af)";       // Gray
  if (v <= 50) return "linear-gradient(90deg, #3b82f6, #60a5fa)";       // Blue
  if (v <= 90) return "linear-gradient(90deg, #f97316, #fb923c)";       // Orange
  return "linear-gradient(90deg, #22c55e, #4ade80)";                    // Green
};

const getGlowColor = (v) => {
  if (v <= 20) return "rgba(107,114,128,0.35)";
  if (v <= 50) return "rgba(59,130,246,0.45)";
  if (v <= 90) return "rgba(249,115,22,0.45)";
  return "rgba(34,197,94,0.55)";
};

const CandleBlow = memo(() => {
  const [stage, setStage] = useState("before"); // before | blowing | after
  const [listening, setListening] = useState(false);
  const [micStrength, setMicStrength] = useState(0);

  const blownRef = useRef(false);
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

  // 💨 Detect air blow – uses refs to avoid stale closures
  const detectBlow = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const raw =
      dataArrayRef.current.reduce((a, b) => a + b, 0) /
      dataArrayRef.current.length;

    // Map raw analyser volume (typically 0‑128) → 0‑100 for the meter
    const strength = Math.min(100, Math.round((raw / 128) * 100));

    // Update meter in every frame for smooth animation
    setMicStrength(strength);

    // strength >= 90 → blow candle
    if (strength >= 90) {
      if (!blownRef.current) {
        blownRef.current = true;
        cancelAnimationFrame(animationRef.current);
        setListening(false);
        setMicStrength(0);
        setStage("blowing");
        setTimeout(() => {
          setStage("after");
        }, 2500);
      }
      return; // stop further monitoring
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

          {/* Instruction text – only when listening */}
          {listening && (
            <p className="mt-4 text-lg animate-bounce">Blow into the mic 🎂</p>
          )}

          {/* ── Mic Strength Meter ── */}
          {listening && (
            <div className="mic-meter-wrapper">
              {/* Label */}
              <div className="mic-meter-label">
                <span className="mic-meter-icon">🎤</span>
                <span>
                  Mic Strength:{" "}
                  <span className="mic-meter-value">{micStrength}</span>
                </span>
              </div>

              {/* Track */}
              <div className="mic-meter-track">
                {/* Fill */}
                <div
                  className="mic-meter-fill"
                  style={{
                    width: `${micStrength}%`,
                    background: getBarColor(micStrength),
                    boxShadow: `0 0 14px 2px ${getGlowColor(micStrength)}`,
                  }}
                />

                {/* Threshold marker at 90 */}
                <div className="mic-meter-threshold" title="Blow threshold (90)">
                  <span className="mic-meter-threshold-label">90</span>
                </div>
              </div>

              {/* Hint */}
              <p className="mic-meter-hint">
                {micStrength < 20
                  ? "Blow harder…"
                  : micStrength < 90
                    ? "Almost there — keep going!"
                    : "🔥 Full power!"}
              </p>
            </div>
          )}
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
