import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { Star, Sparkles, X } from "lucide-react";
import { balloonWishes } from "@/data/birthday";
import { playSfx } from "./MusicController";

type BalloonInstance = {
  id: number;
  startX: number;
  speed: number;
  delay: number;
  size: number;
  color1: string;
  color2: string;
  color3: string;
  swayDist: number;
};

// Sophisticated Natural Pastel / Terracotta Tones
const BALLOON_PRESETS = [
  { color1: "#FCEFEA", color2: "#C86D58", color3: "#8C4332" }, // Muted Coral
  { color1: "#EBF3F6", color2: "#527A8A", color3: "#325360" }, // Dusty Blue
  { color1: "#FAF3E6", color2: "#D99E43", color3: "#9E6E24" }, // Warm Gold
  { color1: "#EEF4EE", color2: "#7E987F", color3: "#4F6650" }, // Soft Sage
  { color1: "#F8EDEF", color2: "#C27E89", color3: "#8A4C56" }, // Faded Rose
];

// Deterministic offsets for consistent SSR hydration
const INITIAL_BALLOONS: BalloonInstance[] = Array.from({ length: 10 }, (_, i) => {
  const preset = BALLOON_PRESETS[i % BALLOON_PRESETS.length]!;
  const offset = ((i * 3) % 5) - 2;
  const speedOffset = (i * 2.5) % 7;
  const sizeOffset = (i * 4) % 14;
  const swayOffset = (i * 1.5) % 6;
  return {
    id: i,
    startX: 6 + i * 9.5 + offset * 0.4,
    speed: 13 + speedOffset,
    delay: (i * 1.5) % 9,
    size: 58 + sizeOffset,
    color1: preset.color1,
    color2: preset.color2,
    color3: preset.color3,
    swayDist: 8 + swayOffset,
  };
});

export function Balloons() {
  const [balloons] = useState<BalloonInstance[]>(INITIAL_BALLOONS);
  const [poppedIds, setPoppedIds] = useState<Set<number>>(new Set());
  const [activeNote, setActiveNote] = useState<{ id: number; text: string; top: number } | null>(null);

  const blastBalloon = (id: number, clientX: number, clientY: number) => {
    playSfx("pop");
    setPoppedIds((prev) => new Set(prev).add(id));

    confetti({
      particleCount: 32,
      spread: 60,
      startVelocity: 26,
      origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
      colors: ["#C86D58", "#527A8A", "#D99E43", "#7E987F", "#C27E89"],
    });

    const msg = balloonWishes[id % balloonWishes.length] ?? "You make every single day brighter!";

    // Clamp vertical position safely within viewport
    const vh = typeof window !== "undefined" ? window.innerHeight : 667;
    const safeTop = Math.min(Math.max(clientY - 70, 90), vh - 220);

    setActiveNote({
      id,
      text: msg,
      top: safeTop,
    });

    // Auto-dismiss after 6 seconds
    window.setTimeout(() => {
      setActiveNote((curr) => (curr?.id === id ? null : curr));
    }, 6000);

    // Respawn balloon after 9 seconds
    window.setTimeout(() => {
      setPoppedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 9000);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden w-full max-w-full">
      <AnimatePresence>
        {balloons.map((b) => {
          if (poppedIds.has(b.id)) return null;

          return (
            <motion.div
              key={b.id}
              className="pointer-events-auto absolute cursor-pointer touch-manipulation"
              data-cursor="CLICK"
              style={{ left: `${b.startX}%` }}
              initial={{ y: "115vh", opacity: 0, scale: 1 }}
              animate={{
                y: ["115vh", "-25vh"],
                x: [-b.swayDist, b.swayDist, -b.swayDist],
                rotate: [-3, 3, -3],
                opacity: [0, 0.95, 0.95, 0.85, 0],
                scale: 1,
              }}
              exit={{
                scale: [1, 1.4, 0],
                opacity: [1, 1, 0],
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              transition={{
                y: { duration: b.speed, repeat: Infinity, ease: "linear", delay: b.delay },
                x: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: b.speed, repeat: Infinity, ease: "linear", delay: b.delay },
              }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                blastBalloon(b.id, e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                const touch = e.touches[0];
                if (touch) {
                  blastBalloon(b.id, touch.clientX, touch.clientY);
                }
              }}
            >
              {/* Photorealistic Matte Shaded Balloon */}
              <svg
                width={b.size}
                height={b.size * 1.5}
                viewBox="0 0 100 150"
                className="filter drop-shadow-[0_8px_16px_rgba(40,32,28,0.12)]"
              >
                <defs>
                  <radialGradient id={`balloon-body-${b.id}`} cx="34%" cy="30%" r="66%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                    <stop offset="22%" stopColor={b.color1} stopOpacity="0.9" />
                    <stop offset="60%" stopColor={b.color2} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={b.color3} stopOpacity="0.9" />
                  </radialGradient>

                  <linearGradient id={`balloon-glint-${b.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <ellipse cx="50" cy="52" rx="42" ry="50" fill={`url(#balloon-body-${b.id})`} />
                <ellipse cx="35" cy="34" rx="8" ry="15" transform="rotate(-22 35 34)" fill={`url(#balloon-glint-${b.id})`} />
                <circle cx="30" cy="24" r="2.5" fill="#FFFFFF" opacity="0.85" />
                <polygon points="50,102 44,107 56,107" fill={b.color3} />
                <path d="M 50 107 Q 56 118, 46 130 T 52 146" fill="none" stroke={b.color3} strokeWidth="1" opacity="0.6" />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Pop Wish Card (Always 100% visible, centered horizontally on mobile, never cut off) */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="fixed z-50 left-4 right-4 mx-auto w-[calc(100vw-32px)] max-w-[320px] rounded-3xl bg-white p-5 text-center shadow-2xl border-2 border-white pointer-events-auto select-none"
            style={{
              top: `${activeNote.top}px`,
              boxShadow: "0 25px 60px -15px rgba(40, 32, 28, 0.4), 0 0 0 1px rgba(230, 220, 205, 0.8)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              className="absolute top-3 right-3 text-[#706259] hover:text-[#1E1613] p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Dismiss note"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#D99E43]/15 text-[#D99E43]">
              <Star className="h-4.5 w-4.5 fill-current" />
            </div>

            <p className="font-display text-base sm:text-lg font-bold text-[#1E1613] leading-snug px-1">
              &ldquo;{activeNote.text}&rdquo;
            </p>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest text-[#C86D58] font-bold">
              <Sparkles className="h-3 w-3" />
              <span>Birthday Wish</span>
              <Sparkles className="h-3 w-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
