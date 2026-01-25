import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CandleBlow = () => {
  const [stage, setStage] = useState("before"); // before | blowing | after
  const [listening, setListening] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);

  const navigate = useNavigate();

  /* 🔁 Reset stage when page loads */
  useEffect(() => {
    setStage("before");
    setListening(false);
  }, []);

  // 🎤 Start mic & detect blow
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
  };

  // 💨 Detect air blow
  const detectBlow = () => {
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const volume =
      dataArrayRef.current.reduce((a, b) => a + b, 0) /
      dataArrayRef.current.length;

    if (volume > 40) {
      blowCandle();
      return;
    }

    animationRef.current = requestAnimationFrame(detectBlow);
  };

  const blowCandle = () => {
    cancelAnimationFrame(animationRef.current);
    setListening(false);
    setStage("blowing");

    setTimeout(() => {
      setStage("after");
    }, 2500);
  };

  const resetCandle = () => {
    setStage("before");
    setListening(false);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
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
            className="w-72 md:w-80 animate-fadeIn"
          />

          <button
            onClick={startListening}
            className="mt-6 px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-all shadow-lg text-lg font-semibold"
          >
            {listening ? "Blow the Candle 💨" : "Start Mic 🎤"}
          </button>

          {listening && (
            <p className="mt-4 text-lg animate-bounce">Blow into the mic 🎂</p>
          )}
        </>
      )}

      {/* BLOWING */}
      {stage === "blowing" && (
        <img
          src="/bg/happy-birthday-23826_256.gif"
          alt="Blowing candle"
          className="w-72 md:w-80 animate-fadeIn"
        />
      )}

      {/* AFTER */}
      {stage === "after" && (
        <>
          <img
            src="/bg/pngegg.png"
            alt="After blow"
            className="w-72 md:w-80 animate-fadeIn"
          />

          <button
            onClick={() => {
              resetCandle();
              navigate("/video");
            }}
            className="mt-4 text-xl font-semibold bg-pink-400 text-white py-4 px-6 rounded-2xl"
          >
            🎊 Another Surprise 🎊
          </button>
        </>
      )}
    </div>
  );
};

export default CandleBlow;
