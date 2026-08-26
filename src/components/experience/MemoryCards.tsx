import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { memoryCards } from "@/data/memories";
import { useIsTouch } from "./useIsTouch";

function Card({ card, index }: { card: (typeof memoryCards)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (touch || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          setTilt({ rx: -((e.clientY - r.top) / r.height - 0.5) * 14, ry: ((e.clientX - r.left) / r.width - 0.5) * 16 });
        }}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 160, damping: 15 }}
        className="preserve-3d glass-panel relative overflow-hidden rounded-3xl p-7"
        style={{ background: `linear-gradient(150deg, color-mix(in oklab, ${card.tint} 55%, white), color-mix(in oklab, white 80%, transparent))` }}
      >
        <h3 className="font-display text-2xl text-ink">{card.title}</h3>
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-3 text-ink/75"
            >
              {card.body}
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-5 text-xs uppercase tracking-[0.3em] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
        >
          {open ? "close" : "open"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export function MemoryCards() {
  return (
    <section className="relative py-24">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2">
        {memoryCards.map((c, i) => (
          <Card key={c.id} card={c} index={i} />
        ))}
      </div>
    </section>
  );
}
