import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Star, RotateCcw } from "lucide-react";
import { birthdayConfig } from "@/data/birthday";
import { memories } from "@/data/memories";
import { playSfx } from "./MusicController";

type Props = {
  show: boolean;
  onReset: () => void;
};

export function FinalCelebration({ show, onReset }: Props) {
  useEffect(() => {
    if (!show) return;

    // Celebration confetti cannon
    const end = Date.now() + 3.5 * 1000;
    const colors = ["#D99E43", "#C86D58", "#527A8A", "#7E987F", "#C27E89", "#FFFFFF"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [show]);

  if (!show) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center overflow-y-auto px-4 py-12 select-none"
      style={{ background: "var(--gradient-finale)" }}
    >
      {/* Radiant Golden Sunlight Ray */}
      <div className="pointer-events-none absolute h-[80vmin] w-[80vmin] rounded-full bg-[#D99E43]/20 blur-[150px]" />

      {/* Floating Background Memory Snippets */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        {memories.slice(0, 4).map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ y: 80, opacity: 0 }}
            animate={{
              y: [0, -18, 0],
              rotate: [-2, 2, -2],
              opacity: 0.7,
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
            className="absolute h-36 w-28 sm:h-44 sm:w-36 rounded-2xl bg-white p-2 shadow-paper border border-[#E6DCCD]"
            style={{
              top: `${15 + i * 20}%`,
              left: i % 2 === 0 ? `${6 + i * 4}%` : undefined,
              right: i % 2 !== 0 ? `${6 + i * 4}%` : undefined,
            }}
          >
            <img src={m.image} alt="" className="h-full w-full object-cover rounded-xl" />
          </motion.div>
        ))}
      </div>

      {/* Center Celebration Card */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.2 }}
        className="relative z-10 mx-auto max-w-2xl text-center rounded-3xl bg-white p-8 sm:p-12 shadow-2xl border-2 border-white"
      >
        {/* Top Floating Badge */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#B85E48] to-[#D99E43] text-white shadow-xl">
          <Star className="h-8 w-8 fill-current" />
        </div>

        <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#C86D58]">
          Happy Birthday
        </span>

        <h2 className="mt-2 font-display text-[clamp(2.6rem,7.5vw,4.8rem)] font-bold text-[#1E1613] leading-tight">
          {birthdayConfig.name}
        </h2>

        <p className="mx-auto mt-4 max-w-lg font-display text-lg sm:text-xl text-[#1E1613] font-semibold leading-relaxed">
          &ldquo;{birthdayConfig.finalMessage}&rdquo;
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              onReset();
            }}
            className="flex items-center gap-2 rounded-full bg-[#1E1613] px-9 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lift hover:bg-black transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay The Experience</span>
          </button>
        </div>

        <p className="mt-8 text-xs font-bold text-[#C86D58] uppercase tracking-widest">
          Created with joy & best wishes ✨
        </p>
      </motion.div>
    </motion.section>
  );
}
