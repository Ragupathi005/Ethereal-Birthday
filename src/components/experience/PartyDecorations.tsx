import { motion } from "framer-motion";

/**
 * Background party decorations: mild pastel balloon bouquets and gentle streamers
 * perfectly bounded so they never clip.
 */
export function PartyDecorations({ position = "left" }: { position?: "left" | "right" | "both" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* Top Left Pinned Balloon Bouquet */}
      {(position === "left" || position === "both") && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-3 left-3 sm:left-6 pointer-events-none"
        >
          <svg width="170" height="200" viewBox="0 0 170 200" className="filter drop-shadow-[0_8px_16px_rgba(70,55,40,0.08)]">
            <defs>
              <radialGradient id="dec-honey" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#FAF2E4" />
                <stop offset="70%" stopColor="#D6A962" />
                <stop offset="100%" stopColor="#9E7538" />
              </radialGradient>
              <radialGradient id="dec-peach" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#F8ECE8" />
                <stop offset="70%" stopColor="#D48B77" />
                <stop offset="100%" stopColor="#9E5E4E" />
              </radialGradient>
              <radialGradient id="dec-mauve" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#F4ECF2" />
                <stop offset="70%" stopColor="#B58CA8" />
                <stop offset="100%" stopColor="#78566D" />
              </radialGradient>
            </defs>

            {/* Soft Ribbons */}
            <path d="M 40 95 Q 65 140, 45 185" fill="none" stroke="#D6A962" strokeWidth="1.5" opacity="0.45" />
            <path d="M 75 105 Q 100 150, 80 190" fill="none" stroke="#D48B77" strokeWidth="1.5" opacity="0.45" />
            <path d="M 115 95 Q 90 140, 118 180" fill="none" stroke="#B58CA8" strokeWidth="1.5" opacity="0.45" />

            {/* Pinned Balloons */}
            <ellipse cx="48" cy="55" rx="27" ry="34" fill="url(#dec-peach)" transform="rotate(-12 48 55)" />
            <ellipse cx="110" cy="62" rx="28" ry="36" fill="url(#dec-mauve)" transform="rotate(15 110 62)" />
            <ellipse cx="76" cy="44" rx="29" ry="38" fill="url(#dec-honey)" />

            {/* Subtle Glints */}
            <ellipse cx="66" cy="28" rx="5" ry="10" fill="#FFFFFF" opacity="0.7" transform="rotate(-20 66 28)" />
            <ellipse cx="40" cy="42" rx="4" ry="8" fill="#FFFFFF" opacity="0.65" transform="rotate(-30 40 42)" />
          </svg>
        </motion.div>
      )}

      {/* Top Right Pinned Balloon Bouquet */}
      {(position === "right" || position === "both") && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-3 right-3 sm:right-6 pointer-events-none"
        >
          <svg width="170" height="200" viewBox="0 0 170 200" className="filter drop-shadow-[0_8px_16px_rgba(70,55,40,0.08)]">
            <path d="M 130 95 Q 105 140, 125 185" fill="none" stroke="#D6A962" strokeWidth="1.5" opacity="0.45" />
            <path d="M 95 105 Q 70 150, 90 190" fill="none" stroke="#D48B77" strokeWidth="1.5" opacity="0.45" />

            <ellipse cx="122" cy="55" rx="27" ry="34" fill="url(#dec-honey)" transform="rotate(12 122 55)" />
            <ellipse cx="60" cy="62" rx="28" ry="36" fill="url(#dec-peach)" transform="rotate(-15 60 62)" />
            <ellipse cx="94" cy="44" rx="29" ry="38" fill="url(#dec-mauve)" />

            <ellipse cx="84" cy="28" rx="5" ry="10" fill="#FFFFFF" opacity="0.7" transform="rotate(-20 84 28)" />
          </svg>
        </motion.div>
      )}

      {/* Mild Confetti Shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-35">
        <div className="absolute top-12 left-1/4 h-2 w-3.5 rotate-12 rounded-xs bg-[#D6A962]" />
        <div className="absolute top-28 right-1/4 h-2.5 w-2.5 -rotate-45 rounded-full bg-[#D48B77]" />
        <div className="absolute top-44 left-1/12 h-2 w-4 rotate-45 rounded-xs bg-[#B58CA8]" />
        <div className="absolute bottom-20 right-1/12 h-2.5 w-2 rotate-24 rounded-xs bg-[#D6A962]" />
        <div className="absolute bottom-32 left-1/5 h-2 w-2 -rotate-12 rounded-full bg-[#8FA994]" />
      </div>
    </div>
  );
}
