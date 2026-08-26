import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { memories } from "@/data/memories";
import { PhotoViewer } from "./PhotoViewer";
import { useIsTouch } from "./useIsTouch";

/** Floating photo card that reacts to the cursor in 3D. */
function PhotoCard({
  index,
  onOpen,
  depth,
}: {
  index: number;
  onOpen: () => void;
  depth: number;
}) {
  const memory = memories[index];
  const ref = useRef<HTMLButtonElement>(null);
  const touch = useIsTouch();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hover: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1100 }}
      className={depth === 1 ? "sm:translate-y-10" : depth === 2 ? "sm:-translate-y-8" : ""}
    >
      <motion.button
        ref={ref}
        type="button"
        onClick={onOpen}
        aria-label={`Open memory: ${memory.title}`}
        onPointerMove={(e) => {
          if (touch || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          setTilt({ rx: -py * 16, ry: px * 18, hover: true });
        }}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0, hover: false })}
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
          scale: tilt.hover ? 1.06 : 1,
          z: tilt.hover ? 60 : 0,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="preserve-3d group relative block w-full overflow-hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        style={{ boxShadow: tilt.hover ? "var(--shadow-lift)" : "var(--shadow-soft)" }}
      >
        <img
          src={memory.image}
          alt={memory.title}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--ink) 70%, transparent))" }}
        />
        <span className="absolute inset-x-0 bottom-0 translate-y-4 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block font-display text-lg text-cream">{memory.title}</span>
          <span className="block text-xs uppercase tracking-[0.25em] text-cream/70">{memory.date}</span>
        </span>
      </motion.button>
    </motion.div>
  );
}

export function MemoryGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const driftB = useTransform(scrollYProgress, [0, 1], [-40, 50]);

  return (
    <section ref={ref} id="memories" className="grain relative overflow-hidden py-32">
      <motion.div
        aria-hidden
        style={{ y: driftA, background: "var(--lavender)" }}
        className="absolute -left-32 top-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: driftB, background: "var(--peach)" }}
        className="absolute -right-24 bottom-10 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl text-balance font-display text-[clamp(2rem,5vw,3.6rem)] leading-tight text-ink"
        >
          Some moments become memories<span className="text-gradient-gold">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 max-w-md text-ink/60"
        >
          Move your cursor around. Tap one to look closer.
        </motion.p>

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {memories.map((m, i) => (
            <PhotoCard key={m.id} index={i} depth={i % 3} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      <PhotoViewer memories={memories} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
