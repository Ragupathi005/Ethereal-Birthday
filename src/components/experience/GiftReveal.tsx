import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { MagneticButton } from "./MagneticButton";

const LINES = ["There's one more thing...", "I made something for you.", "A story."];

export function GiftReveal({ onOpen, opened }: { onOpen: () => void; opened: boolean }) {
  return (
    <section className="grain relative overflow-hidden py-36" style={{ background: "var(--gradient-dusk)" }}>
      <ParticleField count={55} variant="sparkle" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        {LINES.map((l, i) => (
          <motion.p
            key={l}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 1, delay: i * 0.15 }}
            className="font-display text-[clamp(1.4rem,3.2vw,2.2rem)] text-ink/85"
          >
            {l}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 30 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 900 }}
          className="mt-10"
        >
          <motion.div
            animate={{ y: [0, -14, 0], rotateZ: [-2, 2, -2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="preserve-3d relative mx-auto h-44 w-44"
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-lift), 0 0 80px -10px var(--gold)" }}
            />
            <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-[color-mix(in_oklab,var(--pink)_75%,white)]" />
            <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-[color-mix(in_oklab,var(--pink)_75%,white)]" />
            <div className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 rotate-45 rounded-full border-[6px] border-[color-mix(in_oklab,var(--pink)_75%,white)]" />
          </motion.div>

          {!opened && (
            <div className="mt-12">
              <MagneticButton onClick={onOpen} ariaLabel="Open the gift">
                Unwrap it
              </MagneticButton>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
