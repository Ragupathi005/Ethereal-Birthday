import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import confetti from "canvas-confetti";
import type { Memory } from "@/data/memories";
import { playSfx } from "./MusicController";

type Props = {
  memories: Memory[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

export function PhotoViewer({ memories, index, onClose, onIndex }: Props) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    if (index === null) return;
    setStarred(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        playSfx("page");
        onIndex((index + 1) % memories.length);
      }
      if (e.key === "ArrowLeft") {
        playSfx("page");
        onIndex((index - 1 + memories.length) % memories.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, memories.length, onClose, onIndex]);

  const memory = index === null ? null : memories[index];

  const handleStar = () => {
    setStarred(true);
    playSfx("pop");
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#C86D58", "#D99E43", "#527A8A", "#7E987F"],
    });
  };

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
        >
          {/* Soft Blur Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#1E1613]/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Pure High-Res Photo Card (Zero Text) */}
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.88, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative z-10 max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-3xl bg-white shadow-2xl p-3 sm:p-5 border-2 border-white flex flex-col items-center select-none"
          >
            {/* Photo Container */}
            <div className="relative max-h-[78vh] w-full overflow-hidden rounded-2xl bg-neutral-100 flex items-center justify-center">
              <img
                src={memory.image}
                alt="Photo"
                className="max-h-[78vh] w-full object-contain rounded-xl"
              />

              {/* Minimal Star Favorite Button */}
              <button
                type="button"
                onClick={handleStar}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-[#D99E43] shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <Star className={`h-4 w-4 ${starred ? "fill-[#D99E43]" : ""}`} />
                <span>{starred ? "Favorited ✨" : "Favorite"}</span>
              </button>
            </div>
          </motion.div>

          {/* Nav & Close Controls */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="absolute right-6 top-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-lg hover:scale-110 transition-transform cursor-pointer border border-[#E6DCCD]"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => {
              playSfx("page");
              onIndex((index! - 1 + memories.length) % memories.length);
            }}
            aria-label="Previous photo"
            className="absolute left-4 sm:left-8 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-lg hover:scale-110 transition-transform cursor-pointer border border-[#E6DCCD]"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() => {
              playSfx("page");
              onIndex((index! + 1) % memories.length);
            }}
            aria-label="Next photo"
            className="absolute right-4 sm:right-8 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-lg hover:scale-110 transition-transform cursor-pointer border border-[#E6DCCD]"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
