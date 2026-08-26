import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroGate } from "@/components/experience/IntroGate";
import { CustomCursor } from "@/components/experience/CustomCursor";
import { MusicController } from "@/components/experience/MusicController";
import { ProgressNav } from "@/components/experience/ProgressNav";
import { BirthdayHero } from "@/components/experience/BirthdayHero";
import { BirthdayWishes } from "@/components/experience/BirthdayWishes";
import { MemoryGallery } from "@/components/experience/MemoryGallery";
import { VideoSection } from "@/components/experience/VideoSection";
import { EmotionalMessage } from "@/components/experience/EmotionalMessage";
import { ScratchSurprise } from "@/components/experience/ScratchSurprise";
import { GiftReveal } from "@/components/experience/GiftReveal";
import { ComicBook } from "@/components/experience/ComicBook";
import { FinalCelebration } from "@/components/experience/FinalCelebration";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [giftUnwrapped, setGiftUnwrapped] = useState(false);
  const [showFinale, setShowFinale] = useState(false);

  const handleReset = () => {
    setShowFinale(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen selection:bg-[#C86D58] selection:text-white">
      <AnimatePresence mode="wait">
        {!opened && (
          <IntroGate
            key="intro"
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>

      {opened && (
        <>
          {/* Ambient controls and experience overlays */}
          <CustomCursor />
          <MusicController />
          <ProgressNav />

          {/* 1. Main Birthday Reveal & Stylized 3D Cake */}
          <div id="hero">
            <BirthdayHero />
          </div>

          {/* 2. Birthday Wishes (3D Envelopes) */}
          <div id="wishes">
            <BirthdayWishes />
          </div>

          {/* 3. 3D Memory Photo Wall & Physical Viewer */}
          <div id="memories">
            <MemoryGallery />
          </div>

          {/* 4. Cinematic 35mm Memory Film Reel */}
          <div id="video">
            <VideoSection />
          </div>

          {/* 5. Heartfelt Friendship Reflections */}
          <div id="message">
            <EmotionalMessage />
          </div>

          {/* 6. Mini Surprise: Digital Scratch Card */}
          <div id="surprise">
            <ScratchSurprise />
          </div>

          {/* 7. The Big Special Gift: Luxury Present & Permanent 3D Comic Book */}
          <div id="gift-section" className="relative">
            <GiftReveal
              opened={giftUnwrapped}
              onOpen={() => {
                setGiftUnwrapped(true);
                setTimeout(() => {
                  const bookEl = document.getElementById("revealed-book");
                  if (bookEl) {
                    bookEl.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 400);
              }}
            />

            {/* Revealed 3D Comic Book (Permanently stays visible once unwrapped) */}
            <AnimatePresence>
              {giftUnwrapped && (
                <motion.div
                  id="revealed-book"
                  initial={{ opacity: 0, y: 70, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="pb-16"
                >
                  <ComicBook onFinish={() => setShowFinale(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Optional Finale Celebration Modal (opened on explicit request) */}
          <FinalCelebration
            show={showFinale}
            onReset={handleReset}
          />
        </>
      )}
    </main>
  );
}
