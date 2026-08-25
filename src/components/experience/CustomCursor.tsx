import { useEffect, useRef } from "react";
import { useIsTouch } from "./useIsTouch";

/** Elegant, smoothed custom cursor. Disabled entirely on touch devices. */
export function CustomCursor() {
  const touch = useIsTouch();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (touch) return;
    document.documentElement.classList.add("cursor-none-desktop");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let target = 1;
    let raf = 0;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest("button, a, [data-cursor='hover'], input, video");
      target = interactive ? 2.1 : 1;
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (target - scale) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [touch]);

  if (touch) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[999]">
      <div
        ref={ring}
        className="absolute h-9 w-9 rounded-full border border-ink/25 transition-colors"
        style={{ boxShadow: "var(--shadow-glow)", background: "color-mix(in oklab, var(--pink) 12%, transparent)" }}
      />
      <div ref={dot} className="absolute h-1.5 w-1.5 rounded-full" style={{ background: "var(--ink)" }} />
    </div>
  );
}
