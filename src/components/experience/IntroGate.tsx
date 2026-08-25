import { motion } from "framer-motion";
import { birthdayConfig } from "@/data/birthday";
import { ParticleField } from "./ParticleField";
import { MagneticButton } from "./MagneticButton";

export function IntroGate({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      className="grain fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-dawn)" }}
      exit={{ opacity: 0, scale: 1.15, filter: "blur(14px)" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <ParticleField count={70} variant="dust" />
      <motion.div
        aria-hidden
        className="absolute h-[70vmin] w-[70vmin] rounded-full blur-3xl"
        style={{ background: "var(--gradient-gold)", opacity: 0.35 }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="relative z-10 px-6 text-center font-display text-2xl text-ink/80 sm:text-3xl"
      >
        {birthdayConfig.teaser}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="relative z-10 mt-10"
      >
        <MagneticButton onClick={onOpen} ariaLabel="Open the birthday experience">
          {birthdayConfig.openLabel}
        </MagneticButton>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 text-xs uppercase tracking-[0.4em] text-ink/60"
      >
        made by hand
      </motion.span>
    </motion.section>
  );
}
