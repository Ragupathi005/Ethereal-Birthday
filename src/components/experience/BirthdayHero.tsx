import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/data/birthday";
import { ParticleField } from "./ParticleField";
import { Balloons } from "./Balloons";
import { Cake } from "./Cake";

export function BirthdayHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      confetti({ particleCount: 180, spread: 120, startVelocity: 45, origin: { y: 0.35 }, colors: ["#f7b9c8", "#f8d8a8", "#d9c4f5", "#bcd9f5", "#ffffff"] });
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  const title = birthdayConfig.greeting.split("");

  return (
    <section ref={ref} className="grain relative flex min-h-[190vh] flex-col items-center overflow-hidden pt-[18vh]">
      <ParticleField count={80} variant="sparkle" />
      <Balloons />

      <motion.div style={{ y, scale, opacity: fade }} className="relative z-10 px-6 text-center">
        <h1 className="font-display text-[clamp(2.8rem,10vw,8rem)] leading-[0.95] text-ink">
          {title.map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 70, rotateX: -80 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.25 + i * 0.045, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 1.2 }}
          className="mt-2 font-display text-[clamp(2rem,7vw,5rem)] text-gradient-gold"
        >
          {birthdayConfig.name}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mx-auto mt-6 max-w-md text-balance text-ink/70"
        >
          {birthdayConfig.subline}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="relative z-10 mt-[26vh] mb-32"
      >
        <Cake />
      </motion.div>

      <motion.span
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-ink/50"
      >
        scroll
      </motion.span>
    </section>
  );
}
