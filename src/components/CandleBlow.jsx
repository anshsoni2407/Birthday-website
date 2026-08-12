import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";

/* ──────────────────────────────────────
   MIC METER COLORS
────────────────────────────────────── */

const getBarColor = (v) => {
  if (v <= 20) {
    return "linear-gradient(90deg, #6b7280, #9ca3af)";
  }

  if (v <= 50) {
    return "linear-gradient(90deg, #3b82f6, #60a5fa)";
  }

  if (v <= 70) {
    return "linear-gradient(90deg, #f97316, #fb923c)";
  }

  return "linear-gradient(90deg, #22c55e, #4ade80)";
};

const getGlowColor = (v) => {
  if (v <= 20) return "rgba(107,114,128,0.35)";
  if (v <= 50) return "rgba(59,130,246,0.45)";
  if (v <= 70) return "rgba(249,115,22,0.45)";

  return "rgba(34,197,94,0.55)";
};

/* ──────────────────────────────────────
   CANDLE BLOW
────────────────────────────────────── */

const CandleBlow = memo(() => {
  const [stage, setStage] = useState("before");
  const [listening, setListening] = useState(false);
  const [micStrength, setMicStrength] = useState(0);

  const blownRef = useRef(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  /* Important: stores the 2.5 second transition timer */
  const stageTimeoutRef = useRef(null);

  /* Prevent multiple mic sessions */
  const startingMicRef = useRef(false);

  const navigate = useNavigate();

  /* ──────────────────────────────────────
     STOP MICROPHONE
  ────────────────────────────────────── */

  const stopMicrophone = useCallback(async () => {
    /* Stop animation loop */

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    /* Stop microphone tracks */

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());

      streamRef.current = null;
    }

    /* Close AudioContext */

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        await audioContextRef.current.close();
      } catch (error) {
        // Ignore already-closed context errors
      }
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;

    startingMicRef.current = false;
  }, []);

  /* ──────────────────────────────────────
     RESET EVERYTHING
  ────────────────────────────────────── */

  const resetCandle = useCallback(() => {
    /* Cancel previous after-blow timeout */

    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }

    /* Stop old microphone session */

    stopMicrophone();

    /* VERY IMPORTANT:
       Allow the next blow to trigger again.
    */

    blownRef.current = false;

    /* Reset UI */

    setStage("before");
    setListening(false);
    setMicStrength(0);
  }, [stopMicrophone]);

  /* ──────────────────────────────────────
     DETECT BLOW
  ────────────────────────────────────── */

  const detectBlow = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || blownRef.current) {
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const raw =
      dataArrayRef.current.reduce((total, value) => total + value, 0) /
      dataArrayRef.current.length;

    const strength = Math.min(100, Math.round((raw / 128) * 100));

    setMicStrength(strength);

    /* ─────────────────────────────
       BLOW DETECTED
    ───────────────────────────── */

    if (strength >= 70) {
      if (blownRef.current) {
        return;
      }

      blownRef.current = true;

      /* Stop microphone immediately */

      stopMicrophone();

      setListening(false);
      setMicStrength(0);
      setStage("blowing");

      /* Clear any previous timer */

      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
      }

      /* After GIF/animation */

      stageTimeoutRef.current = setTimeout(() => {
        setStage("after");
        stageTimeoutRef.current = null;
      }, 2500);

      return;
    }

    /* Continue monitoring */

    animationRef.current = requestAnimationFrame(detectBlow);
  }, [stopMicrophone]);

  /* ──────────────────────────────────────
     START MICROPHONE
  ────────────────────────────────────── */

  const startListening = useCallback(async () => {
    /* Prevent double-click / multiple sessions */

    if (startingMicRef.current || listening || stage !== "before") {
      return;
    }

    startingMicRef.current = true;

    try {
      /* Make sure previous session is completely gone */

      await stopMicrophone();

      /* Reset blow state */

      blownRef.current = false;

      setMicStrength(0);

      /* Request microphone */

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      /* Create AudioContext */

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        throw new Error("Web Audio API is not supported");
      }

      const audioContext = new AudioContext();

      audioContextRef.current = audioContext;

      /* Some browsers start AudioContext suspended */

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      /* Create analyser */

      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;

      analyser.smoothingTimeConstant = 0.8;

      analyserRef.current = analyser;

      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      source.connect(analyser);

      setListening(true);

      startingMicRef.current = false;

      /* Start detection */

      detectBlow();
    } catch (error) {
      console.error("Microphone error:", error);

      startingMicRef.current = false;

      await stopMicrophone();

      setListening(false);

      alert("Microphone permission denied ❌");
    }
  }, [listening, stage, stopMicrophone, detectBlow]);

  /* ──────────────────────────────────────
     GO TO ENVELOPE
  ────────────────────────────────────── */

  const goToEnvelope = useCallback(() => {
    resetCandle();
    navigate("/date-lock");
  }, [resetCandle, navigate]);

  /* ──────────────────────────────────────
     INITIAL RESET
  ────────────────────────────────────── */

  useEffect(() => {
    blownRef.current = false;

    setStage("before");
    setListening(false);
    setMicStrength(0);
  }, []);

  /* ──────────────────────────────────────
     COMPLETE CLEANUP
  ────────────────────────────────────── */

  useEffect(() => {
    return () => {
      /* Cancel stage transition */

      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
        stageTimeoutRef.current = null;
      }

      /* Stop animation */

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);

        animationRef.current = null;
      }

      /* Stop microphone */

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
      }

      /* Close AudioContext */

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close().catch(() => {});
      }

      audioContextRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
    };
  }, []);

  /* ──────────────────────────────────────
     UI
  ────────────────────────────────────── */

  return (
    <Background overlay="bg-black/10">
      <div
        className="
          min-h-dvh
          w-full
          flex
          flex-col
          items-center
          justify-center
          px-4
          py-8
          text-white
        "
      >
        {/* HEADER */}

        <h1
          className="
            text-3xl
            md:text-4xl
            font-bold
            mb-6
            text-center
            drop-shadow-lg
            animate-pulse
          "
        >
          🎉 Happy Birthday 🎉
        </h1>

        {/* ═══════════════════════════
            BEFORE
        ═══════════════════════════ */}

        {stage === "before" && (
          <>
            <div className="flex items-center justify-center w-full">
              <img
                src="/bg/ChatGPT_Image_Jan_17__2026__02_33_21_AM-removebg-preview.png"
                alt="Cake with candle"
                className="
                  w-72
                  md:w-80
                  max-w-full
                  animate-fadeIn
                  drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]
                "
                loading="eager"
                decoding="async"
              />
            </div>

            {/* START MIC */}

            <button
              onClick={startListening}
              disabled={startingMicRef.current}
              className="
                mt-6
                px-8
                py-3
                rounded-full
                bg-pink-500
                hover:bg-pink-600
                active:scale-95
                transition-all
                shadow-[0_10px_30px_rgba(236,72,153,0.35)]
                text-lg
                font-semibold
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {listening ? "Blow the Candle 💨" : "Start Mic 🎤"}
            </button>

            {/* INSTRUCTION */}

            {listening && (
              <p
                className="
                  mt-4
                  text-lg
                  font-medium
                  animate-bounce
                  text-white
                  drop-shadow-md
                "
              >
                Blow into the mic 🎂
              </p>
            )}

            {/* MIC METER */}

            {listening && (
              <div
                className="
                  w-full
                  max-w-[360px]
                  mt-5
                  px-4
                  py-4
                  rounded-2xl
                  bg-black/20
                  backdrop-blur-md
                  border
                  border-white/15
                  shadow-xl
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                    text-sm
                  "
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎤</span>

                    <span>Mic Strength</span>
                  </div>

                  <span className="font-bold text-base">{micStrength}</span>
                </div>

                <div
                  className="
                    relative
                    w-full
                    h-3
                    rounded-full
                    bg-white/15
                    overflow-visible
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      transition-[width]
                      duration-75
                    "
                    style={{
                      width: `${micStrength}%`,
                      background: getBarColor(micStrength),
                      boxShadow: `
                        0 0 14px 2px
                        ${getGlowColor(micStrength)}
                      `,
                    }}
                  />

                  <div
                    className="
                      absolute
                      top-1/2
                      -translate-y-1/2
                      w-[2px]
                      h-6
                      bg-white
                    "
                    style={{
                      left: "70%",
                    }}
                  >
                    <span
                      className="
                        absolute
                        -top-6
                        left-1/2
                        -translate-x-1/2
                        text-[11px]
                        text-white/80
                      "
                    >
                      70
                    </span>
                  </div>
                </div>

                <p
                  className="
                    text-center
                    text-sm
                    text-white/70
                    mt-3
                  "
                >
                  {micStrength < 20
                    ? "Blow harder…"
                    : micStrength < 70
                      ? "Almost there — keep going!"
                      : "🔥 Full power!"}
                </p>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════
            BLOWING
        ═══════════════════════════ */}

        {stage === "blowing" && (
          <div className="flex items-center justify-center">
            <img
              src="/bg/happy-birthday-23826_256.gif"
              alt="Blowing candle"
              className="
                w-72
                md:w-80
                max-w-full
                animate-fadeIn
                drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]
              "
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* ═══════════════════════════
            AFTER
        ═══════════════════════════ */}

        {stage === "after" && (
          <>
            <div className="flex items-center justify-center">
              <img
                src="/bg/pngegg.png"
                alt="After blow"
                className="
                  w-72
                  md:w-80
                  max-w-full
                  animate-fadeIn
                  drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]
                "
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* ─────────────────────
                RELIGHT
            ───────────────────── */}

            <button
              onClick={resetCandle}
              className="
                mt-6
                text-md
                md:text-lg
                font-semibold
                bg-[#ecab4a]
                hover:bg-pink-500
                active:scale-95
                text-white
                py-2
                px-4
                rounded-2xl
                shadow-[0_10px_30px_rgba(244,114,182,0.35)]
                transition-all
              "
            >
              Relight 🕯️
            </button>

            {/* NEXT SURPRISE */}

            <button
              onClick={goToEnvelope}
              className="
                mt-6
                text-lg
                md:text-xl
                font-semibold
                bg-pink-400
                hover:bg-pink-500
                active:scale-95
                text-white
                py-4
                px-6
                rounded-2xl
                shadow-[0_10px_30px_rgba(244,114,182,0.35)]
                transition-all
              "
            >
              🎊 Another Surprise 🎊
            </button>
          </>
        )}
      </div>
    </Background>
  );
});

CandleBlow.displayName = "CandleBlow";

export default CandleBlow;
