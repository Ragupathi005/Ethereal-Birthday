import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, BookOpen, RotateCcw, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { comicConfig } from "@/data/comic";
import { useIsTouch } from "./useIsTouch";
import { playSfx } from "./MusicController";

/** A single physical 3D sheet with realistic front and back faces (No click-to-flip) */
function Sheet({
  front,
  back,
  flipped,
  z,
  sheetIndex,
  currentSheet,
}: {
  front?: string;
  back?: string;
  flipped: boolean;
  z: number;
  sheetIndex: number;
  currentSheet: number;
}) {
  const isNear = Math.abs(sheetIndex - currentSheet) <= 2;

  return (
    <div
      className="preserve-3d absolute left-1/2 top-0 h-full w-1/2 select-none pointer-events-none"
      style={{
        transformOrigin: "left center",
        transform: `rotateY(${flipped ? -180 : 0}deg)`,
        transition: "transform 750ms cubic-bezier(.4,.05,.2,1)",
        zIndex: z,
      }}
    >
      {/* Front Face (Right Page before flip) */}
      <div
        className="absolute inset-0 overflow-hidden rounded-r-xl bg-[#FAF7F2] backface-hidden"
        style={{
          backfaceVisibility: "hidden",
          boxShadow: "inset 16px 0 26px -16px rgba(40, 32, 28, 0.4), 3px 0 10px rgba(40, 32, 28, 0.08)",
        }}
      >
        {front ? (
          <img
            src={front}
            alt="Comic page"
            loading={isNear ? "eager" : "lazy"}
            className="h-full w-full object-contain bg-[#FAF7F2]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-[#1E1613]">
            <Sparkles className="h-7 w-7 text-[#D99E43] mb-2" />
            <span className="font-display text-xl font-bold">End of Story</span>
          </div>
        )}
      </div>

      {/* Back Face (Left Page after flip) */}
      <div
        className="absolute inset-0 overflow-hidden rounded-l-xl bg-[#FAF7F2]"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          boxShadow: "inset -16px 0 26px -16px rgba(40, 32, 28, 0.4), -3px 0 10px rgba(40, 32, 28, 0.08)",
        }}
      >
        {back ? (
          <img
            src={back}
            alt="Comic page"
            loading={isNear ? "eager" : "lazy"}
            className="h-full w-full object-contain bg-[#FAF7F2]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-bold text-[#706259]">
            •
          </div>
        )}
      </div>
    </div>
  );
}

export function ComicBook({ onFinish }: { onFinish?: () => void }) {
  const touch = useIsTouch();
  const [sheet, setSheet] = useState(0); // 0 = Front Cover, 1..sheets-1 = Spreads, sheets = End Cover
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pre-rendered HD pages (41 pages)
  const list = comicConfig.pages && comicConfig.pages.length > 0 ? comicConfig.pages : comicConfig.fallbackPages;
  const pageCount = list.length;
  const sheets = Math.max(1, Math.ceil(pageCount / 2));

  const isFrontCover = sheet === 0;
  const isEndCover = sheet === sheets;
  const isInsideSpread = !isFrontCover && !isEndCover;

  // Next page (plays page flip mp3 sound)
  const next = useCallback(() => {
    playSfx("page");
    setSheet((current) => {
      const nextSheet = Math.min(current + 1, sheets);
      if (nextSheet === sheets && current !== sheets) {
        confetti({
          particleCount: 160,
          spread: 110,
          origin: { y: 0.6 },
          colors: ["#D99E43", "#C86D58", "#527A8A", "#7E987F", "#C27E89", "#FFFFFF"],
        });
      }
      return nextSheet;
    });
  }, [sheets]);

  // Prev page (plays page flip mp3 sound)
  const prev = useCallback(() => {
    playSfx("page");
    setSheet((current) => Math.max(0, current - 1));
  }, []);

  const goToCover = useCallback(() => {
    playSfx("page");
    setSheet(0);
  }, []);

  const jumpToSheet = (target: number) => {
    playSfx("page");
    setSheet(target);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Active page description
  const pageLabel = isFrontCover
    ? "Front Cover (Page 1)"
    : isEndCover
    ? `End Cover (Page ${pageCount})`
    : `Pages ${sheet * 2} - ${Math.min(sheet * 2 + 1, pageCount)} of ${pageCount}`;

  return (
    <section id="comic" className="relative overflow-hidden pt-4 pb-12 sm:pb-18 px-3 sm:px-4 select-none" style={{ background: "var(--gradient-comic)" }}>
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#C86D58] shadow-xs border border-[#E6DCCD]"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>The Birthday Comic</span>
          <Sparkles className="h-3.5 w-3.5 text-[#D99E43]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-bold text-[#1E1613] tracking-tight"
        >
          {comicConfig.title}
        </motion.h2>

        <p className="mt-1 font-serif-luxury text-sm sm:text-base uppercase tracking-[0.25em] text-[#D99E43] font-bold">
          {comicConfig.subtitle}
        </p>

        {/* 3D Physical Realistic Comic Book Container */}
        <div
          ref={wrapRef}
          className="relative mx-auto mt-6 sm:mt-8"
          style={{ perspective: 2400 }}
          onPointerMove={(e) => {
            if (touch || !wrapRef.current) return;
            const r = wrapRef.current.getBoundingClientRect();
            setTilt({
              rx: -((e.clientY - r.top) / r.height - 0.5) * 12,
              ry: ((e.clientX - r.left) / r.width - 0.5) * 16,
            });
          }}
          onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
        >
          <motion.div
            className="preserve-3d relative mx-auto"
            animate={{
              rotateX: tilt.rx,
              rotateY: tilt.ry,
              width: isInsideSpread ? "100%" : "55%",
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
            }}
            style={{
              aspectRatio: isInsideSpread ? "16 / 11" : "8 / 11",
              maxWidth: isInsideSpread ? 940 : 440,
            }}
          >
            {/* ============================================================== */}
            {/* 1. FRONT COVER VIEW (Closed 3D Hardcover Book on Page 1)        */}
            {/* ============================================================== */}
            {isFrontCover && (
              <motion.div
                key="front-cover-3d"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="preserve-3d group relative h-full w-full rounded-r-3xl rounded-l-xl overflow-hidden bg-white shadow-2xl border-2 border-white"
                style={{
                  boxShadow: "0 30px 60px -15px rgba(40, 32, 28, 0.45), 14px 0 0 -4px #D99E43, 20px 0 0 -8px #FAF7F2",
                }}
              >
                {/* 3D Embossed Book Spine on Left */}
                <div className="absolute inset-y-0 left-0 w-6 sm:w-8 z-30 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none rounded-l-xl" />

                {/* Real Front Cover Page (list[0]) */}
                <img
                  src={list[0]}
                  alt="Front Cover"
                  loading="eager"
                  className="h-full w-full object-contain bg-[#FAF7F2]"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C86D58] shadow-md border border-[#E6DCCD]">
                    <Star className="h-3 w-3 fill-[#D99E43] text-[#D99E43]" />
                    <span>Front Cover Page</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* 2. INSIDE 3D PHYSICAL SPREAD                                    */}
            {/* ============================================================== */}
            {isInsideSpread && (
              <motion.div
                key="inside-spread-3d"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="preserve-3d relative h-full w-full rounded-2xl bg-white shadow-2xl border border-[#E6DCCD]"
              >
                {/* Static Left Base */}
                <div
                  className="absolute left-0 top-0 h-full w-1/2 overflow-hidden rounded-l-2xl bg-[#FAF7F2]"
                  style={{ boxShadow: "inset -16px 0 24px -16px rgba(40, 32, 28, 0.4)" }}
                >
                  {list[sheet * 2 - 1] ? (
                    <img
                      src={list[sheet * 2 - 1]}
                      alt={`Comic page ${sheet * 2}`}
                      loading="eager"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-[#706259]">
                      •
                    </div>
                  )}
                </div>

                {/* Static Right Base */}
                <div className="absolute left-1/2 top-0 h-full w-1/2 rounded-r-2xl bg-[#FAF7F2]" />

                {/* Central Spine Shadow Gutter */}
                <div
                  className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 z-40 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(40,32,28,0.28), transparent)" }}
                />

                {/* 3D Physical Flipping Sheets Layer (No click-to-flip) */}
                {Array.from({ length: sheets }).map((_, i) => (
                  <Sheet
                    key={i}
                    front={list[i * 2]}
                    back={list[i * 2 + 1]}
                    flipped={i < sheet}
                    z={i < sheet ? i : sheets - i}
                    sheetIndex={i}
                    currentSheet={sheet}
                  />
                ))}
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* 3. END COVER VIEW (Closed 3D Hardcover Book on Final Page)     */}
            {/* ============================================================== */}
            {isEndCover && (
              <motion.div
                key="end-cover-3d"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="preserve-3d group relative h-full w-full rounded-l-3xl rounded-r-xl overflow-hidden bg-white shadow-2xl border-2 border-white"
                style={{
                  boxShadow: "0 30px 60px -15px rgba(40, 32, 28, 0.45), -14px 0 0 -4px #D99E43, -20px 0 0 -8px #FAF7F2",
                }}
              >
                {/* 3D Embossed Book Spine on Right */}
                <div className="absolute inset-y-0 right-0 w-6 sm:w-8 z-30 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none rounded-r-xl" />

                {/* Real End Cover Page (list[pageCount - 1]) */}
                <img
                  src={list[pageCount - 1]}
                  alt="End Cover"
                  loading="eager"
                  className="h-full w-full object-contain bg-[#FAF7F2]"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C86D58] shadow-md border border-[#E6DCCD]">
                    <Star className="h-3 w-3 fill-[#D99E43] text-[#D99E43]" />
                    <span>Back Cover Page</span>
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Reader Navigation Controls (Only way to turn pages) */}
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4 text-[#1E1613]">
          {/* Previous Page Button */}
          <button
            type="button"
            onClick={prev}
            disabled={isFrontCover}
            aria-label="Previous page"
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-paper border border-[#E6DCCD] hover:bg-neutral-50 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Page Status Indicator */}
          <span className="min-w-36 sm:min-w-44 rounded-full bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1E1613] shadow-paper border border-[#E6DCCD]">
            {pageLabel}
          </span>

          {/* Next Page Button */}
          <button
            type="button"
            onClick={next}
            disabled={isEndCover}
            aria-label="Next page"
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-paper border border-[#E6DCCD] hover:bg-neutral-50 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Fullscreen Reading Button */}
          <button
            type="button"
            onClick={() => wrapRef.current?.requestFullscreen?.()}
            aria-label="Fullscreen book reader"
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-[#1E1613] shadow-paper border border-[#E6DCCD] hover:bg-neutral-50 transition-all cursor-pointer"
          >
            <Maximize2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Quick Page Scrub Slider for 41 Pages */}
        <div className="mt-4 mx-auto max-w-sm flex items-center gap-2.5 px-3">
          <button
            type="button"
            onClick={goToCover}
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#706259] hover:text-[#1E1613] cursor-pointer"
          >
            Cover
          </button>
          <input
            type="range"
            min={0}
            max={sheets}
            value={sheet}
            onChange={(e) => jumpToSheet(Number(e.target.value))}
            aria-label="Quick Jump Page Slider"
            className="w-full accent-[#C86D58] cursor-pointer h-1.5 sm:h-2 bg-white rounded-lg shadow-inner border border-[#E6DCCD]"
          />
          <button
            type="button"
            onClick={() => jumpToSheet(sheets)}
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#706259] hover:text-[#1E1613] cursor-pointer"
          >
            End
          </button>
        </div>

        {/* Ending Dedication Card when at End Cover */}
        <AnimatePresence>
          {isEndCover && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8 sm:mt-10 mx-auto max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-lift border-2 border-white text-center"
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#D99E43]/15 text-[#D99E43]">
                <Sparkles className="h-5 w-5 text-[#D99E43]" />
              </div>

              {comicConfig.endingLines.map((l) => (
                <p key={l} className="font-display text-[clamp(1.3rem,3.4vw,2rem)] font-bold text-[#1E1613] leading-snug mt-1.5">
                  {l}
                </p>
              ))}

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goToCover}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1E1613] border border-[#E6DCCD] hover:bg-white transition-all cursor-pointer shadow-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#C86D58]" />
                  <span>Read Again (Front Cover)</span>
                </button>

                {onFinish && (
                  <button
                    type="button"
                    onClick={onFinish}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1E1613] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-black transition-all cursor-pointer"
                  >
                    <Star className="h-3.5 w-3.5 text-[#D99E43] fill-current" />
                    <span>View Grand Finale</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
