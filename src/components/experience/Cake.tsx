import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Star, RotateCcw } from "lucide-react";
import { birthdayConfig } from "@/data/birthday";
import { playSfx } from "./MusicController";

export function Cake() {
  const [lit, setLit] = useState(true);

  const extinguish = () => {
    if (!lit) return;
    setLit(false);
    playSfx("cheer");

    confetti({
      particleCount: 140,
      spread: 90,
      startVelocity: 44,
      origin: { y: 0.58 },
      colors: ["#C86D58", "#D99E43", "#527A8A", "#7E987F", "#C27E89", "#FFFFFF"],
    });
  };

  const relight = () => {
    setLit(true);
    playSfx("pop");
  };

  return (
    <div className="relative flex flex-col items-center px-2 select-none w-full">
      {/* Warm Ambient Halo behind Cake */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-8 h-[360px] w-[360px] rounded-full blur-[110px]"
        animate={{
          opacity: lit ? [0.4, 0.65, 0.4] : 0.1,
          scale: lit ? [1, 1.06, 1] : 0.94,
        }}
        transition={{ duration: 2.8, repeat: lit ? Infinity : 0, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle, rgba(217, 158, 67, 0.45) 0%, rgba(200, 109, 88, 0.2) 50%, transparent 80%)",
        }}
      />

      {/* Narrative Section Header */}
      <div className="relative mb-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#C86D58] shadow-xs border border-[#E6DCCD]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Birthday Cake</span>
          <Sparkles className="h-3.5 w-3.5 text-[#D99E43]" />
        </motion.div>
        <h2 className="mt-2 font-display text-xl sm:text-3xl font-bold text-[#1E1613] tracking-tight">
          {lit ? "Make a wish & tap the cake to blow out! 🎂" : "Wish granted & sent to the stars! ✨"}
        </h2>
      </div>

      {/* Illustrated 3D Tiered Cake (Directly Clickable) */}
      <div className="relative mt-1 flex flex-col items-center">
        {/* Ground Ambient Shadow under stand */}
        <div className="absolute bottom-2 h-6 w-56 sm:w-64 rounded-full bg-[#1E1613]/10 blur-md pointer-events-none" />

        <motion.div
          className="relative flex flex-col items-center cursor-pointer group"
          onClick={lit ? extinguish : relight}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          title={lit ? "Click to blow candle" : "Click to relight candle"}
        >
          <div className="relative flex flex-col items-center">
            {/* Unified 100% Aligned SVG (Stand, Tiers, Candle, Wick, Flame) */}
            <svg
              width="270"
              height="250"
              viewBox="0 0 280 260"
              className="max-w-[85vw] filter drop-shadow-[0_14px_25px_rgba(40,32,28,0.12)]"
            >
              <defs>
                {/* Tier Gradients */}
                <linearGradient id="tier-top" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FAF5EE" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F4ECE1" />
                </linearGradient>
                <linearGradient id="tier-bottom" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F5ECE0" />
                  <stop offset="50%" stopColor="#FAF7F2" />
                  <stop offset="100%" stopColor="#EFE4D4" />
                </linearGradient>
                <linearGradient id="gold-glaze" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F4D396" />
                  <stop offset="100%" stopColor="#D99E43" />
                </linearGradient>
                <linearGradient id="candle-stick" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="40%" stopColor="#FDE68A" />
                  <stop offset="75%" stopColor="#D99E43" />
                  <stop offset="100%" stopColor="#B57D2C" />
                </linearGradient>
                {/* Single Ceramic Stand Gradient */}
                <linearGradient id="single-stand-plate" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#E4D9CA" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#D8CDBC" />
                </linearGradient>
                <linearGradient id="single-stand-stem" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#CFC2B0" />
                  <stop offset="50%" stopColor="#E8DFD2" />
                  <stop offset="100%" stopColor="#C4B6A3" />
                </linearGradient>
                {/* Flame Gradient */}
                <radialGradient id="flame-outer-glow" cx="50%" cy="60%" r="50%">
                  <stop offset="0%" stopColor="#FDE047" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.4" />
                  <stop offset="80%" stopColor="#C86D58" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#C86D58" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="flame-body-grad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#C86D58" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="75%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>

              {/* 1. SINGLE CLEAN PEDESTAL STAND */}
              <ellipse cx="140" cy="245" rx="50" ry="7" fill="url(#single-stand-stem)" />
              <path d="M 133 234 L 128 245 L 152 245 L 147 234 Z" fill="url(#single-stand-stem)" />
              <ellipse cx="140" cy="234" rx="105" ry="12" fill="url(#single-stand-plate)" stroke="#D8CDBC" strokeWidth="1.2" />

              {/* 2. BOTTOM TIER */}
              <path d="M 55 180 Q 140 200, 225 180 L 225 226 Q 140 246, 55 226 Z" fill="url(#tier-bottom)" />
              <ellipse cx="140" cy="180" rx="85" ry="18" fill="url(#tier-bottom)" stroke="#E6DCCD" strokeWidth="1.2" />

              {/* Bottom Tier Gold Drips */}
              <path
                d="M 55 180 C 75 200, 88 198, 102 188 C 120 204, 135 202, 148 190 C 165 204, 180 202, 195 190 C 210 200, 218 198, 225 180"
                fill="none"
                stroke="url(#gold-glaze)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="85" cy="214" r="3.5" fill="#D99E43" />
              <circle cx="115" cy="220" r="4" fill="#D99E43" />
              <circle cx="140" cy="222" r="4.5" fill="#D99E43" />
              <circle cx="165" cy="220" r="4" fill="#D99E43" />
              <circle cx="195" cy="214" r="3.5" fill="#D99E43" />

              {/* 3. TOP TIER */}
              <path d="M 88 125 Q 140 144, 192 125 L 192 172 Q 140 191, 88 172 Z" fill="url(#tier-top)" />
              <ellipse cx="140" cy="125" rx="52" ry="13" fill="url(#tier-top)" stroke="#E6DCCD" strokeWidth="1.2" />

              {/* Top Tier Gold Drips */}
              <path
                d="M 88 125 C 104 140, 114 138, 124 130 C 138 144, 150 142, 160 132 C 172 142, 182 138, 192 125"
                fill="none"
                stroke="url(#gold-glaze)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="115" cy="156" r="3.5" fill="#C86D58" />
              <circle cx="140" cy="160" r="4" fill="#C86D58" />
              <circle cx="165" cy="156" r="3.5" fill="#C86D58" />

              {/* 4. TOP FROSTING ROSETTES */}
              <circle cx="127" cy="124" r="5" fill="#C86D58" opacity="0.9" />
              <circle cx="134" cy="122" r="5.5" fill="#D99E43" opacity="0.9" />
              <circle cx="146" cy="122" r="5.5" fill="#D99E43" opacity="0.9" />
              <circle cx="153" cy="124" r="5" fill="#C86D58" opacity="0.9" />
              <circle cx="140" cy="128" r="4" fill="#F4D396" />

              {/* 5. CANDLE STICK */}
              <rect x="137" y="82" width="6" height="43" rx="2" fill="url(#candle-stick)" stroke="#B57D2C" strokeWidth="0.8" />
              <line x1="137" y1="94" x2="143" y2="91" stroke="#FFF7ED" strokeWidth="1.2" />
              <line x1="137" y1="106" x2="143" y2="103" stroke="#FFF7ED" strokeWidth="1.2" />
              <line x1="137" y1="118" x2="143" y2="115" stroke="#FFF7ED" strokeWidth="1.2" />

              {/* 6. CANDLE WICK */}
              <line x1="140" y1="82" x2="140" y2="74" stroke="#1E1613" strokeWidth="2" strokeLinecap="round" />

              {/* 7. CONNECTED GLOWING CANDLE FLAME */}
              {lit && (
                <g className="animate-pulse origin-bottom" style={{ animationDuration: "1.2s" }}>
                  <ellipse cx="140" cy="54" rx="30" ry="36" fill="url(#flame-outer-glow)" />
                  <path
                    d="M 140 74 C 132 70, 130 56, 134 46 C 137 36, 140 30, 140 30 C 140 30, 143 36, 146 46 C 150 56, 148 70, 140 74 Z"
                    fill="url(#flame-body-grad)"
                    className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                  />
                  <path
                    d="M 140 72 C 136 69, 135 60, 137 54 C 139 48, 140 44, 140 44 C 140 44, 141 48, 143 54 C 145 60, 144 69, 140 72 Z"
                    fill="#FFFFFF"
                  />
                </g>
              )}

              {/* Extinguished Black Wick Tip */}
              {!lit && (
                <line x1="140" y1="82" x2="140" y2="74" stroke="#28201C" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>

            {/* Rising Smoke Particles */}
            <AnimatePresence>
              {!lit && (
                <motion.div
                  key="smoke"
                  initial={{ opacity: 0.9, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: 0,
                    y: -60,
                    scale: 2.5,
                    x: [-3, 6, -5, 3],
                  }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                  className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-neutral-400/70 blur-md"
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Birthday Blessing Card */}
      <AnimatePresence>
        {!lit && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-md w-full text-center bg-white p-5 sm:p-6 rounded-3xl shadow-paper border border-[#E6DCCD]"
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#D99E43]/15 text-[#D99E43]">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#C86D58]">
              Wish Made, {birthdayConfig.name.split(" ")[0]}! 🎉
            </h3>
            <p className="mt-1.5 text-sm sm:text-base font-serif-luxury text-[#1E1613] font-medium leading-relaxed">
              May every dream you hold close come true this year. You deserve all the happiness, laughter, and incredible adventures in the world!
            </p>
            <button
              type="button"
              onClick={relight}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C86D58] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Relight Candle</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
