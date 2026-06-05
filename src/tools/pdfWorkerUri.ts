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

interface ObsidianAppGlobal {
  app?: {
    plugins?: {
      getPlugin?: (id: string) => { manifest?: { dir?: string } } | undefined;
    };
  };
}

export const WORKER_URI = (() => {
  // Try local worker file (copied to plugin root during build)
  try {
    const plugin = (window as Record<string, any>).app?.plugins?.getPlugin?.("copilot-personal");
    if (plugin?.manifest?.dir) {
      return `${plugin.manifest.dir}/pdf.worker.min.mjs`;
    }
  } catch { /* not in Obsidian context */ }

  // Fallback: unpkg — mirrors npm registry directly, always matches installed version
  return "https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs";
})();
