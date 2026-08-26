import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { videoConfig } from "@/data/video";
import { ParticleField } from "./ParticleField";

export function VideoSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrap, { amount: 0.4 });
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!inView && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [inView]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-32" style={{ background: "var(--gradient-dusk)" }}>
      <ParticleField count={40} variant="dust" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(1.8rem,4.5vw,3rem)] text-ink"
        >
          {videoConfig.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-3 max-w-md text-ink/65"
        >
          {videoConfig.caption}
        </motion.p>

        <motion.div
          ref={wrap}
          initial={{ opacity: 0, y: 70, rotateX: 16, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200, boxShadow: "var(--shadow-lift)" }}
          className="glass-panel relative mt-12 overflow-hidden rounded-[2rem] p-3"
        >
          <video
            ref={videoRef}
            className="w-full rounded-2xl bg-ink/10"
            src={inView || ready ? videoConfig.src : undefined}
            poster={videoConfig.poster}
            preload="none"
            playsInline
            muted={muted}
            onCanPlay={() => setReady(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
            }}
            onEnded={() => setPlaying(false)}
          />

          <div className="mt-3 flex items-center gap-3 px-2 pb-1">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"} className="rounded-full bg-ink/10 p-3 text-ink hover:bg-ink/20">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              aria-label="Video progress"
              onChange={(e) => {
                const v = videoRef.current;
                if (v?.duration) v.currentTime = (Number(e.target.value) / 100) * v.duration;
              }}
              className="h-1 flex-1 accent-[var(--pink)]"
            />
            <button
              type="button"
              onClick={() => {
                setMuted((m) => !m);
                if (videoRef.current) videoRef.current.muted = !muted;
              }}
              aria-label={muted ? "Unmute" : "Mute"}
              className="rounded-full bg-ink/10 p-3 text-ink hover:bg-ink/20"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => videoRef.current?.requestFullscreen?.()}
              aria-label="Fullscreen"
              className="rounded-full bg-ink/10 p-3 text-ink hover:bg-ink/20"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
