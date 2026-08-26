import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Camera, Sparkles, ChevronLeft, ChevronRight, Heart, LayoutGrid, Layers, Pin } from "lucide-react";
import confetti from "canvas-confetti";
import { memories } from "@/data/memories";
import { PhotoViewer } from "./PhotoViewer";
import { playSfx } from "./MusicController";

export function MemoryGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"flow" | "grid">("flow");
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  const total = memories.length;

  // Auto-scroll every 8 seconds in 3D Carousel mode (resets timer on manual user interaction)
  useEffect(() => {
    if (viewMode !== "flow" || openIndex !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, 8000);
    return () => clearInterval(interval);
  }, [viewMode, openIndex, total, activeIndex]);

  const nextSlide = () => {
    playSfx("click");
    setActiveIndex((i) => (i + 1) % total);
  };

  const prevSlide = () => {
    playSfx("click");
    setActiveIndex((i) => (i - 1 + total) % total);
  };

  const toggleHeart = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [i]: !prev[i] }));
    playSfx("pop");

    confetti({
      particleCount: 30,
      spread: 55,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ["#C86D58", "#D99E43", "#C27E89"],
    });
  };

  return (
    <section id="memories" className="relative overflow-hidden py-12 sm:py-20 px-3 sm:px-4 select-none" style={{ background: "var(--gradient-memories)" }}>
      {/* Radiant Bokeh Lights */}
      <div className="pointer-events-none absolute -left-20 top-20 h-[380px] w-[380px] rounded-full bg-[#527A8A]/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-[380px] w-[380px] rounded-full bg-[#C86D58]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#527A8A] shadow-xs border border-[#E6DCCD]"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Portraits & Gallery</span>
              <Sparkles className="h-3.5 w-3.5 text-[#D99E43]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 font-display text-[clamp(2.2rem,5.5vw,3.6rem)] font-bold text-[#1E1613] tracking-tight"
            >
              Frames of <span className="text-gradient-coral">Ethereal</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-1.5 font-serif-luxury text-base sm:text-lg text-[#1E1613] font-medium"
            >
              A celebration of your wonderful smiles and favorite pictures.
            </motion.p>
          </div>

          {/* Toggle View Mode Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 rounded-full bg-white p-1 shadow-paper border border-[#E6DCCD] self-start sm:self-auto"
          >
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setViewMode("flow");
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "flow"
                  ? "bg-[#C86D58] text-white shadow-xs"
                  : "text-[#706259] hover:text-[#1E1613]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>3D Carousel</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setViewMode("grid");
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#C86D58] text-white shadow-xs"
                  : "text-[#706259] hover:text-[#1E1613]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Photo Wall</span>
            </button>
          </motion.div>
        </div>

        {/* ----------------- 1. 3D COVERFLOW MODE (Responsive on Mobile & Desktop) ----------------- */}
        {viewMode === "flow" && (
          <div className="relative select-none">
            {/* 3D Flow Carousel Container — Much larger viewport */}
            <div
              className="relative mx-auto flex h-[440px] sm:h-[560px] md:h-[620px] w-full max-w-6xl items-center justify-center overflow-hidden"
              style={{ perspective: 1800 }}
            >
              {memories.map((m, i) => {
                let diff = i - activeIndex;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                // Show 5 items: -2, -1, 0, 1, 2
                const isVisible = Math.abs(diff) <= 2;
                if (!isVisible) return null;

                let translateX = 0;
                let rotateY = 0;
                let scale = 1;
                let zIndex = 10;
                let opacity = 1;

                if (diff === 0) {
                  translateX = 0;
                  rotateY = 0;
                  scale = 1.02;
                  zIndex = 40;
                  opacity = 1;
                } else if (diff === -1) {
                  translateX = -180;
                  rotateY = 22;
                  scale = 0.88;
                  zIndex = 30;
                  opacity = 0.88;
                } else if (diff === 1) {
                  translateX = 180;
                  rotateY = -22;
                  scale = 0.88;
                  zIndex = 30;
                  opacity = 0.88;
                } else if (diff === -2) {
                  translateX = -320;
                  rotateY = 36;
                  scale = 0.74;
                  zIndex = 20;
                  opacity = 0.55;
                } else if (diff === 2) {
                  translateX = 320;
                  rotateY = -36;
                  scale = 0.74;
                  zIndex = 20;
                  opacity = 0.55;
                }

                return (
                  <motion.div
                    key={m.id}
                    className="absolute cursor-pointer"
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex,
                    }}
                    animate={{
                      x: translateX,
                      rotateY,
                      scale,
                      opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                    onClick={() => {
                      if (diff === 0) setOpenIndex(i);
                      else {
                        playSfx("click");
                        setActiveIndex(i);
                      }
                    }}
                  >
                    {/* Slim border card, large dimensions */}
                    <div
                      className="relative h-[360px] sm:h-[480px] md:h-[540px] w-[260px] sm:w-[360px] md:w-[420px] overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-1 sm:p-1.5 shadow-2xl transition-all hover:shadow-lift"
                      style={{
                        boxShadow: diff === 0
                          ? "0 28px 60px -12px rgba(40, 32, 28, 0.32), 0 0 30px rgba(217, 158, 67, 0.12)"
                          : "0 12px 28px -6px rgba(40, 32, 28, 0.14)",
                      }}
                    >
                      {/* Photo Image Frame: Displays complete photo (portrait & landscape) with elegant subtle backdrop */}
                      <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#1E1613] flex items-center justify-center">
                        {/* Ambient Blurred Background of the same photo */}
                        <img
                          src={m.image}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover blur-lg opacity-40 scale-110"
                        />

                        {/* Complete Crisp Photo — 100% visible, no cropped edges */}
                        <img
                          src={m.image}
                          alt="Photo"
                          loading="lazy"
                          className="relative z-10 h-full w-full object-contain"
                        />

                        {/* Top Heart Button */}
                        <div className="absolute top-2.5 right-2.5 z-20">
                          <button
                            type="button"
                            onClick={(e) => toggleHeart(i, e)}
                            aria-label="Like photo"
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#C86D58] shadow-md hover:scale-110 transition-transform cursor-pointer backdrop-blur-xs"
                          >
                            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${likedMap[i] ? "fill-[#C86D58]" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Nav Arrows */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-paper border border-[#E6DCCD] hover:bg-neutral-50 hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-xs font-bold tracking-widest uppercase text-[#706259]">
                {activeIndex + 1} / {total}
              </span>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-paper border border-[#E6DCCD] hover:bg-neutral-50 hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------- 2. REAL PHOTO WALL (Pure Photos with Tapes & Pins) ----------------- */}
        {viewMode === "grid" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-4 p-3 sm:p-6 bg-white/60 rounded-3xl border border-[#E6DCCD] shadow-inner"
          >
            {memories.map((m, i) => {
              const isEven = i % 2 === 0;
              const hasTopPin = i % 3 === 0;
              const tapeRotation = isEven ? -5 : 5;

              return (
                <motion.div
                  key={m.id}
                  style={{
                    rotate: m.rotation,
                    translateY: isEven ? -4 : 6,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    zIndex: 20,
                    y: -6,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  onClick={() => setOpenIndex(i)}
                  className="group relative flex flex-col rounded-xl bg-[#FFFDF9] p-1 sm:p-1.5 shadow-paper hover:shadow-2xl transition-shadow cursor-pointer border border-[#E6DCCD]"
                >
                  {/* Washi Tape Strip on Top */}
                  <div
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-4 opacity-85 z-10 shadow-xs pointer-events-none rounded-xs"
                    style={{
                      backgroundColor: m.tapeColor || "#D99E43",
                      transform: `translateX(-50%) rotate(${tapeRotation}deg)`,
                    }}
                  />

                  {/* Decorative Pushpin for select photos */}
                  {hasTopPin && (
                    <div className="absolute -top-2 right-2 text-[#C86D58] drop-shadow-sm pointer-events-none">
                      <Pin className="h-3.5 w-3.5 fill-current rotate-45" />
                    </div>
                  )}

                  {/* Slim Photo Frame (Complete Photo Display) */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-[#1E1613] shadow-inner flex items-center justify-center">
                    <img
                      src={m.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover blur-sm opacity-35 scale-110"
                    />
                    <img
                      src={m.image}
                      alt="Memory photo"
                      loading="lazy"
                      className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleHeart(i, e)}
                      aria-label="Like photo"
                      className="absolute top-1.5 right-1.5 z-20 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 text-[#C86D58] shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Heart className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${likedMap[i] ? "fill-[#C86D58]" : ""}`} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Lightbox Photo Viewer */}
      <PhotoViewer
        memories={memories}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndex={setOpenIndex}
      />
    </section>
  );
}
