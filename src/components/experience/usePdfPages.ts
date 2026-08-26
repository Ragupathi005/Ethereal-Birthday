import { useEffect, useState } from "react";

export type PdfState = {
  pages: string[]; // rendered page images (data URLs)
  total: number;
  loading: boolean;
  error: string | null;
};

/**
 * Loads a PDF with pdf.js and renders pages to images, progressively.
 * Fails softly: on error the caller shows a friendly fallback book.
 */
export function usePdfPages(url: string, scale = 1.4) {
  const [state, setState] = useState<PdfState>({ pages: [], total: 0, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    let doc: { numPages: number; getPage: (n: number) => Promise<any>; destroy: () => void } | null = null;

    (async () => {
      try {
        const pdfjs: any = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        doc = await pdfjs.getDocument({ url }).promise;
        if (cancelled || !doc) return;
        const total = doc.numPages;
        setState((s) => ({ ...s, total }));

        const rendered: string[] = [];
        for (let i = 1; i <= total; i++) {
          if (cancelled) return;
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          rendered.push(canvas.toDataURL("image/jpeg", 0.85));
          page.cleanup();
          canvas.width = 0;
          canvas.height = 0;
          if (!cancelled) setState({ pages: [...rendered], total, loading: i < total, error: null });
        }
      } catch (e) {
        if (!cancelled)
          setState({ pages: [], total: 0, loading: false, error: e instanceof Error ? e.message : "Could not load the comic" });
      }
    })();

    return () => {
      cancelled = true;
      try {
        doc?.destroy();
      } catch {
        /* noop */
      }
    };
  }, [url, scale]);

  return state;
}
