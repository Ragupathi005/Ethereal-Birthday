import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Film, Clapperboard, Sparkles } from "lucide-react";
import { videoConfig } from "@/data/video";
import { bgm, playSfx } from "./MusicController";

export function VideoSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrap, { amount: 0.25 });
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Auto pause video if scrolled out of view
  useEffect(() => {
    if (!inView && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [inView]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    playSfx("click");

    if (v.paused) {
      // Temporarily pause background music so video audio is clear
      bgm.pause();
      void v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // If play fails unmuted, retry muted (browser autoplay restriction)
          v.muted = true;
          setMuted(true);
          void v.play().then(() => setPlaying(true));
        });
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      id="video"
      className="relative overflow-hidden py-12 sm:py-20 px-3 sm:px-4 select-none transition-colors duration-700"
      style={{
        background: playing
          ? "radial-gradient(circle at 50% 50%, #ECE4D6 0%, #DFD3C2 100%)"
          : "var(--gradient-video)",
      }}
    >
      {/* Ambient Spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[500px] rounded-full bg-[#D99E43]/10 blur-[130px]" />

      {/* Decorative Buji Image — Top-Left Corner, completely clear of title text */}
      <motion.img
        src="/Page%20content/Buji.png"
        alt="Buji"
        initial={{ opacity: 0, x: -40, rotate: -4 }}
        whileInView={{ opacity: 1, x: 0, rotate: -4 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-2 sm:left-4 md:left-8 lg:left-12 top-2 sm:top-4 md:top-6 w-20 sm:w-32 md:w-44 lg:w-56 max-h-[260px] object-contain drop-shadow-2xl z-20 select-none"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Film Header */}
        <motion.div
          animate={{ opacity: playing ? 0.4 : 1 }}
          className="relative transition-opacity duration-500"
        >

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#C86D58] shadow-xs border border-[#E6DCCD]"
          >
            <Clapperboard className="h-3.5 w-3.5" />
            <span>A Captured Memory</span>
            <Sparkles className="h-3.5 w-3.5 text-[#D99E43]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-2 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold text-[#1E1613] tracking-tight"
          >
            {videoConfig.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-2 max-w-lg font-serif-luxury text-base sm:text-lg text-[#1E1613] font-medium"
          >
            {videoConfig.subtitle}
          </motion.p>
        </motion.div>

        {/* Vintage Film Projector Frame */}
        <motion.div
          ref={wrap}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 overflow-hidden rounded-3xl p-2.5 sm:p-4 shadow-2xl border border-[#E6DCCD]"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            boxShadow: playing
              ? "0 30px 70px -15px rgba(40, 32, 28, 0.3), 0 0 45px rgba(217, 158, 67, 0.15)"
              : "0 18px 40px -10px rgba(40, 32, 28, 0.12)",
          }}
        >
          {/* Film Strip Header */}
          <div className="mb-2 flex items-center justify-between px-2 text-[#1E1613] text-[11px] font-mono select-none">
            <div className="flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-[#C86D58]" />
              <span className="font-bold tracking-wider">{videoConfig.timestamp}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2 w-3 rounded-xs bg-neutral-300" />
              <span className="h-2 w-3 rounded-xs bg-neutral-300" />
              <span className="h-2 w-3 rounded-xs bg-neutral-300" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-black">
            {/* Native HTML5 Video — direct src, no lazy loading trick */}
            <video
              ref={videoRef}
              className="w-full aspect-video rounded-2xl"
              style={{ display: "block", objectFit: "contain" }}
              src={videoConfig.src}
              poster={videoConfig.poster}
              preload="auto"
              playsInline
              muted={muted}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              onEnded={() => {
                setPlaying(false);
                bgm.play();
              }}
              onError={(e) => {
                console.error("Video error:", e);
                setHasError(true);
              }}
            />

            {/* Error Fallback */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 rounded-2xl gap-2 text-center p-4">
                <span className="text-2xl">🎬</span>
                <p className="font-display text-base font-bold text-[#1E1613]">
                  Video file is available locally
                </p>
                <p className="text-xs text-[#706259]">
                  Push to GitHub or deploy to see the video online.
                </p>
              </div>
            )}

            {/* Play Overlay */}
            {!playing && !hasError && (
              <button
                type="button"
                onClick={toggle}
                aria-label="Play memorable video"
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#B85E48] to-[#D99E43] text-white shadow-2xl"
                >
                  <Play className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5 fill-current" />
                </motion.div>
              </button>
            )}
          </div>

          {/* Controls Bar */}
          <div className="mt-3 flex items-center gap-2 sm:gap-3 px-1 sm:px-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause video" : "Play video"}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#C86D58]/10 text-[#C86D58] hover:bg-[#C86D58]/20 transition-colors cursor-pointer"
            >
              {playing ? (
                <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              aria-label="Video progress"
              onChange={(e) => {
                const v = videoRef.current;
                if (v?.duration) {
                  v.currentTime = (Number(e.target.value) / 100) * v.duration;
                }
              }}
              className="h-1.5 sm:h-2 flex-1 accent-[#C86D58] cursor-pointer"
            />

            <button
              type="button"
              onClick={() => {
                const newMuted = !muted;
                setMuted(newMuted);
                if (videoRef.current) videoRef.current.muted = newMuted;
              }}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#C86D58]/10 text-[#C86D58] hover:bg-[#C86D58]/20 transition-colors cursor-pointer"
            >
              {muted ? (
                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => videoRef.current?.requestFullscreen?.()}
              aria-label="Fullscreen"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#C86D58]/10 text-[#C86D58] hover:bg-[#C86D58]/20 transition-colors cursor-pointer"
            >
              <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
