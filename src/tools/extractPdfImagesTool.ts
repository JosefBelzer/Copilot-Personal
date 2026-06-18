import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath } from "../utils/pathUtils";
import { t } from "../i18n";
import { getActiveDocument } from "../utils/domUtils";

const TAG = "[extract_pdf_images]";

interface UnpdfImage {
  data: Uint8Array;
  pageNumber?: number;
  page?: number;
  id?: string;
}

/**
 * extract_pdf_images — extracts embedded images from PDF pages.
 * Uses unpdf (npm install unpdf) for reliable raster image extraction.
 * Falls back to full-page rendering when no raster images are found.
 */
export function createExtractPdfImagesTool(app: App): AgentTool {
  return {
    name: "extract_pdf_images",
    description:
      t("tools.extractPdfImages.description"),
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: t("tools.extractPdfImages.paramPath") },
        pages: { type: "string", description: t("tools.extractPdfImages.paramPages") },
        outputFolder: { type: "string", description: t("tools.extractPdfImages.paramOutputFolder") },
      },
      required: ["path", "pages"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      const pagesSpec = (params.pages as string)?.trim();
      const outputFolder = (params.outputFolder as string)?.trim() || "";

      if (!raw || !pagesSpec) return t("tools.extractPdfImages.error.pathAndPages");

      try {
        let resolvedPath = normalizePath(raw);
        if (!(await app.vault.adapter.exists(resolvedPath))) {
          const basename = raw.replace(/^.*[/\\]/, "").toLowerCase();
          const pdfFiles = app.vault.getFiles().filter(f =>
            f.name.toLowerCase().endsWith(".pdf") && f.name.toLowerCase().includes(basename)
          );
          if (pdfFiles.length === 1) resolvedPath = pdfFiles[0].path;
          else if (pdfFiles.length > 1) return t("tools.extractPdfImages.multiplePdfs");
          else return t("tools.extractPdfImages.error.notFound", { path: raw });
        }

        const pageNums = parsePageRange(pagesSpec, 9999);
        if (pageNums.length === 0) return t("tools.extractPdfImages.error.invalidRange", { range: pagesSpec });

        const pdfDir = resolvedPath.substring(0, resolvedPath.lastIndexOf("/") + 1);
        const pdfBasename = resolvedPath.split("/").pop()?.replace(/\.pdf$/i, "") || "pdf";
        const outDir = outputFolder ? normalizePath(outputFolder) : `${pdfDir}${pdfBasename}_images`;

        if (!(await app.vault.adapter.exists(outDir))) {
          try { await app.vault.createFolder(outDir); } catch { /* ok */ }
        }

        // Load pdfjs for page rendering fallback
        // eslint-disable-next-line import/no-extraneous-dependencies
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const { WORKER_URI } = await import("./pdfWorkerUri");
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URI;

        const pdfBuffer = await app.vault.adapter.readBinary(resolvedPath);
        const uint8 = new Uint8Array(pdfBuffer);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

        const validPages = pageNums.filter(n => n >= 1 && n <= pdf.numPages);
        if (validPages.length === 0) return t("tools.extractPdfImages.error.outOfRange", { pages: pdf.numPages });

        const results: string[] = [];
        let totalExtracted = 0;

        // Try unpdf (primary — reliable raster image extraction)
        let unpdfAvailable = false;
        const pagesWithImages = new Set<number>();
        try {
          // eslint-disable-next-line import/no-extraneous-dependencies
          const unpdf = await import("unpdf");
          unpdfAvailable = true;
          const docProxy = await unpdf.getDocumentProxy(uint8);
          const extractImagesFn = unpdf.extractImages as unknown as (
            doc: unknown,
            options: { pageNumbers?: number[] }
          ) => Promise<UnpdfImage[]>;
          const images = await extractImagesFn(docProxy, { pageNumbers: validPages });

          for (const img of images) {
            if (!img.data || img.data.length === 0) continue;
            const ext = detectFormat(img.data);
            const pageNum = img.pageNumber ?? img.page ?? 0;
            const imgId = img.id ?? String(totalExtracted);
            const cleanName = `fig_${pageNum}_${String(imgId).substring(0, 20)}`;
            const fileName = `${pdfBasename}_${cleanName}.${ext}`;
            const filePath = normalizePath(`${outDir}/${fileName}`);
            await app.vault.createBinary(filePath, img.data.buffer as ArrayBuffer);
            results.push(`✅ ${filePath}`);
            totalExtracted++;
            if (pageNum) pagesWithImages.add(pageNum);
          }
        } catch {
          unpdfAvailable = false;
        }

        if (!unpdfAvailable) {
          console.warn(`${TAG} unpdf not installed. Run: npm install unpdf. Using full-page rendering fallback.`);
        }

        // Full-page rendering fallback for pages without raster images
        for (const pageNum of validPages) {
          if (pagesWithImages.has(pageNum)) continue; // already extracted
          try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = getActiveDocument().createElement("canvas");
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              results.push(t("tools.extractPdfImages.error.canvas", { page: pageNum }));
              continue;
            }
            await page.render({
              canvasContext: ctx,
              canvas,
              viewport,
            } as unknown as Parameters<typeof page.render>[0]).promise;
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
            });
            const arrayBuffer = await blob.arrayBuffer();
            const fileName = `${pdfBasename}_page_${pageNum}.png`;
            const filePath = normalizePath(`${outDir}/${fileName}`);
            await app.vault.createBinary(filePath, arrayBuffer);
            results.push(t("tools.extractPdfImages.fullPage", { path: filePath }));
            totalExtracted++;
          } catch {
            results.push(t("tools.extractPdfImages.warnRenderFailed", { page: pageNum }));
          }
        }

        return t("tools.extractPdfImages.result", { count: totalExtracted, pages: validPages.length, results: results.join("\n") });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`${TAG} Failed:`, msg);
        return t("tools.extractPdfImages.error.generic", { error: msg });
      }
    },
  };
}

function detectFormat(data: Uint8Array): string {
  if (data[0] === 0xFF && data[1] === 0xD8) return "jpg";
  if (data[0] === 0x89 && data[1] === 0x50) return "png";
  if (data[0] === 0x47 && data[1] === 0x49) return "gif";
  if (data[0] === 0x52 && data[1] === 0x49) return "webp";
  return "png";
}

function parsePageRange(spec: string, maxPages: number): number[] {
  const pages: number[] = [];
  for (const part of spec.split(",").map(s => s.trim()).filter(s => s)) {
    if (part.includes("-")) {
      const [s, e] = part.split("-").map(n => parseInt(n));
      if (!isNaN(s) && !isNaN(e)) {
        for (let i = Math.max(1, s); i <= Math.min(e, maxPages); i++) pages.push(i);
      }
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= 1 && n <= maxPages) pages.push(n);
    }
  }
  return pages;
}
