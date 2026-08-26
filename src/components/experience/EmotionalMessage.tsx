import { motion } from "framer-motion";
import { emotionalLines } from "@/data/birthday";
import { ParticleField } from "./ParticleField";

export function EmotionalMessage() {
  return (
    <section className="grain relative overflow-hidden py-40" style={{ background: "var(--gradient-sky)" }}>
      <ParticleField count={45} variant="sparkle" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-10 px-6 text-center">
        {emotionalLines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.4rem,3.4vw,2.4rem)] leading-snug text-ink/85"
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.3 }}
          className="mt-6 font-display text-[clamp(2rem,6vw,4rem)] text-gradient-gold"
        >
          Happy Birthday ❤️
        </motion.p>
      </div>
    </section>
  );
}
