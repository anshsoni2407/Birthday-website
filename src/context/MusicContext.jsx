import { createContext, useContext, useRef, useState, useCallback } from "react";
import musicFile from "../assets/music.mp3";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;  // already playing → no-op
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  return (
    <MusicContext.Provider value={{ playMusic, pauseMusic, toggleMusic, isPlaying }}>
      {/* Single global audio element – never duplicated */}
      <audio ref={audioRef} src={musicFile} loop preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
