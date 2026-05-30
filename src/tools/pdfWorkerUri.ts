/**
 * pdfWorkerUri.ts — Exports the PDF.js worker URL for pdfjs-dist v5.x.
 *
 * Uses a local copy of pdf.worker.min.mjs when available (copied during build),
 * falls back to CDN for the matching pdfjs-dist version (5.7.x).
 *
 * This file is auto-generated / maintained as part of the build pipeline.
 * It is COMMITTED to the repository (no longer gitignored) to ensure
 * the GitHub Actions CI can resolve the module during `tsc --noEmit`.
 */

export const WORKER_URI = (() => {
  // Try local worker file (copied to plugin root during build)
  // In Obsidian runtime, plugin dir is available
  try {
    // @ts-ignore — app is globally available in Obsidian
    const plugin = (typeof app !== "undefined" ? app : null)?.plugins?.getPlugin?.("copilot-personal");
    if (plugin?.manifest?.dir) {
      return `${plugin.manifest.dir}/pdf.worker.min.mjs`;
    }
  } catch { /* not in Obsidian context */ }

  // Fallback: CDN for pdfjs-dist v5.7.x
  return "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.7.284/pdf.worker.min.mjs";
})();
