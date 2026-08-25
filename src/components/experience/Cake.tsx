import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/data/birthday";

const CANDLES = [0, 1, 2, 3, 4];

/** Interactive "make a wish" cake — candles blow out one by one. */
export function Cake() {
  const [out, setOut] = useState<number[]>([]);
  const done = out.length === CANDLES.length;

  const blow = (i: number) => {
    if (out.includes(i)) return;
    const next = [...out, i];
    setOut(next);
    if (next.length === CANDLES.length) {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.7 }, colors: ["#f7b9c8", "#f8d8a8", "#d9c4f5", "#bcd9f5"] });
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        aria-hidden
        className="absolute -top-10 h-64 w-64 rounded-full blur-3xl"
        animate={{ opacity: done ? 0.2 : 0.6, scale: done ? 0.9 : [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: done ? 0 : Infinity }}
        style={{ background: "var(--gold)" }}
      />
      <p className="relative mb-4 font-display text-xl text-ink/70">
        {done ? "Wish made." : "Make a wish — blow out the candles"}
      </p>

      <div className="relative preserve-3d" style={{ perspective: 900 }}>
        <motion.div
          className="relative preserve-3d"
          animate={{ rotateX: 8, y: [0, -6, 0] }}
          transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        >
          {/* candles */}
          <div className="absolute -top-14 left-1/2 flex -translate-x-1/2 gap-4">
            {CANDLES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => blow(i)}
                aria-label={out.includes(i) ? `Candle ${i + 1} is out` : `Blow out candle ${i + 1}`}
                className="group relative h-16 w-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                style={{ background: "linear-gradient(180deg, #fff, var(--pink))" }}
              >
                <AnimatePresence>
                  {!out.includes(i) ? (
                    <motion.span
                      key="flame"
                      exit={{ opacity: 0, scale: 0.2, y: -8 }}
                      animate={{ scaleY: [1, 1.25, 0.95, 1.15, 1], scaleX: [1, 0.9, 1.05, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full"
                      style={{ background: "radial-gradient(circle at 50% 70%, #fff6c9, #ffb443 60%, #ff7a3d)", boxShadow: "0 0 22px 6px rgba(255,180,67,.55)" }}
                    />
                  ) : (
                    <motion.span
                      key="smoke"
                      initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
                      animate={{ opacity: 0, y: -50, scale: 1.6 }}
                      transition={{ duration: 2 }}
                      className="absolute -top-6 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-ink/25 blur-md"
                    />
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* cake body */}
          <div className="relative h-44 w-72 sm:w-80">
            <div className="absolute inset-x-0 top-0 h-10 rounded-t-[2rem]" style={{ background: "linear-gradient(180deg, #fff8ee, var(--pink))", boxShadow: "inset 0 -6px 12px rgba(0,0,0,.08)" }} />
            <div className="absolute inset-x-0 top-8 h-16" style={{ background: "linear-gradient(180deg, var(--peach), var(--gold))" }} />
            <div className="absolute inset-x-0 top-[5.5rem] h-14 rounded-b-3xl" style={{ background: "linear-gradient(180deg, var(--lavender), var(--pink))" }} />
            <div className="absolute inset-0 rounded-b-3xl rounded-t-[2rem]" style={{ boxShadow: "var(--shadow-lift)" }} />
          </div>
          <div className="mx-auto h-3 w-80 max-w-full rounded-full bg-ink/15 blur-md" />
        </motion.div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-md text-center font-display text-2xl text-ink"
          >
            Whatever you wished for, {birthdayConfig.name.split(" ")[0]} — I hope it shows up loudly.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
