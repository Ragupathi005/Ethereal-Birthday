import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { playSfx } from "./MusicController";

const MOODS = [
  { name: "Warm Ivory", bg: "radial-gradient(circle at 50% 0%, #FAF7F2 0%, #F5EDE3 50%, #ECE0D0 100%)" },
  { name: "Sunset Peach", bg: "radial-gradient(circle at 50% 0%, #FFF5EB 0%, #FDE8D7 40%, #F9DDD0 70%, #F5EDE3 100%)" },
  { name: "Soft Sage", bg: "radial-gradient(circle at 50% 0%, #F4F8F4 0%, #E8F0E8 45%, #DFEADF 75%, #FAF7F2 100%)" },
  { name: "Golden Glow", bg: "radial-gradient(circle at 50% 0%, #FFFDF5 0%, #FEF7E0 40%, #FBECC5 70%, #FAF7F2 100%)" },
];

/**
 * Interactive Magic Sparkle Cursor with Continuous Glitter Trail
 * + Double-Click / Double-Tap Particle Burst & Ambient Mood Shift
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let currentMood = 0;

    const onDblClick = (e: MouseEvent | TouchEvent) => {
      let clientX = window.innerWidth / 2;
      let clientY = window.innerHeight / 2;

      if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      playSfx("pop");

      // Spawn burst of stars & confetti at click coordinate
      confetti({
        particleCount: 40,
        spread: 80,
        startVelocity: 35,
        origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
        colors: ["#C86D58", "#D99E43", "#527A8A", "#7E987F", "#C27E89", "#FFFFFF"],
      });

      // Shift ambient background theme dynamically on double click!
      currentMood = (currentMood + 1) % MOODS.length;
      const mood = MOODS[currentMood];
      if (mood) {
        document.body.style.background = mood.bg;
        document.body.style.transition = "background 0.8s ease";
      }
    };

    window.addEventListener("dblclick", onDblClick);
    return () => {
      window.removeEventListener("dblclick", onDblClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      alpha: number;
      vx: number;
      vy: number;
      rot: number;
      vRot: number;
    }> = [];

    const colors = ["#D99E43", "#C86D58", "#527A8A", "#7E987F", "#F4D396", "#FFFFFF"];

    let lastX = -1;
    let lastY = -1;

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 4) {
        lastX = x;
        lastY = y;
        const count = Math.min(Math.floor(dist / 6) + 1, 4);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            size: Math.random() * 4 + 2.5,
            color: colors[Math.floor(Math.random() * colors.length)] ?? "#D99E43",
            alpha: 1,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.2 + 0.4,
            rot: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.1,
          });
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        p.alpha -= 0.025;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        // Draw 4-point sparkle star
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.quadraticCurveTo(0, 0, s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2);
        ctx.quadraticCurveTo(0, 0, -s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
    />
  );
}
