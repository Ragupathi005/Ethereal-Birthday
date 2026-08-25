export type Memory = {
  id: string;
  /** REPLACE: put your photos in public/media/photos/ and point here */
  image: string;
  title: string;
  date: string;
  description: string;
};

/**
 * ============================================================
 * MEMORIES — replace image/title/date/description freely.
 * Placeholder photos come from picsum.photos (random but stable seeds).
 * ============================================================
 */
export const memories: Memory[] = [
  { id: "m1", image: "https://picsum.photos/seed/bday-a/800/1000", title: "That Random Day", date: "Some Tuesday", description: "No plan, no reason. Still one of the best days." },
  { id: "m2", image: "https://picsum.photos/seed/bday-b/900/700", title: "One Of Those Moments", date: "Late evening", description: "We laughed until it stopped making sense." },
  { id: "m3", image: "https://picsum.photos/seed/bday-c/800/1100", title: "Unforgettable", date: "Last winter", description: "Cold hands, warm everything else." },
  { id: "m4", image: "https://picsum.photos/seed/bday-d/1000/800", title: "Just Us", date: "A slow afternoon", description: "Nothing happened. Everything happened." },
  { id: "m5", image: "https://picsum.photos/seed/bday-e/800/900", title: "The Little Things", date: "Every week", description: "The small stuff turned out to be the big stuff." },
  { id: "m6", image: "https://picsum.photos/seed/bday-f/900/1200", title: "Golden Hour", date: "Summer", description: "The light was good. The company was better." },
  { id: "m7", image: "https://picsum.photos/seed/bday-g/1000/750", title: "Detour", date: "On the way home", description: "We got lost on purpose." },
  { id: "m8", image: "https://picsum.photos/seed/bday-h/800/1000", title: "Loud Nights", date: "That one weekend", description: "Neighbours were not impressed." },
  { id: "m9", image: "https://picsum.photos/seed/bday-i/900/900", title: "Quiet Mornings", date: "Too early", description: "Coffee, silence, comfortable." },
  { id: "m10", image: "https://picsum.photos/seed/bday-j/850/1050", title: "The Inside Joke", date: "Still going", description: "Nobody else will ever get it." },
  { id: "m11", image: "https://picsum.photos/seed/bday-k/1000/820", title: "Somewhere New", date: "The trip", description: "New place, same us." },
  { id: "m12", image: "https://picsum.photos/seed/bday-l/820/1020", title: "Today", date: "Right now", description: "Adding one more to the collection." },
];

/** REPLACE: the four story cards */
export const memoryCards = [
  { id: "c1", title: "That random day...", body: "The one with no plan at all — and somehow it became the story we keep telling.", tint: "var(--peach)" },
  { id: "c2", title: "That one unforgettable moment...", body: "You know the one. We didn't take a photo, and we still remember every second.", tint: "var(--pink)" },
  { id: "c3", title: "The moments we didn't know would matter...", body: "Ordinary days that quietly turned into the ones I'd never trade.", tint: "var(--lavender)" },
  { id: "c4", title: "Some memories stay forever.", body: "And some people do too. Thanks for being both.", tint: "var(--sky)" },
];
