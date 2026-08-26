import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Gift, ArrowDown, Star } from "lucide-react";
import { birthdayConfig } from "@/data/birthday";
import { playSfx } from "./MusicController";

type Props = {
  opened: boolean;
  onOpen: () => void;
};

export function GiftReveal({ opened, onOpen }: Props) {
  const [unwrapping, setUnwrapping] = useState(false);

  const handleUnwrap = () => {
    if (unwrapping || opened) return;
    setUnwrapping(true);
    playSfx("unwrap");

    confetti({
      particleCount: 150,
      spread: 90,
      startVelocity: 46,
      origin: { y: 0.6 },
      colors: ["#C86D58", "#D99E43", "#527A8A", "#7E987F", "#C27E89", "#FFFFFF"],
    });

    window.setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <section id="gift-reveal" className="relative overflow-hidden pt-12 sm:pt-16 pb-6 sm:pb-10 px-4 select-none" style={{ background: "var(--gradient-gift)" }}>
      {/* Radiant Warm Backlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-[#D99E43]/20 via-[#C86D58]/15 to-transparent blur-[120px]" />

      {/* Prabhas — Lower Down in Right Corner */}
      <motion.img
        src="/Page%20content/Prabhas.png"
        alt="Prabhas"
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute right-2 sm:right-6 md:right-8 lg:right-12 bottom-0 sm:bottom-2 md:bottom-4 w-44 sm:w-68 md:w-84 lg:w-[420px] xl:w-[480px] max-h-[580px] object-contain drop-shadow-2xl z-10 select-none"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 sm:gap-5 text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#C86D58] shadow-xs border border-[#E6DCCD]"
        >
          <Gift className="h-3.5 w-3.5" />
          <span>The Special Surprise</span>
          <Sparkles className="h-3.5 w-3.5 text-[#D99E43]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-bold text-[#1E1613] tracking-tight"
        >
          I made something <span className="text-gradient-coral">extra special</span> for you.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-lg font-serif-luxury text-base sm:text-lg text-[#1E1613] font-medium leading-relaxed"
        >
          {!opened
            ? "Tap directly on the gift box to unwrap your custom storybook!"
            : "Your gift is unlocked! Flip through the pages of your custom comic book below."}
        </motion.p>

        {/* Real Luxury Gift Box Showcase */}
        <div className="relative mt-2 w-full flex items-center justify-center" style={{ perspective: 1400 }}>
          {/* Center Gift Box Container */}
          <div className="relative flex flex-col items-center z-20">
            {/* Shadow */}
            <div className="absolute -bottom-4 h-8 w-72 rounded-full bg-[#1E1613]/10 blur-lg" />

            <motion.div
              className="preserve-3d relative cursor-pointer"
              onClick={handleUnwrap}
              whileHover={!opened ? { scale: 1.04, rotateY: 5, y: -4 } : { scale: 1.01 }}
              whileTap={!opened ? { scale: 0.96 } : {}}
              animate={
                !opened && !unwrapping
                  ? { y: [0, -8, 0], rotateY: [-2, 2, -2] }
                  : unwrapping
                  ? { scale: [1, 1.1, 1.02], y: [0, -14, -6] }
                  : { y: 0 }
              }
              transition={{
                y: { duration: 4.5, repeat: opened ? 0 : Infinity, ease: "easeInOut" },
                rotateY: { duration: 6, repeat: opened ? 0 : Infinity, ease: "easeInOut" },
                scale: { duration: 0.4 },
              }}
              style={{ width: 330, maxWidth: "88vw" }}
              title={!opened ? "Click to unwrap gift box" : "Unwrapped"}
            >
              {/* Real Gift Box Image Container */}
              <div
                className="relative overflow-hidden rounded-3xl bg-white p-3 sm:p-4 shadow-2xl border-2 border-white"
                style={{
                  boxShadow: "0 25px 60px -12px rgba(200, 109, 88, 0.22), 0 8px 24px rgba(217, 158, 67, 0.12)",
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={birthdayConfig.giftImage}
                    alt="Birthday Gift Box"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Ribbon Badge Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#C86D58] shadow-sm">
                      <Gift className="h-3 w-3" />
                      <span>Special Gift</span>
                    </span>
                    <span className="text-[11px] font-bold text-white drop-shadow-md">
                      {!opened ? "✨ Tap box to open" : "Unlocked ✨"}
                    </span>
                  </div>
                </div>

                {/* Tag Label */}
                <div className="pt-2.5 pb-0.5 text-center">
                  <span className="font-display text-base sm:text-lg font-bold text-[#1E1613]">
                    A Custom Story For {birthdayConfig.name.split(" ")[0]} 🎁
                  </span>
                </div>
              </div>

              {/* Glowing Eruption Rays when Unwrapped */}
              <AnimatePresence>
                {(opened || unwrapping) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
                  >
                    <div className="h-56 w-56 rounded-full bg-gradient-to-r from-[#D99E43] to-[#C86D58] opacity-60 blur-3xl animate-pulse" />
                    <Sparkles className="h-14 w-14 text-[#D99E43]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Hint / Scroll Indicator when opened */}
            {opened && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex flex-col items-center gap-1.5 text-[#C86D58]"
              >
                <div className="flex items-center gap-1.5 font-display text-base sm:text-lg font-bold text-[#1E1613]">
                  <Star className="h-4 w-4 fill-[#D99E43] text-[#D99E43]" />
                  <span>Storybook Unlocked! Read Your Custom Comic Below</span>
                </div>
                <ArrowDown className="h-5 w-5 animate-bounce text-[#C86D58]" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
