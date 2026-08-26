import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { comicConfig } from "@/data/comic";
import { endingLines } from "@/data/birthday";
import { usePdfPages } from "./usePdfPages";
import { useIsTouch } from "./useIsTouch";

/** A single physical sheet: front page on one face, next page on the back. */
function Sheet({
  front,
  back,
  flipped,
  z,
  onNext,
  onPrev,
}: {
  front?: string;
  back?: string;
  flipped: boolean;
  z: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      className="preserve-3d absolute left-1/2 top-0 h-full w-1/2"
      style={{
        transformOrigin: "left center",
        transform: `rotateY(${flipped ? -180 : 0}deg)`,
        transition: "transform 900ms cubic-bezier(.4,.05,.2,1)",
        zIndex: z,
      }}
    >
      {/* front face (right page) */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next page"
        className="absolute inset-0 overflow-hidden rounded-r-md bg-[color-mix(in_oklab,var(--cream)_92%,white)] backface-hidden"
        style={{ backfaceVisibility: "hidden", boxShadow: "inset 14px 0 24px -18px rgba(0,0,0,.55)" }}
      >
        {front ? (
          <img src={front} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-ink/40">the end</span>
        )}
      </button>
      {/* back face (becomes the left page after flipping) */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous page"
        className="absolute inset-0 overflow-hidden rounded-l-md bg-[color-mix(in_oklab,var(--cream)_92%,white)]"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          boxShadow: "inset -14px 0 24px -18px rgba(0,0,0,.55)",
        }}
      >
        {back ? (
          <img src={back} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-ink/40">·</span>
        )}
      </button>
    </div>
  );
}

export function ComicBook({ onFinish }: { onFinish: () => void }) {
  const { pages, total, loading, error } = usePdfPages(comicConfig.pdf);
  const touch = useIsTouch();
  const [openBook, setOpenBook] = useState(false);
  const [sheet, setSheet] = useState(0); // how many sheets are flipped
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [ended, setEnded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /** Fallback "pages" rendered as text when the PDF cannot be read. */
  const fallback = useMemo(
    () =>
      error
        ? comicConfig.fallbackPages.map(
            (t) =>
              `data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1100'><rect width='100%' height='100%' fill='%23fdf6ec'/><foreignObject x='60' y='420' width='680' height='400'><div xmlns='http://www.w3.org/1999/xhtml' style="font-family:Georgia,serif;font-size:40px;color:#4a2b38;text-align:center;line-height:1.3">${t}</div></foreignObject></svg>`,
              )}`,
          )
        : [],
    [error],
  );

  const list = error ? fallback : pages;
  const pageCount = error ? fallback.length : total || pages.length;
  const sheets = Math.max(1, Math.ceil(pageCount / 2));

  const next = useCallback(() => {
    setSheet((s) => {
      const n = Math.min(s + 1, sheets);
      if (n === sheets && s !== n) {
        setEnded(true);
        confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: ["#f7b9c8", "#f8d8a8", "#d9c4f5"] });
        onFinish();
      }
      return n;
    });
  }, [sheets, onFinish]);

  const prev = useCallback(() => setSheet((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    if (!openBook) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openBook, next, prev]);

  // swipe support
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !openBook) return;
    let x0 = 0;
    const start = (e: TouchEvent) => (x0 = e.touches[0].clientX);
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0;
      if (dx < -50) next();
      if (dx > 50) prev();
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [openBook, next, prev]);

  const currentPage = Math.min(pageCount, sheet * 2 + (openBook ? 1 : 0));

  return (
    <section id="comic" className="grain relative overflow-hidden py-28" style={{ background: "var(--gradient-dawn)" }}>
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(1.8rem,4.5vw,3rem)] text-ink"
        >
          {comicConfig.title}
        </motion.h2>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-ink/50">{comicConfig.subtitle}</p>

        <div
          ref={wrapRef}
          className="relative mx-auto mt-12"
          style={{ perspective: 2200 }}
          onPointerMove={(e) => {
            if (touch || openBook || !wrapRef.current) return;
            const r = wrapRef.current.getBoundingClientRect();
            setTilt({
              rx: -((e.clientY - r.top) / r.height - 0.5) * 14,
              ry: ((e.clientX - r.left) / r.width - 0.5) * 22,
            });
          }}
          onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
        >
          <motion.div
            className="preserve-3d relative mx-auto"
            animate={{
              rotateX: openBook ? 6 : tilt.rx,
              rotateY: openBook ? 0 : tilt.ry,
              y: openBook ? 0 : [0, -10, 0],
              width: openBook ? "100%" : "58%",
            }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, default: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
            style={{ aspectRatio: openBook ? "16 / 11" : "8 / 11", maxWidth: openBook ? 980 : 420 }}
          >
            {!openBook ? (
              /* ---------- CLOSED BOOK ---------- */
              <button
                type="button"
                onClick={() => setOpenBook(true)}
                aria-label="Open the comic book"
                className="preserve-3d group relative block h-full w-full rounded-r-xl rounded-l-md focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ink"
                style={{
                  background: "linear-gradient(135deg, color-mix(in oklab, var(--pink) 70%, white), color-mix(in oklab, var(--lavender) 80%, white))",
                  boxShadow: "var(--shadow-lift), 24px 0 0 -6px color-mix(in oklab, var(--ink) 12%, transparent), 30px 0 0 -12px color-mix(in oklab, var(--ink) 10%, transparent)",
                }}
              >
                <span className="absolute inset-y-0 left-0 w-6 rounded-l-md" style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--ink) 35%, var(--pink)), transparent)" }} />
                <span className="absolute inset-6 flex flex-col items-center justify-center gap-4 rounded-lg border border-[color-mix(in_oklab,white_60%,transparent)]">
                  <span className="font-display text-3xl text-ink">{comicConfig.title}</span>
                  <span className="text-xs uppercase tracking-[0.35em] text-ink/60">click to open</span>
                </span>
                <span className="absolute inset-0 rounded-r-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.55), transparent 60%)" }} />
              </button>
            ) : (
              /* ---------- OPEN BOOK ---------- */
              <motion.div
                initial={{ rotateY: -25, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="preserve-3d relative h-full w-full"
                style={{ boxShadow: "var(--shadow-lift)" }}
              >
                {/* static left page (base) */}
                <div className="absolute left-0 top-0 h-full w-1/2 overflow-hidden rounded-l-md bg-[color-mix(in_oklab,var(--cream)_92%,white)]" style={{ boxShadow: "inset -16px 0 26px -20px rgba(0,0,0,.6)" }}>
                  {list[sheet * 2 - 1] ? (
                    <img src={list[sheet * 2 - 1]} alt={`Comic page ${sheet * 2}`} className="h-full w-full object-contain" />
                  ) : (
                    <span className="flex h-full items-center justify-center px-6 text-center font-display text-lg text-ink/40">
                      {comicConfig.title}
                    </span>
                  )}
                </div>
                {/* static right base (behind sheets) */}
                <div className="absolute left-1/2 top-0 h-full w-1/2 rounded-r-md bg-[color-mix(in_oklab,var(--cream)_88%,white)]" />
                {/* spine */}
                <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,.22), transparent)" }} />

                {Array.from({ length: sheets }).map((_, i) => (
                  <Sheet
                    key={i}
                    front={list[i * 2]}
                    back={list[i * 2 + 1]}
                    flipped={i < sheet}
                    z={i < sheet ? i : sheets - i}
                    onNext={next}
                    onPrev={prev}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* controls */}
        {openBook && (
          <div className="mt-10 flex items-center justify-center gap-4 text-ink/70">
            <button type="button" onClick={prev} aria-label="Previous page" className="rounded-full bg-ink/10 p-3 hover:bg-ink/20">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-28 text-sm tabular-nums">
              {loading ? "loading…" : `Page ${Math.max(1, currentPage)} / ${pageCount || "?"}`}
            </span>
            <button type="button" onClick={next} aria-label="Next page" className="rounded-full bg-ink/10 p-3 hover:bg-ink/20">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => wrapRef.current?.requestFullscreen?.()}
              aria-label="Fullscreen book"
              className="rounded-full bg-ink/10 p-3 hover:bg-ink/20"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {loading && !error && (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink/50">
            <Loader2 className="h-4 w-4 animate-spin" /> preparing the pages
          </p>
        )}
        {error && (
          <p className="mt-6 text-sm text-ink/50">
            The comic file couldn&apos;t be read, so here&apos;s a placeholder story instead.
          </p>
        )}

        <AnimatePresence>
          {ended && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 flex flex-col gap-4">
              {endingLines.map((l, i) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.8, duration: 1 }}
                  className="font-display text-[clamp(1.3rem,3vw,2rem)] text-ink/85"
                >
                  {l}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
