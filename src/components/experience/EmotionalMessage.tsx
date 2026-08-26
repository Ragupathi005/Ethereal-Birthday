import { motion } from "framer-motion";
import { Sparkles, Quote, Star } from "lucide-react";
import { emotionalLines, birthdayConfig } from "@/data/birthday";

export function EmotionalMessage() {
  return (
    <section id="message" className="relative overflow-hidden py-14 sm:py-22 px-4 select-none" style={{ background: "var(--gradient-message)" }}>
      {/* Gentle Warm Halo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-[#D99E43]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 sm:gap-8 text-center">
        {/* Quote Stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white text-[#C86D58] shadow-paper border border-[#E6DCCD]"
        >
          <Quote className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>

        {/* Timed Staged Lines Reveal */}
        {emotionalLines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.4rem,3.6vw,2.4rem)] leading-snug font-bold text-[#1E1613]"
          >
            {line}
          </motion.p>
        ))}

        {/* Final Birthday Dedication */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <span className="font-display text-[clamp(2.2rem,6.5vw,4.2rem)] font-bold text-gradient-coral">
            Happy Birthday, {birthdayConfig.name}!
          </span>
          <div className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#C86D58] font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Thank you for being such a wonderful friend</span>
            <Star className="h-3.5 w-3.5 fill-[#D99E43] text-[#D99E43]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
