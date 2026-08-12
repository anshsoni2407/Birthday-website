import { useMemo } from "react";
import bgPhone from "../assets/Anuj/bgPhone.png";

/* ─────────────────────────────────────────────
   EMOJI DATA
───────────────────────────────────────────── */

const EmojiForBG = ["💖", "💕", "💞", "💝", "💖", "🦋"];

const EMOJI_COUNT = 6;

const EMOJI_ITEMS = Array.from({ length: EMOJI_COUNT }, (_, i) => ({
  id: i,

  char: EmojiForBG[i % EmojiForBG.length],

  /* Natural screen distribution */
  left: `${((i * 19 + 5) % 94) + 3}%`,
  top: `${((i * 31 + 8) % 88) + 4}%`,

  /* Emoji size */
  size: 28 + (i % 5) * 4,

  /*
      Longer durations = smoother movement.
      Avoid very short animations because they
      can look jittery.
    */
  duration: 5.5 + (i % 4) * 1.2,

  /* Stagger animation start */
  delay: (i * 0.8) % 5,

  /*
      Slightly different floating distance
      for each emoji.
    */
  floatDistance: 8 + (i % 4) * 3,
}));

/* ─────────────────────────────────────────────
   SMOOTH EMOJI ANIMATION
───────────────────────────────────────────── */

const EMOJI_BG_STYLES = `
  /*
    Smooth floating animation.

    Important:
    - translate3d() instead of translateY()
    - No aggressive scale changes
    - No rotation
    - Slow movement
    - Smooth opacity breathing
  */

  @keyframes emoji-float-smooth {

    0% {
      transform: translate3d(0, 8px, 0);
      opacity: 0.35;
    }

    25% {
      transform: translate3d(0, 3px, 0);
      opacity: 0.48;
    }

    50% {
      transform: translate3d(0, -8px, 0);
      opacity: 0.65;
    }

    75% {
      transform: translate3d(0, -3px, 0);
      opacity: 0.48;
    }

    100% {
      transform: translate3d(0, 8px, 0);
      opacity: 0.35;
    }
  }


  .emoji-bg-item {

    position: absolute;

    pointer-events: none;

    user-select: none;

    /*
      GPU compositing.
      Helps keep the animation smooth.
    */
    transform: translate3d(0, 0, 0);

    /*
      Only animate properties that actually change.
    */
    animation-name: emoji-float-smooth;

    animation-timing-function: ease-in-out;

    animation-iteration-count: infinite;

    animation-fill-mode: both;

    /*
      Tell browser these properties will animate.
    */
    will-change: transform, opacity;

    /*
      Prevent weird sub-pixel rendering.
    */
    backface-visibility: hidden;

    -webkit-backface-visibility: hidden;

    /*
      Keep emoji centered while moving.
    */
    transform-origin: center center;

    /*
      Prevent text selection/highlight.
    */
    -webkit-user-select: none;

    /*
      Prevent touch interaction.
    */
    touch-action: none;
  }


  /*
    Mobile devices:
    Keep animation subtle because mobile GPUs
    have less available rendering power.
  */

  @media (max-width: 640px) {

    .emoji-bg-item {
      animation-timing-function: ease-in-out;
    }

  }


  /*
    Accessibility:
    Disable animation when user has requested
    reduced motion.
  */

  @media (prefers-reduced-motion: reduce) {

    .emoji-bg-item {

      animation: none !important;

      opacity: 0.4 !important;

      transform: translate3d(0, 0, 0) !important;

    }

  }
`;

/* ─────────────────────────────────────────────
   BACKGROUND COMPONENT
───────────────────────────────────────────── */

export default function Background({ overlay, children }) {
  /*
    Emoji elements are static.
    They don't need to be recreated on every render.
  */

  const emojiElements = useMemo(
    () =>
      EMOJI_ITEMS.map((emoji) => (
        <span
          key={emoji.id}
          className="emoji-bg-item"
          style={{
            left: emoji.left,
            top: emoji.top,

            fontSize: `${emoji.size}px`,

            /*
              Different speed for each emoji.
            */
            animationDuration: `${emoji.duration}s`,

            /*
              Different starting point.
            */
            animationDelay: `${emoji.delay}s`,
          }}
          aria-hidden="true"
        >
          {emoji.char}
        </span>
      )),
    [],
  );

  return (
    <div
      className="
        relative
        min-h-dvh
        w-full
        overflow-x-hidden
        bg-cover
        bg-center
        bg-no-repeat
        text-white
      "
      style={{
        backgroundImage: `url(${bgPhone})`,
      }}
    >
      {/* Emoji animation styles */}

      <style>{EMOJI_BG_STYLES}</style>

      {/* Optional overlay */}

      {overlay && (
        <div
          className={`
            absolute
            inset-0
            ${overlay}
          `}
          aria-hidden="true"
        />
      )}

      {/* Animated emoji background */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          overflow-hidden
        "
        aria-hidden="true"
      >
        {emojiElements}
      </div>

      {/* Main content */}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
