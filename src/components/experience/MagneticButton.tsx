import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { playSfx } from "./MusicController";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  dataCursor?: string;
};

export function MagneticButton({
  children,
  onClick,
  className = "",
  ariaLabel,
  dataCursor = "OPEN",
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 16, stiffness: 220 };
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig);

  const textX = useTransform(dx, (v) => v * 0.45);
  const textY = useTransform(dy, (v) => v * 0.45);

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    playSfx("click");
    onClick?.();
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: dx, y: dy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-9 py-4 font-display text-base font-bold text-white shadow-lift transition-shadow duration-300 hover:shadow-2xl cursor-pointer ${className}`}
    >
      {/* Natural Coral & Terracotta Gradient */}
      <span
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #B85E48 0%, #C86D58 45%, #D99E43 100%)",
        }}
      />

      {/* Subtle Shimmer Sheen */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
      />

      {/* Content */}
      <motion.span style={{ x: textX, y: textY }} className="relative z-10 flex items-center gap-2 tracking-wide">
        {children}
      </motion.span>
    </motion.button>
  );
}
