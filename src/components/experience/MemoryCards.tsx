import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { memoryCards } from "@/data/memories";
import { useIsTouch } from "./useIsTouch";

const CARD_STYLES = [
  { bg: "linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)", border: "#D4AF37", badge: "#D4AF37" },
  { bg: "linear-gradient(135deg, #FFFFFF 0%, #F5EFE6 100%)", border: "#C99388", badge: "#C99388" },
  { bg: "linear-gradient(135deg, #FFFFFF 0%, #FAF6EE 100%)", border: "#E5C875", badge: "#E5C875" },
  { bg: "linear-gradient(135deg, #FFFFFF 0%, #F0EBE1 100%)", border: "#A67C1E", badge: "#A67C1E" },
];

function Card({ card, index }: { card: (typeof memoryCards)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [open, setOpen] = useState(false);

  const style = CARD_STYLES[index % CARD_STYLES.length] ?? CARD_STYLES[0]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (touch || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          setTilt({
            rx: -((e.clientY - r.top) / r.height - 0.5) * 10,
            ry: ((e.clientX - r.left) / r.width - 0.5) * 12,
          });
        }}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="glass-panel relative overflow-hidden rounded-2xl p-7 text-left transition-all shadow-md hover:shadow-xl"
        style={{
          background: style.bg,
          border: `1.5px solid ${style.border}40`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-medium text-[#1A161E]">
            {card.title}
          </h3>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
            style={{ background: `${style.badge}20`, color: style.badge }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-4 text-[#5C5465] text-base leading-relaxed font-normal"
            >
              {card.body}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#C59B27] hover:text-[#A67C1E] transition-colors cursor-pointer"
        >
          <span>{open ? "Close passage" : "Read passage"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </motion.div>
    </motion.div>
  );
}

export function MemoryCards() {
  return (
    <section className="relative py-14 px-4">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
        {memoryCards.map((c, i) => (
          <Card key={c.id} card={c} index={i} />
        ))}
      </div>
    </section>
  );
}
