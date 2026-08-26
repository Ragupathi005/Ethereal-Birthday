import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Celebration" },
  { id: "wishes", label: "Wishes" },
  { id: "memories", label: "Memories" },
  { id: "video", label: "Film" },
  { id: "message", label: "Message" },
  { id: "surprise", label: "Surprise" },
  { id: "gift-section", label: "Special Gift" },
];

export function ProgressNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActive(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      aria-label="Experience progress navigation"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 md:flex flex-col gap-3.5"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className="group relative flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            aria-label={`Scroll to ${s.label}`}
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-7 bg-gradient-to-r from-[#B85E48] to-[#D99E43] shadow-sm"
                  : "w-2 bg-[#E6DCCD] group-hover:bg-[#706259] group-hover:w-3.5"
              }`}
            />
            <span
              className={`text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
                isActive
                  ? "opacity-100 text-[#C86D58] translate-x-0"
                  : "opacity-0 -translate-x-2 group-hover:opacity-85 group-hover:translate-x-0 text-[#706259]"
              }`}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
