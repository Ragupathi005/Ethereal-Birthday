import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useIsTouch";

type Props = {
  /** density multiplier */
  count?: number;
  variant?: "dust" | "sparkle" | "hearts";
  className?: string;
};

/** Single lightweight canvas particle layer — cheap, GPU friendly, mouse aware. */
export function ParticleField({ count = 60, variant = "dust", className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const n = Math.round(count * (w < 700 ? 0.5 : 1));
    const colors = ["#f7b9c8", "#f8d8a8", "#d9c4f5", "#bcd9f5", "#ffffff"];
    const parts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * (variant === "hearts" ? 6 : 2.6),
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.1 - Math.random() * 0.35,
      a: 0.25 + Math.random() * 0.5,
      p: Math.random() * Math.PI * 2,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    let mx = -999;
    let my = -999;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.p += 0.01;
        p.x += p.vx + Math.sin(p.p) * 0.14;
        p.y += p.vy;
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (14000 - d2) / 14000;
          p.x += (dx / (Math.sqrt(d2) || 1)) * f * 1.4;
          p.y += (dy / (Math.sqrt(d2) || 1)) * f * 1.4;
        }
        if (p.y < -20) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 10;
        if (p.x > w + 20) p.x = -10;

        ctx.globalAlpha = p.a * (variant === "sparkle" ? 0.6 + 0.4 * Math.sin(p.p * 3) : 1);
        ctx.fillStyle = p.c;
        if (variant === "hearts") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(p.r / 8, p.r / 8);
          ctx.beginPath();
          ctx.moveTo(0, 3);
          ctx.bezierCurveTo(-6, -3, -3, -9, 0, -5);
          ctx.bezierCurveTo(3, -9, 6, -3, 0, 3);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    if (!reduced) raf = requestAnimationFrame(draw);
    else draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [count, variant, reduced]);

  return <canvas ref={ref} aria-hidden className={className ?? "pointer-events-none absolute inset-0 h-full w-full"} />;
}
