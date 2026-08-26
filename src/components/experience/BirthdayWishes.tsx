import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Mail, MailOpen, Sparkles, Star, Check } from "lucide-react";
import { interactiveWishes } from "@/data/birthday";
import { playSfx } from "./MusicController";

export function BirthdayWishes() {
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set(["w1"]));
  const [activeModalWish, setActiveModalWish] = useState<{ id: string; label: string; message: string; tag: string; color: string } | null>(null);

  const toggleWish = (w: typeof interactiveWishes[0]) => {
    playSfx("unwrap");
    setOpenedIds((prev) => new Set(prev).add(w.id));
    setActiveModalWish(w);
  };

  return (
    <section id="wishes" className="relative overflow-hidden py-12 sm:py-20 px-4 select-none" style={{ background: "var(--gradient-open)" }}>
      {/* Decorative Kakashi image in Wishes Section Right Side Top */}
      <motion.img
        src="/Page%20content/kakashi.png"
        alt="Kakashi"
        initial={{ opacity: 0, x: 50, y: -20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute right-0 sm:right-[1%] md:right-[2%] top-[1%] sm:top-[2%] w-32 sm:w-44 md:w-56 lg:w-64 drop-shadow-2xl z-10 select-none"
      />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[460px] rounded-full bg-[#D99E43]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold text-[#1E1613] tracking-tight"
          >
            Wishes for the year ahead.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-base sm:text-lg font-serif-luxury text-[#1E1613] font-medium"
          >
            Tap an envelope to open and reveal each personal birthday blessing.
          </motion.p>
        </div>

        {/* 3D Envelope Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" style={{ perspective: 1400 }}>
          {interactiveWishes.map((w, i) => {
            const isOpened = openedIds.has(w.id);

            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleWish(w)}
                className="group relative flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 shadow-paper hover:shadow-lift transition-all cursor-pointer border border-[#E6DCCD] min-h-[210px] sm:min-h-[230px]"
              >
                {/* Top Label & Tag */}
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: w.color }}
                  >
                    {w.tag}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-[#1E1613] group-hover:bg-[#FAF7F2] transition-colors">
                    {isOpened ? (
                      <MailOpen className="h-4 w-4 text-[#C86D58]" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {/* Envelope Visual & Wish Snippet */}
                <div className="my-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E1613] group-hover:text-[#C86D58] transition-colors">
                    {w.label}
                  </h3>
                  <p className="mt-1.5 font-serif-luxury text-sm text-[#5C4F46] font-medium line-clamp-3 leading-relaxed">
                    {isOpened ? w.message : "Tap to unseal and read this wish..."}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 text-xs font-bold text-[#1E1613]">
                  <span className="flex items-center gap-1">
                    {isOpened ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Opened</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-[#D99E43]" />
                        <span className="text-[#C86D58]">Tap to open</span>
                      </>
                    )}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#C86D58] font-bold">0{i + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expanded Wish Envelope Modal Dialog */}
      <AnimatePresence>
        {activeModalWish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveModalWish(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative max-w-md w-full rounded-3xl bg-[#FAF7F2] p-6 sm:p-9 text-center shadow-2xl border-2 border-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Seal Stamp */}
              <div
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md"
                style={{ backgroundColor: activeModalWish.color }}
              >
                <Star className="h-7 w-7 fill-current" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C86D58]">
                {activeModalWish.label}
              </span>

              <p className="mt-3 font-display text-xl sm:text-2xl font-bold text-[#1E1613] leading-snug">
                &ldquo;{activeModalWish.message}&rdquo;
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModalWish(null)}
                  className="rounded-full bg-[#1E1613] px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-black transition-colors cursor-pointer"
                >
                  Keep in Heart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
