import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { useMusic } from "../context/MusicContext";

/* ─────────────────────────────────────────────────────────────────────────────
   CSS Keyframes & Curtain Styles
   Injected once via <style>. All animation is CSS-only for 60 fps on mobile.
   ───────────────────────────────────────────────────────────────────────────── */
const CURTAIN_STYLES = `
  /* ── Button breathing glow ────────────────────────────────── */
  @keyframes curtain-btn-glow {
    0%, 100% {
      opacity: 0.85;
      box-shadow: 0 0 18px 2px rgba(212, 175, 55, 0.25),
                  0 0 40px 4px rgba(212, 175, 55, 0.10);
      transform: scale(1);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 24px 6px rgba(212, 175, 55, 0.45),
                  0 0 60px 10px rgba(212, 175, 55, 0.18);
      transform: scale(1.03);
    }
  }
  .curtain-btn-glow {
    animation: curtain-btn-glow 2.8s ease-in-out infinite;
  }

  /* ── Curtain fold texture via repeating gradients ──────────── */
  .curtain-panel {
    /* Base velvet colour */
    background-color: #5a0a0a;

    /* Layered fold effect — alternating light / dark vertical stripes */
    background-image:
      /* Soft ambient light from above */
      linear-gradient(180deg,
        rgba(255, 200, 150, 0.08) 0%,
        transparent 35%,
        transparent 80%,
        rgba(0,0,0,0.25) 100%),
      /* Primary folds — wide */
      repeating-linear-gradient(90deg,
        rgba(0,0,0,0.0)   0px,
        rgba(0,0,0,0.22)  12px,
        rgba(180,40,40,0.10) 24px,
        rgba(255,100,100,0.07) 36px,
        rgba(0,0,0,0.18)  48px,
        rgba(0,0,0,0.0)   60px),
      /* Secondary folds — narrow, offset */
      repeating-linear-gradient(90deg,
        rgba(255,120,120,0.04) 0px,
        rgba(0,0,0,0.12)  8px,
        rgba(140,20,20,0.06) 16px,
        rgba(0,0,0,0.08)  24px),
      /* Depth: vertical gradient from rich top to dark bottom */
      linear-gradient(180deg,
        #8b1a1a 0%,
        #6b0f0f 30%,
        #4a0808 70%,
        #2d0404 100%);
  }

  /* Inner-edge shadow for the curtain meeting line */
  .curtain-left-inner {
    box-shadow: inset -20px 0 40px rgba(0,0,0,0.55),
                inset -4px  0 12px rgba(0,0,0,0.3);
  }
  .curtain-right-inner {
    box-shadow: inset 20px 0 40px rgba(0,0,0,0.55),
                inset 4px  0 12px rgba(0,0,0,0.3);
  }

  /* Outer-edge darkening */
  .curtain-left-outer::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 40%);
    pointer-events: none;
  }
  .curtain-right-outer::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(270deg, rgba(0,0,0,0.4) 0%, transparent 40%);
    pointer-events: none;
  }

  /* ── Curtain open animation ───────────────────────────────── */
  .curtain-open-left {
    animation: curtain-slide-left 1.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  }
  .curtain-open-right {
    animation: curtain-slide-right 1.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  }

  @keyframes curtain-slide-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-105%); }
  }
  @keyframes curtain-slide-right {
    0%   { transform: translateX(0); }
    100% { transform: translateX(105%); }
  }

  /* ── Button exit ──────────────────────────────────────────── */
  .curtain-btn-exit {
    animation: curtain-btn-out 300ms ease-in forwards;
  }
  @keyframes curtain-btn-out {
    0%   { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.85); }
  }

  /* ── Center line fade ─────────────────────────────────────── */
  .curtain-line-exit {
    animation: curtain-line-out 250ms ease-out forwards;
  }
  @keyframes curtain-line-out {
    0%   { opacity: 1; }
    100% { opacity: 0; }
  }

  /* ── Reduced-motion: skip animations ──────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .curtain-btn-glow,
    .curtain-open-left,
    .curtain-open-right,
    .curtain-btn-exit,
    .curtain-line-exit {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Draped Top Edge — the decorative valance / pelmet along the top
   ───────────────────────────────────────────────────────────────────────────── */
const TopValance = memo(() => (
  <div
    className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
    style={{
      height: "36px",
      background:
        "linear-gradient(180deg, #3a0505 0%, #5a0a0a 60%, transparent 100%)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    }}
  />
));
TopValance.displayName = "TopValance";

/* ─────────────────────────────────────────────────────────────────────────────
   CurtainIntro Component
   No <audio> element — uses global MusicContext instead.
   ───────────────────────────────────────────────────────────────────────────── */
const CurtainIntro = memo(({ onOpen }) => {
  const { playMusic } = useMusic();
  const [isOpening, setIsOpening] = useState(false);
  const hasTriggered = useRef(false);

  /* ── Handle "Open" click ──────────────────────────────────── */
  const handleOpen = useCallback(() => {
    if (hasTriggered.current) return; // prevent double-trigger
    hasTriggered.current = true;
    setIsOpening(true);

    // Start global music on user gesture (safe for autoplay policies)
    playMusic();
  }, [playMusic]);

  /* ── Fire onOpen after curtain animation completes ────────── */
  useEffect(() => {
    if (!isOpening) return;

    // Keep the curtain mounted for the full opening animation only.
    const timer = setTimeout(() => {
      onOpen();
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpening, onOpen]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: isOpening ? "transparent" : "#0a0a0a" }}
    >
      {/* Inject all keyframes/styles once */}
      <style>{CURTAIN_STYLES}</style>

      {/* ── Left Curtain ────────────────────────────────────── */}
      <div
        className={`
          absolute top-0 left-0 h-full w-1/2
          curtain-panel curtain-left-inner curtain-left-outer
          ${isOpening ? "curtain-open-left" : ""}
        `}
        style={{
          willChange: isOpening ? "transform" : "auto",
          contain: "layout style paint",
          zIndex: 10,
        }}
        aria-hidden="true"
      >
        {/* Highlight strip at the inner edge (center seam) */}
        <div
          className="absolute top-0 right-0 h-full pointer-events-none"
          style={{
            width: "3px",
            background:
              "linear-gradient(180deg, rgba(255,180,120,0.12) 0%, rgba(255,100,80,0.06) 50%, rgba(0,0,0,0.2) 100%)",
          }}
        />
      </div>

      {/* ── Right Curtain ───────────────────────────────────── */}
      <div
        className={`
          absolute top-0 right-0 h-full w-1/2
          curtain-panel curtain-right-inner curtain-right-outer
          ${isOpening ? "curtain-open-right" : ""}
        `}
        style={{
          willChange: isOpening ? "transform" : "auto",
          contain: "layout style paint",
          zIndex: 10,
        }}
        aria-hidden="true"
      >
        {/* Highlight strip at the inner edge (center seam) */}
        <div
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{
            width: "3px",
            background:
              "linear-gradient(180deg, rgba(255,180,120,0.12) 0%, rgba(255,100,80,0.06) 50%, rgba(0,0,0,0.2) 100%)",
          }}
        />
      </div>

      {/* ── Top Valance ─────────────────────────────────────── */}
      <TopValance />

      {/* ── Center Split Line ───────────────────────────────── */}
      <div
        className={`
          absolute left-1/2 top-0 h-full w-[2px] z-20
          ${isOpening ? "curtain-line-exit" : ""}
        `}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.6) 100%)",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />

      {/* ── Open Button ─────────────────────────────────────── */}
      {!isOpening ? (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <button
            onClick={handleOpen}
            aria-label="Open curtains"
            className={`
              curtain-btn-glow
              px-10 py-4
              rounded-full
              font-semibold text-lg tracking-wide
              cursor-pointer
              select-none
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60
            `}
            style={{
              background: "rgba(0, 0, 0, 0.55)",
              color: "#d4af37",
              border: "1px solid rgba(212, 175, 55, 0.45)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              fontFamily:
                "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            💖 Open
          </button>
        </div>
      ) : (
        /* Button exit animation — rendered briefly then fades out */
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div
            className="curtain-btn-exit px-10 py-4 rounded-full font-semibold text-lg tracking-wide"
            style={{
              background: "rgba(0, 0, 0, 0.55)",
              color: "#d4af37",
              border: "1px solid rgba(212, 175, 55, 0.45)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              fontFamily:
                "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
              letterSpacing: "0.04em",
            }}
            aria-hidden="true"
          >
            💖 Open
          </div>
        </div>
      )}
    </div>
  );
});

CurtainIntro.displayName = "CurtainIntro";

export default CurtainIntro;
