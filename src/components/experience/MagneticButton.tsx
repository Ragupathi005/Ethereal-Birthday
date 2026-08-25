import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { useIsTouch } from "./useIsTouch";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  strength?: number;
};

/** Button with magnetic pull, 3D depth and glow. */
export function MagneticButton({ children, onClick, className = "", ariaLabel, strength = 0.35 }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const touch = useIsTouch();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={(e) => {
        if (touch || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        });
      }}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={`relative isolate rounded-full px-9 py-4 font-display text-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${className}`}
      style={{
        background: "var(--gradient-gold)",
        boxShadow: "0 18px 40px -18px color-mix(in oklab, var(--ink) 60%, transparent), inset 0 -3px 0 color-mix(in oklab, var(--ink) 18%, transparent), inset 0 2px 0 rgba(255,255,255,.7)",
      }}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-70"
        style={{ background: "var(--gradient-gold)" }}
      />
    </motion.button>
  );
}
