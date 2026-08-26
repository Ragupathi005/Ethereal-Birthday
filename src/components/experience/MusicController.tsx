import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { musicConfig } from "@/data/birthday";

/**
 * Singleton Background Music Manager
 */
class BackgroundMusicEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private listeners = new Set<(playing: boolean) => void>();

  private init() {
    if (!this.audio && typeof window !== "undefined") {
      const src = musicConfig.src || "/assets/music/the-cycle-meiyazhagan.mp3";
      this.audio = new Audio(src);
      this.audio.loop = true;
      this.audio.volume = musicConfig.volume ?? 0.7;

      this.audio.addEventListener("play", () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener("pause", () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener("ended", () => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  play() {
    this.init();
    if (!this.audio) return;
    this.audio.volume = musicConfig.volume ?? 0.7;
    void this.audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch(() => {
      // Browser autoplay restriction before user interaction
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  subscribe(listener: (playing: boolean) => void) {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying));
  }
}

export const bgm = new BackgroundMusicEngine();
export const startBackgroundMusic = () => bgm.play();
export const toggleBackgroundMusic = () => bgm.toggle();

/**
 * Audio SFX engine using real high-quality MP3 clips
 */
class RealAudioSoundFx {
  private popAudios: HTMLAudioElement[] = [];
  private cheerAudio: HTMLAudioElement | null = null;
  private pageAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const pop1 = new Audio("/assets/music/party-balloon-pop.mp3");
        pop1.volume = 0.85;
        const pop2 = new Audio("/assets/music/party-balloon-pop2.mp3");
        pop2.volume = 0.85;
        this.popAudios = [pop1, pop2];

        // Cheering sound strictly for candle blowout
        const cheer = new Audio("/assets/music/cheering-and-clapping-crowd.mp3");
        cheer.volume = 0.85;
        this.cheerAudio = cheer;

        // Paper page flip sound
        const page = new Audio("/assets/music/page-flip.mp3");
        page.volume = 0.75;
        this.pageAudio = page;
      } catch {
        // Fallback
      }
    }
  }

  play(type: "pop" | "click" | "page" | "fanfare" | "cheer" | "unwrap") {
    if (typeof window === "undefined") return;

    try {
      if (type === "pop") {
        if (this.popAudios.length > 0) {
          const rand = Math.floor(Math.random() * this.popAudios.length);
          const audio = this.popAudios[rand];
          if (audio) {
            audio.currentTime = 0;
            void audio.play().catch(() => {});
            return;
          }
        }
      } else if (type === "cheer") {
        // STRICTLY for candle blow!
        if (this.cheerAudio) {
          this.cheerAudio.currentTime = 0;
          void this.cheerAudio.play().catch(() => {});
          return;
        }
      } else if (type === "page") {
        if (this.pageAudio) {
          this.pageAudio.currentTime = 0;
          void this.pageAudio.play().catch(() => {});
          return;
        }
      }
    } catch {
      // Audio autoplay restriction handling
    }
  }
}

export const sfx = new RealAudioSoundFx();
export const playSfx = (type: "pop" | "click" | "page" | "fanfare" | "cheer" | "unwrap") => sfx.play(type);

export function MusicController() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return bgm.subscribe((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  return (
    <aside aria-label="Music and audio controls" className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={() => bgm.toggle()}
        data-cursor="CLICK"
        aria-label={isPlaying ? "Turn off background music" : "Turn on background music"}
        className="group relative flex items-center gap-2.5 rounded-full px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-[#1E1613] bg-white/95 shadow-lift border border-[#E6DCCD] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="text-[#C86D58]">
          {isPlaying ? (
            <Volume2 className="h-4 w-4 transition-transform group-hover:scale-110 text-[#C86D58]" />
          ) : (
            <VolumeX className="h-4 w-4 text-[#706259]" />
          )}
        </span>
        <span className="hidden sm:inline font-bold">
          {isPlaying ? "Music On" : "Music Off"}
        </span>
        {isPlaying && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C86D58] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C86D58]" />
          </span>
        )}
      </button>
    </aside>
  );
}
