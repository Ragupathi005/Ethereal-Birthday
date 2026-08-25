import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { balloonMessages } from "@/data/birthday";

const BALLOONS = [
  { id: 0, x: "6%", y: "18%", hue: "var(--pink)", delay: 0, size: 108 },
  { id: 1, x: "18%", y: "58%", hue: "var(--lavender)", delay: 1.2, size: 86 },
  { id: 2, x: "82%", y: "22%", hue: "var(--peach)", delay: 0.6, size: 120 },
  { id: 3, x: "90%", y: "62%", hue: "var(--sky)", delay: 1.8, size: 78 },
  { id: 4, x: "34%", y: "8%", hue: "var(--gold)", delay: 2.2, size: 70 },
  { id: 5, x: "68%", y: "76%", hue: "var(--pink)", delay: 1.5, size: 92 },
];

export function Balloons() {
  const [popped, setPopped] = useState<number[]>([]);
  const [note, setNote] = useState<{ id: number; text: string } | null>(null);

  const pop = (id: number, e: React.MouseEvent) => {
    if (popped.includes(id)) return;
    setPopped((p) => [...p, id]);
    setNote({ id, text: balloonMessages[id % balloonMessages.length] });
    confetti({
      particleCount: 60,
      spread: 70,
      scalar: 0.8,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ["#f7b9c8", "#f8d8a8", "#d9c4f5", "#bcd9f5"],
    });
    window.setTimeout(() => setNote((n) => (n?.id === id ? null : n)), 3400);
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      {BALLOONS.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          <AnimatePresence>
            {!popped.includes(b.id) && (
              <motion.button
                type="button"
                aria-label="Pop a balloon for a hidden message"
                onClick={(e) => pop(b.id, e)}
                className="pointer-events-auto relative block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: [0, -14, 0], rotate: [-3, 3, -3] }}
                exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.22 } }}
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ y: { duration: 6 + b.delay, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1, delay: b.delay * 0.3 } }}
              >
                <svg width={b.size} height={b.size * 1.5} viewBox="0 0 100 150" aria-hidden>
                  <defs>
                    <radialGradient id={`bg-${b.id}`} cx="35%" cy="28%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.85" />
                      <stop offset="55%" stopColor={b.hue} />
                      <stop offset="100%" stopColor={b.hue} stopOpacity="0.85" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="50" cy="52" rx="38" ry="47" fill={`url(#bg-${b.id})`} />
                  <path d="M50 99 l-7 10 h14 z" fill={b.hue} />
                  <path d="M50 109 c12 12 -12 22 0 34 c10 10 -6 5 -2 7" stroke="var(--ink)" strokeOpacity="0.35" fill="none" strokeWidth="1.4" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {note?.id === b.id && (
              <motion.p
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: -24 }}
                className="glass-panel absolute left-1/2 top-0 w-52 -translate-x-1/2 rounded-2xl px-4 py-3 text-center text-sm text-ink"
              >
                {note.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
