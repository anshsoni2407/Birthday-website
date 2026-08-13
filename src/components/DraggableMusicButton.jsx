import { useRef, useState, useCallback, useEffect } from "react";
import { useMusic } from "../context/MusicContext";

/* ─────────────────────────────────────────────
   CSS for the draggable music button
───────────────────────────────────────────── */

const MUSIC_BTN_STYLES = `
  @keyframes music-btn-pulse {
    0%, 100% { box-shadow: 0 4px 20px rgba(236,72,153,0.25); }
    50%      { box-shadow: 0 4px 28px rgba(236,72,153,0.45); }
  }

  .music-btn {
    position: fixed;
    z-index: 9990;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background 200ms, border-color 200ms;
    animation: music-btn-pulse 3s ease-in-out infinite;
  }

  .music-btn:active {
    cursor: grabbing;
  }

  .music-btn-playing {
    background: rgba(244, 114, 182, 0.85);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .music-btn-paused {
    background: rgba(40, 40, 60, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (prefers-reduced-motion: reduce) {
    .music-btn {
      animation: none !important;
    }
  }
`;

/* ─────────────────────────────────────────────
   DRAGGABLE MUSIC BUTTON
───────────────────────────────────────────── */

export default function DraggableMusicButton() {
  const { toggleMusic, isPlaying } = useMusic();

  /* Position state — bottom-right by default */
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const btnRef = useRef(null);

  /* Initialize position on mount */
  useEffect(() => {
    setPos({
      x: window.innerWidth - 68,
      y: window.innerHeight - 80,
    });
  }, []);

  /* ── Clamp to viewport ──────────────────── */
  const clamp = useCallback((x, y) => {
    const size = 52;
    return {
      x: Math.max(4, Math.min(x, window.innerWidth - size - 4)),
      y: Math.max(4, Math.min(y, window.innerHeight - size - 4)),
    };
  }, []);

  /* ── Pointer handlers ───────────────────── */
  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      dragging.current = true;
      hasMoved.current = false;
      offset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
      btnRef.current?.setPointerCapture(e.pointerId);
    },
    [pos],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      hasMoved.current = true;
      const next = clamp(e.clientX - offset.current.x, e.clientY - offset.current.y);
      setPos(next);
    },
    [clamp],
  );

  const onPointerUp = useCallback(
    (e) => {
      if (!dragging.current) return;
      dragging.current = false;
      btnRef.current?.releasePointerCapture(e.pointerId);

      /* Only toggle music if user didn't drag */
      if (!hasMoved.current) {
        toggleMusic();
      }
    },
    [toggleMusic],
  );

  /* Don't render until we have a position */
  if (pos.x < 0) return <style>{MUSIC_BTN_STYLES}</style>;

  return (
    <>
      <style>{MUSIC_BTN_STYLES}</style>
      <div
        ref={btnRef}
        role="button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        tabIndex={0}
        className={`music-btn ${isPlaying ? "music-btn-playing" : "music-btn-paused"}`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMusic();
          }
        }}
      >
        {isPlaying ? "🎵" : "🔇"}
      </div>
    </>
  );
}
