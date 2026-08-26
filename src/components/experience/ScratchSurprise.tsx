import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Award, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { scratchCardConfig } from "@/data/birthday";
import { playSfx } from "./MusicController";

export function ScratchSurprise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratched, setScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 380);
    const h = (canvas.height = canvas.offsetHeight || 190);

    // Draw metallic gold & rose foil coating
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#D99E43");
    grad.addColorStop(0.3, "#F4D396");
    grad.addColorStop(0.7, "#C86D58");
    grad.addColorStop(1, "#D99E43");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative foil text
    ctx.fillStyle = "#1E1613";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ SCRATCH WITH TOUCH OR CURSOR ✨", w / 2, h / 2 + 5);
  }, []);

  const triggerFullReveal = () => {
    if (scratched) return;
    setScratched(true);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#D99E43", "#C86D58", "#527A8A", "#7E987F", "#C27E89", "#FFFFFF"],
    });
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || scratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    // Auto-clear at 35%
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearCount = 0;
    for (let i = 3; i < imgData.data.length; i += 16) {
      if (imgData.data[i] === 0) clearCount++;
    }
    const percent = clearCount / (imgData.data.length / 16);
    if (percent >= 0.35) {
      triggerFullReveal();
    }
  };

  return (
    <section id="surprise" className="relative overflow-hidden py-12 sm:py-18 px-4 select-none" style={{ background: "var(--gradient-open)" }}>
      {/* Decorative Doraemon GIF in Right Side Top — Lower & Larger */}
      <motion.img
        src="/Page%20content/Doraemon.gif"
        alt="Doraemon"
        initial={{ opacity: 0, x: 40, y: -20, rotate: 6 }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute right-0 sm:right-[1%] md:right-[2%] top-[12%] sm:top-[16%] md:top-[18%] w-36 sm:w-48 md:w-60 drop-shadow-2xl z-10 select-none"
      />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#D99E43] shadow-xs border border-[#E6DCCD]"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Mini Surprise</span>
          <Sparkles className="h-3.5 w-3.5 text-[#C86D58]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold text-[#1E1613] tracking-tight"
        >
          {scratchCardConfig.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-1.5 font-serif-luxury text-base sm:text-lg text-[#1E1613] font-medium"
        >
          {scratchCardConfig.subtitle}
        </motion.p>

        {/* Scratch Card Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto mt-6 h-48 sm:h-56 w-full max-w-md rounded-3xl overflow-hidden shadow-lift border-2 border-white p-1 bg-white"
        >
          {/* Secret Message Underneath */}
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#FAF7F2] via-[#FFFDF9] to-[#FAF7F2] p-5 text-center border border-[#E6DCCD]">
            <Sparkles className="h-7 w-7 text-[#D99E43] animate-spin" style={{ animationDuration: "7s" }} />
            <p className="mt-2 font-display text-lg sm:text-xl font-bold text-[#1E1613] leading-snug">
              {scratchCardConfig.secretMessage}
            </p>
            {scratched && (
              <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Secret Unlocked! 🎉</span>
              </span>
            )}
          </div>

          {/* HTML5 Canvas Scratchable Top Foil */}
          <canvas
            ref={canvasRef}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onMouseMove={(e) => {
              if (isDrawing) scratch(e.clientX, e.clientY);
            }}
            onTouchStart={() => setIsDrawing(true)}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={(e) => {
              if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
            }}
            className="absolute inset-0 h-full w-full rounded-2xl cursor-pointer transition-opacity duration-500"
            style={{ opacity: scratched ? 0 : 1, pointerEvents: scratched ? "none" : "auto" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
