/**
 * ============================================================
 * MAIN BIRTHDAY CONFIGURATION
 * Easily replace or customize these values anytime!
 * ============================================================
 */
export const birthdayConfig = {
  /** The birthday person's name */
  name: "Thenmozhi",
  /** Intro mystery teasers */
  teaserPre: "I made something for you...",
  teaserPost: "A little birthday surprise.",
  buttonLabel: "Open Your Surprise",
  /** Main Birthday Reveal */
  greeting: "Happy Birthday",
  subline: "To someone who makes ordinary days completely unforgettable.",
  /** Cake & Gift Box visuals */
  cakeImage: "/media/cake.jpg",
  giftImage: "/media/gift.jpg",
  /** Final Epilogue line */
  finalMessage: "Here's to another year of laughter, adventures, unforgettable moments, and everything that makes you, YOU.",
};

/** Interactive balloon pop wishes (revealed for 5-6s upon clicking a balloon) */
export const balloonWishes = [
  "More adventures and spontaneous roadtrips ahead! 🚗✨",
  "Keep that bright smile that lights up every room.",
  "Here's to another amazing year of laughter and crazy memories!",
  "May every wish you make today come true in unexpected ways.",
  "You make the ordinary days feel like the best kind of celebration.",
  "Never stop being the incredible person you are today. 🌟",
];

/** Interactive 3D birthday wish envelopes / cards */
export const interactiveWishes = [
  {
    id: "w1",
    label: "A Wish for Smiles",
    tag: "Joy",
    message: "I hope this year gives you a thousand more reasons to smile every single day.",
    color: "#C86D58", // Coral
  },
  {
    id: "w2",
    label: "A Wish for Adventure",
    tag: "Journeys",
    message: "May your upcoming year be packed with exciting stories, new places, and zero regrets.",
    color: "#527A8A", // Dusty Blue
  },
  {
    id: "w3",
    label: "A Wish for Peace",
    tag: "Comfort",
    message: "For quiet evenings, morning sunlight, good coffee, and always feeling at home.",
    color: "#7E987F", // Sage
  },
  {
    id: "w4",
    label: "A Wish for Memories",
    tag: "Keepsake",
    message: "Here's to making more memories that we will look back on and laugh about years from now.",
    color: "#D99E43", // Warm Gold
  },
];

/** Staged emotional thoughts in the reflection chapter */
export const emotionalLines = [
  "Some moments are loud.",
  "Some are completely ordinary.",
  "A conversation on a walkway.",
  "A laugh between classes.",
  "A random photograph we almost forgot.",
  "And somehow... those are the moments that stay.",
  "I'm really glad I got to share them with you.",
];

/** Digital scratch card secret message */
export const scratchCardConfig = {
  title: "A Little Surprise Scratch Card",
  subtitle: "Scratch the surface with your cursor or finger to reveal the secret message!",
  secretMessage: "🎉 You are officially one year more awesome, wise, and irreplaceable! Happy Birthday! 💫",
};

/** Subtle Easter Egg discoveries */
export const easterEggs = {
  star: "🌟 You found the hidden star! May your year sparkle with good fortune.",
  bookmark: "📑 Secret Bookmark: 'You weren't supposed to find this yet... but since you did, here's a high five!'",
};

/** Background music settings */
export const musicConfig = {
  src: "/assets/music/The%20Cycle%20%20Meiyazhagan.mp3",
  volume: 0.7,
};
