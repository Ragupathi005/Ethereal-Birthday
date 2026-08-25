/**
 * REPLACE: put your comic at public/gift/comic.pdf (same path) — nothing else to change.
 */
export const comicConfig = {
  pdf: "/gift/comic.pdf",
  title: "A Story For You",
  subtitle: "written, drawn and slightly over-thought",
  /** Used when the PDF cannot be loaded, so the site never breaks. */
  fallbackPages: [
    "This is where the comic lives.",
    "Drop your PDF at /public/gift/comic.pdf",
    "and this book will read it, page by page.",
    "Happy Birthday anyway.",
  ],
};
