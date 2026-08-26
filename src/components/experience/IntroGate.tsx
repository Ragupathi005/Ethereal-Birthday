import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { birthdayConfig } from "@/data/birthday";
import { MagneticButton } from "./MagneticButton";
import { startBackgroundMusic } from "./MusicController";

export function IntroGate({ onOpen }: { onOpen: () => void }) {
  const handleOpen = () => {
    // Start background music automatically on user entry gesture
    startBackgroundMusic();
    onOpen();
  };

  return (
    <motion.section
      suppressHydrationWarning
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 select-none"
      style={{ background: "var(--gradient-open)" }}
      exit={{
        opacity: 0,
        scale: 1.08,
        filter: "blur(14px)",
        transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Soft Ambient Light Ray */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[70vmin] w-[70vmin] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(217, 158, 67, 0.3) 0%, rgba(200, 109, 88, 0.2) 50%, transparent 75%)",
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle Background Storybook Silhouette */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.6, duration: 1.5 }}
        className="pointer-events-none absolute bottom-12 right-12 text-[#1E1613]"
      >
        <BookOpen className="h-32 w-32 -rotate-12" />
      </motion.div>

      {/* Minimalist Atmospheric Scene */}
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center">
        {/* Custom Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full bg-white p-1 shadow-paper border-2 border-white"
        >
          <img
            src="/logo.jpg"
            alt="Birthday Logo"
            className="h-full w-full object-cover rounded-full"
          />
        </motion.div>

        {/* First Line */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl sm:text-3xl text-[#1E1613] font-semibold tracking-tight"
        >
          {birthdayConfig.teaserPre}
        </motion.p>

        {/* Second Line */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-4xl sm:text-6xl font-bold text-[#1E1613] tracking-tight leading-tight"
        >
          {birthdayConfig.teaserPost}
        </motion.h1>

        {/* Interactive Magnetic 3D Button */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9 }}
          className="mt-10"
        >
          <MagneticButton
            onClick={handleOpen}
            ariaLabel="Open your birthday surprise"
          >
            <span>{birthdayConfig.buttonLabel}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Visual Experience Recommendation Note */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-5 sm:bottom-6 px-4 text-center"
      >
        <p className="text-[11px] sm:text-xs tracking-wider text-[#1E1613] font-medium opacity-80">
          💻 For the best visual experience, please open on a laptop or in desktop mode ✨
        </p>
      </motion.div>
    </motion.section>
  );
}
