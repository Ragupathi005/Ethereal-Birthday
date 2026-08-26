import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Star } from "lucide-react";
import { birthdayConfig } from "@/data/birthday";
import { Balloons } from "./Balloons";
import { Cake } from "./Cake";

export function BirthdayHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const rcbY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        startVelocity: 36,
        origin: { y: 0.35 },
        colors: ["#C86D58", "#527A8A", "#D99E43", "#7E987F", "#C27E89", "#FFFFFF"],
      });
    }, 600);
    return () => window.clearTimeout(t);
  }, []);

  const titleChars = birthdayConfig.greeting.split("");

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center overflow-hidden pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 select-none"
      style={{ background: "var(--gradient-reveal)" }}
    >
      {/* Floating Helium Balloons */}
      <Balloons />

      {/* Gentle Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-[#D99E43]/15 blur-[130px]" />

      {/* ── Decorative Character Images ── */}

      {/* RCB Logo — EXACT CENTER behind "Happy Birthday" title, large watermark */}
      <motion.img
        src="/Page%20content/RCB.png"
        alt="RCB"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.40, scale: 1 }}
        transition={{ delay: 1.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: rcbY }}
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 w-56 sm:w-80 md:w-[440px] lg:w-[520px] z-0 select-none"
      />

      {/* Shin-chan — LEFT SIDE, slightly smaller than Sasuke on right */}
      <motion.img
        src="/Page%20content/sinchan.png"
        alt="Shin-chan"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-0 top-0 h-full w-auto max-w-[160px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] object-contain object-top drop-shadow-xl z-0 select-none"
      />

      {/* Sasuke — Upper Right Side */}
      <motion.img
        src="/Page%20content/Sasuke.png"
        alt="Sasuke"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -right-2 sm:-right-4 md:-right-6 top-0 h-[72%] sm:h-[78%] w-auto max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[380px] object-contain object-top drop-shadow-xl z-0 select-none"
      />

      {/* Virat Kohli — bottom-left, larger, below Shin-chan */}
      <motion.img
        src="/Page%20content/virat%20kohli.png"
        alt="Virat Kohli"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-[1%] bottom-[1%] w-44 sm:w-60 md:w-72 lg:w-84 xl:w-96 drop-shadow-2xl z-0 select-none"
      />

      {/* Heidi — bottom-right corner, completely clear of cake blowout card */}
      <motion.img
        src="/Page%20content/heidi.png"
        alt="Heidi"
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute right-[2%] sm:right-[4%] md:right-[6%] lg:right-[8%] bottom-[1%] w-28 sm:w-36 md:w-48 lg:w-56 drop-shadow-xl z-10 select-none"
      />

      <motion.div style={{ y, scale, opacity: fade }} className="relative z-10 w-full max-w-4xl px-2 sm:px-6 text-center">
        {/* Top Celebration Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 sm:px-5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C86D58] shadow-paper border border-[#E6DCCD]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>A Special Birthday Celebration</span>
          <Star className="h-3.5 w-3.5 fill-[#D99E43] text-[#D99E43]" />
        </motion.div>

        {/* Dynamic 3D Greeting Typography */}
        <h1 className="font-display text-[clamp(2.6rem,8.5vw,6.5rem)] leading-[0.95] text-[#1E1613] font-bold tracking-tight">
          {titleChars.map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 50, rotateX: -50 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.15 + i * 0.03, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </h1>

        {/* Friend's Name */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.9, duration: 1.0 }}
          className="mt-2 font-display text-[clamp(2.2rem,7.5vw,5.2rem)] font-bold text-gradient-coral drop-shadow-xs"
        >
          {birthdayConfig.name}
        </motion.p>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="mx-auto mt-3 max-w-lg font-serif-luxury text-base sm:text-xl font-medium text-[#1E1613] leading-relaxed"
        >
          {birthdayConfig.subline}
        </motion.p>

        {/* Interactive Balloon Hint Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E1613] border border-[#E6DCCD] shadow-xs"
        >
          <span>🎈 Pop balloons for secret wishes • Tap cake to blow candle</span>
        </motion.div>
      </motion.div>

      {/* Stylized Birthday Cake Centerpiece (Clean, tight vertical spacing) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mt-8 mb-2 w-full max-w-lg"
      >
        <Cake />
      </motion.div>
    </section>
  );
}
