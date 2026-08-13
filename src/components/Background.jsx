import { useMemo } from "react";
import bgPhone from "../assets/Anuj/bgPhone.png";

/* ─────────────────────────────────────────────
   EMOJI DATA — background decorations
───────────────────────────────────────────── */

const EmojiForBG = ["💖", "💕", "💞", "💝", "💖", "🦋"];

const EMOJI_COUNT = 6;

const EMOJI_ITEMS = Array.from({ length: EMOJI_COUNT }, (_, i) => ({
  id: i,
  char: EmojiForBG[i % EmojiForBG.length],
  left: `${((i * 19 + 5) % 94) + 3}%`,
  top: `${((i * 31 + 8) % 88) + 4}%`,
  size: 28 + (i % 5) * 4,
  duration: 5.5 + (i % 4) * 1.2,
  delay: (i * 0.8) % 5,
  floatDistance: 8 + (i % 4) * 3,
}));

/* ─────────────────────────────────────────────
   FLOATING HEARTS — moved from Envelope.jsx
───────────────────────────────────────────── */

const HEART_COUNT = 10;

const HEART_ITEMS = Array.from({ length: HEART_COUNT }, (_, i) => ({
  id: i,
  left: `${5 + ((i * 9.5) % 90)}%`,
  size: 14 + (i % 4) * 3,
  delay: (i * 1.1) % 8,
  duration: 8 + (i % 5) * 2,
}));

/* ─────────────────────────────────────────────
   CSS ANIMATIONS
───────────────────────────────────────────── */

const BG_STYLES = `
  /* ── Emoji breathing float ──────────────── */
  @keyframes emoji-float-smooth {
    0%   { transform: translate3d(0,  8px, 0); opacity: 0.35; }
    25%  { transform: translate3d(0,  3px, 0); opacity: 0.48; }
    50%  { transform: translate3d(0, -8px, 0); opacity: 0.65; }
    75%  { transform: translate3d(0, -3px, 0); opacity: 0.48; }
    100% { transform: translate3d(0,  8px, 0); opacity: 0.35; }
  }

  .emoji-bg-item {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transform: translate3d(0, 0, 0);
    animation-name: emoji-float-smooth;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    will-change: transform, opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-origin: center center;
    -webkit-user-select: none;
    touch-action: none;
  }

  /* ── Floating hearts — rise gently ─────── */
  @keyframes heart-rise {
    0%   { transform: translate3d(0, 0, 0) scale(1);   opacity: 0; }
    10%  { opacity: 0.6; }
    50%  { transform: translate3d(6px, -45vh, 0) scale(1.05); opacity: 0.75; }
    100% { transform: translate3d(-4px, -95vh, 0) scale(0.9); opacity: 0; }
  }

  .heart-bg-item {
    position: absolute;
    bottom: -30px;
    pointer-events: none;
    user-select: none;
    animation-name: heart-rise;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    will-change: transform, opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-user-select: none;
    touch-action: none;
    filter: drop-shadow(0 0 6px rgba(244,114,182,0.3));
  }

  /* ── Accessibility ─────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .emoji-bg-item {
      animation: none !important;
      opacity: 0.4 !important;
      transform: translate3d(0, 0, 0) !important;
    }
    .heart-bg-item {
      animation: none !important;
      opacity: 0.3 !important;
      transform: translate3d(0, -40vh, 0) !important;
    }
  }
`;

/* ─────────────────────────────────────────────
   BACKGROUND COMPONENT
───────────────────────────────────────────── */

export default function Background({ overlay, children }) {
  const emojiElements = useMemo(
    () =>
      EMOJI_ITEMS.map((e) => (
        <span
          key={`emoji-${e.id}`}
          className="emoji-bg-item"
          style={{
            left: e.left,
            top: e.top,
            fontSize: `${e.size}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
          aria-hidden="true"
        >
          {e.char}
        </span>
      )),
    [],
  );

  const heartElements = useMemo(
    () =>
      HEART_ITEMS.map((h) => (
        <span
          key={`heart-${h.id}`}
          className="heart-bg-item"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
          aria-hidden="true"
        >
          ❤️
        </span>
      )),
    [],
  );

  return (
    <div
      className="relative min-h-dvh w-full overflow-x-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${bgPhone})` }}
    >
      <style>{BG_STYLES}</style>

      {overlay && <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />}

      {/* Decorative layers — behind content */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {emojiElements}
        {heartElements}
      </div>

      {/* Page content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
