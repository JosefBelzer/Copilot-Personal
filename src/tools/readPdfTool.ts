import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { WORKER_URI } from "./pdfWorkerUri";
import { t } from "../i18n";

export function createReadPdfTool(app: App): AgentTool {
  return {
    name: "read_pdf",
    description:
      t("tools.readPdf.description"),
    customPromptInstructions:
      t("tools.readPdf.customInstructions"),
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: t("tools.readPdf.paramPath") },
        tocOnly: { type: "boolean", description: t("tools.readPdf.paramTocOnly") },
        pagesOnly: { type: "string", description: t("tools.readPdf.paramPagesOnly") },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const path = (params.path as string)?.trim();
      if (!path) return t("tools.readPdf.error.noPath");

      try {
        let resolvedPath = path;
        let exists = false;
        try {
          exists = await app.vault.adapter.exists(resolvedPath);
        } catch {
          // adapter.exists may throw ENOENT instead of returning false
          exists = false;
        }

        // Auto-find if the model guessed the wrong path (e.g., prepended a folder)
        if (!exists) {
          const basename = path.replace(/^.*[/\\]/, "").toLowerCase();
          const allFiles = app.vault.getFiles();
          console.log(`[readPdfTool] Auto-find: searching for "${basename}" in ${allFiles.length} vault files`);
          const pdfFiles = allFiles.filter(f =>
            f.name.toLowerCase().endsWith(".pdf") &&
            f.name.toLowerCase().includes(basename.replace(/%[0-9A-F]{2}/gi, ""))
          );
          console.log(`[readPdfTool] Auto-find: found ${pdfFiles.length} PDFs matching "${basename}"`);
          if (pdfFiles.length === 1) {
            resolvedPath = pdfFiles[0].path;
            exists = true;
          } else if (pdfFiles.length > 1) {
            const paths = pdfFiles.map(f => `  - ${f.path}`).join("\n");
            return t("tools.readPdf.multiplePdfs", { path, paths });
          }
        }

        if (!exists) return t("tools.readPdf.error.notFound", { path });

        const arrayBuffer = await app.vault.adapter.readBinary(resolvedPath);
        const uint8 = new Uint8Array(arrayBuffer);

        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        if (!pdfjsLib.GlobalWorkerOptions) (pdfjsLib as any).GlobalWorkerOptions = {};
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URI;

        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

        const pagesOnly = params.pagesOnly as string | undefined;
        const tocOnly = params.tocOnly as boolean;

        // Determine page range
        let pageRange: number[];
        if (pagesOnly) {
          pageRange = parsePageRange(pagesOnly, pdf.numPages);
        } else if (tocOnly) {
          // TOC: read first 10 pages plus scan for TOC markers
          pageRange = [];
          for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) pageRange.push(i);
        } else if (pdf.numPages <= 20) {
          // Small PDF: read entirely
          pageRange = [];
          for (let i = 1; i <= pdf.numPages; i++) pageRange.push(i);
        } else {
          // Large PDF without pagesOnly → force the model to specify
          return t("tools.readPdf.tooLarge", { pages: pdf.numPages });
        }

        // Extract text with column awareness and header/footer filtering
        const allPages: Array<{ num: number; text: string }> = [];
        for (const i of pageRange) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          const { width: pw, height: ph } = page.getViewport({ scale: 1 });
          const txt = extractPageText(tc.items, pw, ph);
          if (txt) allPages.push({ num: i, text: txt });
        }
        if (allPages.length === 0) return t("tools.readPdf.noText");

        // Detect TRUE TOC pages — only pages that are clearly a table of contents.
        // Uses multiple signals: heading words + dot-leader pattern (e.g. "Einleitung......42")
        // or dense section-number lists. Avoids the old broken heuristic that flagged
        // any page with >3 numbers as TOC (which included all academic text).
        const tocPages: typeof allPages = [];
        const contentPages: typeof allPages = [];
        for (const p of allPages) {
          if (isTOClike(p.text)) {
            tocPages.push(p);
          } else {
            contentPages.push(p);
          }
        }

        // If tocOnly, return just the TOC
        if (tocOnly && tocPages.length > 0) {
          let out = `${t("tools.readPdf.tocHeader", { pages: pdf.numPages })}\n\n`;
          for (const p of tocPages) out += `${p.text}\n\n`;
          return out;
        }

        // Full read: TOC first, then content. When a specific page range was requested
        // (pagesOnly), skip the TOC/Content split — just show pages as-is since the
        // user explicitly asked for those pages (they are the content, not TOC).
        if (pagesOnly) {
          let result = t("tools.readPdf.pageHeader", { spec: pagesOnly, total: pdf.numPages }) + "\n\n";
          for (const p of allPages) {
            result += t("tools.readPdf.pageLabel", { num: p.num }) + `\n${p.text.substring(0, 1200)}\n\n`;
          }
          return result;
        }

        let result = t("tools.readPdf.totalPages", { total: pdf.numPages }) + "\n\n";
        if (tocPages.length > 0) {
          result += t("tools.readPdf.tocSeparator") + "\n\n";
          for (const p of tocPages) result += `${p.text}\n\n`;
          result += t("tools.readPdf.contentSeparator") + "\n\n";
        }
        for (const p of contentPages) {
          result += t("tools.readPdf.pageLabel", { num: p.num }) + `\n${p.text.substring(0, 1200)}\n\n`;
        }

        if (!pagesOnly && !tocOnly && pdf.numPages > 500) {
          result += t("tools.readPdf.truncationNotice", { pages: pdf.numPages });
        }

        return result;
      } catch (err) {
        return t("tools.readPdf.error.generic", { error: err instanceof Error ? err.message : String(err) });
      }
    },
  };
}

/**
 * Extracts text from PDF text items with column detection and header/footer filtering.
 * - Detects multi-column layouts by clustering x-coordinates
 * - Filters out headers (top 8%) and footers (bottom 8%) of the page
 * - Filters out isolated page numbers at the bottom
 * - Outputs in reading order: within each column, top-to-bottom; columns left-to-right
 */
function extractPageText(items: any[], pageW: number, pageH: number): string {
  if (!items || items.length === 0) return "";

  const minY = pageH * 0.08;   // top 8% = header zone
  const maxY = pageH * 0.92;   // bottom 8% = footer zone

  // Parse items with coordinates
  interface PosItem {
    str: string;
    x: number;
    y: number;
  }
  const posItems: PosItem[] = [];
  for (const item of items) {
    const str = (item.str ?? "").trim();
    if (!str) continue;
    // transform = [scaleX, skewX, skewY, scaleY, translateX, translateY]
    const x = item.transform[4] ?? 0;
    const y = item.transform[5] ?? 0;

    // Filter headers/footers
    if (y < minY || y > maxY) continue;

    // Filter isolated page numbers (single 1-4 digit number at the bottom)
    if (y > pageH * 0.85 && /^\d{1,4}$/.test(str)) continue;

    posItems.push({ str, x, y });
  }

  if (posItems.length === 0) return "";

  // Column detection: cluster x-coordinates into groups
  const xValues = posItems.map(it => it.x);
  const columns = clusterColumns(xValues, pageW);

  if (columns.length <= 1) {
    // Single column: sort top-to-bottom, left-to-right
    posItems.sort((a, b) => b.y - a.y || a.x - b.x); // y is bottom-to-top in PDF coords
    return posItems.map(it => it.str).join(" ").replace(/\s+/g, " ").trim();
  }

  // Multi-column: process each column separately
  const results: string[] = [];
  for (const col of columns) {
    const colItems = posItems.filter(it => it.x >= col.min && it.x <= col.max);
    colItems.sort((a, b) => b.y - a.y || a.x - b.x);
    const colText = colItems.map(it => it.str).join(" ").replace(/\s+/g, " ").trim();
    if (colText) results.push(colText);
  }

  return results.join("\n\n");
}

/**
 * Cluster x-coordinates into column groups.
 * Returns array of {min, max} ranges for each detected column (left-to-right).
 */
function clusterColumns(xValues: number[], pageW: number): Array<{ min: number; max: number }> {
  if (xValues.length < 2) return [];
  // Dynamic thresholds based on page width
  const minGap = Math.max(10, pageW * 0.02);       // 2% of page width
  const separationGap = Math.max(40, pageW * 0.05);  // 5% of page width
  const sorted = [...xValues].sort((a, b) => a - b);
  const clusters: number[][] = [];
  let current: number[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - current[current.length - 1] < minGap) {
      current.push(sorted[i]);
    } else {
      // Check if gap is wide enough for a new column (> pageW / 5)
      if (sorted[i] - current[current.length - 1] > separationGap) {
        clusters.push(current);
        current = [sorted[i]];
      } else {
        current.push(sorted[i]);
      }
    }
  }
  clusters.push(current);

  // Only keep clusters with enough items (at least 3)
  const significant = clusters.filter(c => c.length >= 3);
  if (significant.length <= 1) return [];

  return significant.map(c => ({
    min: Math.min(...c) - 5,
    max: Math.max(...c) + 5,
  }));
}

/**
 * Returns true if a page looks like a table of contents rather than content.
 * Uses 3 signals (all must match for a positive identification):
 *   1. Contains a TOC heading word (Inhalt, Contents, Índice, etc.)
 *   2. Has dot-leader patterns (e.g. "Begriff......42") OR section-number lists
 *   3. Has at least 10 digit sequences (TOC pages are dense with page numbers)
 *
 * Pages that fail any of these signals are treated as normal content.
 * This replaces the old broken heuristic that flagged ANY page with >3 numbers.
 */
function isTOClike(text: string): boolean {
  if (!text) return false;

  const lower = text.toLowerCase();

  // Signal 1: heading keywords
  const hasTOCHeading =
    lower.includes("inhalt") ||
    lower.includes("contents") ||
    lower.includes("índice") ||
    /^\s*(vorwort|preface|introduction|einleitung|table\s+of\s+contents|inhaltsverzeichnis|inhaltsübersicht)/i.test(text);

  // Signal 2: dot-leader patterns (e.g. "Einleitung......42" or "Einleitung … 42")
  const hasDotLeaders =
    /\.{3,}\s*\d+/.test(text) ||       // "......42"
    /[\u2026\u2022\u25CF]\s*\d+/.test(text) ||  // "… 42" or bullet+number
    /\d+\s*\.{3,}/.test(text);          // "42......"

  // Signal 3: dense section-number + page-number patterns
  // True TOC pages have many short number runs (page numbers), not just section numbers
  const numberCount = (text.match(/\d+/g)?.length ?? 0);
  const isDenseNumbers = numberCount >= 10;

  // A page is TOC-like if ALL of: has heading OR dot-leaders, AND is dense with numbers
  return (hasTOCHeading || hasDotLeaders) && isDenseNumbers;
}

function parsePageRange(spec: string, maxPages: number): number[] {
  const pages = new Set<number>();
  for (const part of spec.split(",")) {
    const t = part.trim();
    if (t.includes("-")) {
      const [a, b] = t.split("-").map(Number);
      if (!isNaN(a) && !isNaN(b)) for (let i = Math.max(1, a); i <= Math.min(b, maxPages); i++) pages.add(i);
    } else {
      const n = Number(t);
      if (!isNaN(n) && n >= 1 && n <= maxPages) pages.add(n);
    }
  }
  return [...pages].sort((a, b) => a - b);
}
