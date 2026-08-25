import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Memory } from "@/data/memories";

type Props = {
  memories: Memory[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

export function PhotoViewer({ memories, index, onClose, onIndex }: Props) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % memories.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + memories.length) % memories.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, memories.length, onClose, onIndex]);

  const memory = index === null ? null : memories[index];

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={memory.title}
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-xl"
            style={{ background: "color-mix(in oklab, var(--ink) 45%, transparent)" }}
            onClick={onClose}
          />
          <motion.figure
            key={memory.id}
            initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="relative z-10 max-h-[86vh] w-full max-w-3xl overflow-hidden rounded-3xl glass-panel"
          >
            <img src={memory.image} alt={memory.title} className="max-h-[64vh] w-full object-cover" />
            <figcaption className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{memory.date}</p>
              <h3 className="mt-1 font-display text-2xl text-ink">{memory.title}</h3>
              <p className="mt-1 text-ink/70">{memory.description}</p>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="absolute right-5 top-5 z-20 rounded-full glass-panel p-3 text-ink"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onIndex((index! - 1 + memories.length) % memories.length)}
            aria-label="Previous photo"
            className="absolute left-4 z-20 rounded-full glass-panel p-3 text-ink"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => onIndex((index! + 1) % memories.length)}
            aria-label="Next photo"
            className="absolute right-4 z-20 rounded-full glass-panel p-3 text-ink"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
