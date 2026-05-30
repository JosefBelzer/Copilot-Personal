import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath } from "../utils/pathUtils";

const TAG = "[extract_pdf_images]";

/**
 * extract_pdf_images — extracts embedded images from PDF pages.
 * Uses unpdf (npm install unpdf) for reliable raster image extraction.
 * Falls back to full-page rendering when no raster images are found.
 */
export function createExtractPdfImagesTool(app: App): AgentTool {
  return {
    name: "extract_pdf_images",
    description:
      "Extrae imágenes JPG/PNG incrustadas de páginas de un PDF. Requiere 'unpdf' instalado (npm install unpdf). Si no hay imágenes raster (gráficos vectoriales/diagramas), renderiza la página completa como PNG. Usa render_pdf_pages si solo necesitas las páginas completas.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Ruta del PDF en el vault." },
        pages: { type: "string", description: "Páginas (ej. '49-54', '27,30')." },
        outputFolder: { type: "string", description: "Carpeta de salida (opcional)." },
      },
      required: ["path", "pages"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      const pagesSpec = (params.pages as string)?.trim();
      const outputFolder = (params.outputFolder as string)?.trim() || "";

      if (!raw || !pagesSpec) return "Error: path y pages requeridos.";

      try {
        let resolvedPath = normalizePath(raw);
        if (!(await app.vault.adapter.exists(resolvedPath))) {
          const basename = raw.replace(/^.*[/\\]/, "").toLowerCase();
          const pdfFiles = app.vault.getFiles().filter(f =>
            f.name.toLowerCase().endsWith(".pdf") && f.name.toLowerCase().includes(basename)
          );
          if (pdfFiles.length === 1) resolvedPath = pdfFiles[0].path;
          else if (pdfFiles.length > 1) return "Múltiples PDFs coinciden. Especifica ruta exacta.";
          else return `Error: "${raw}" no existe.`;
        }

        const pageNums = parsePageRange(pagesSpec, 9999);
        if (pageNums.length === 0) return `Error: rango inválido: "${pagesSpec}".`;

        const pdfDir = resolvedPath.substring(0, resolvedPath.lastIndexOf("/") + 1);
        const pdfBasename = resolvedPath.split("/").pop()?.replace(/\.pdf$/i, "") || "pdf";
        const outDir = outputFolder ? normalizePath(outputFolder) : `${pdfDir}${pdfBasename}_images`;

        if (!(await app.vault.adapter.exists(outDir))) {
          try { await app.vault.createFolder(outDir); } catch { /* ok */ }
        }

        // Load pdfjs for page rendering fallback
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const { WORKER_URI } = await import("./pdfWorkerUri");
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URI;

        const pdfBuffer = await app.vault.adapter.readBinary(resolvedPath);
        const uint8 = new Uint8Array(pdfBuffer);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

        const validPages = pageNums.filter(n => n >= 1 && n <= pdf.numPages);
        if (validPages.length === 0) return `Error: páginas fuera de rango (${pdf.numPages} total).`;

        const results: string[] = [];
        let totalExtracted = 0;

        // Try unpdf (primary — reliable raster image extraction)
        let unpdfAvailable = false;
        const pagesWithImages = new Set<number>();
        try {
          const unpdf = await import("unpdf");
          unpdfAvailable = true;
          const images = await unpdf.extractImages(await unpdf.getDocumentProxy(uint8), { pageNumbers: validPages } as any) as any[];

          for (const img of images) {
            if (!img.data || img.data.length === 0) continue;
            const ext = detectFormat(new Uint8Array(img.data));
            const pageNum = (img as any).pageNumber || (img as any).page || 0;
            const imgId = (img as any).id || totalExtracted;
            const cleanName = `fig_${pageNum}_${String(imgId).substring(0, 20)}`;
            const fileName = `${pdfBasename}_${cleanName}.${ext}`;
            const filePath = normalizePath(`${outDir}/${fileName}`);
            await app.vault.createBinary(filePath, (img.data as Uint8Array).buffer.slice(0) as ArrayBuffer);
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
            const canvas = document.createElement("canvas");
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              results.push(`❌ Página ${pageNum}: no se pudo crear canvas`);
              continue;
            }
            await page.render({ canvasContext: ctx, canvas, viewport } as any).promise;
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
            });
            const arrayBuffer = await blob.arrayBuffer();
            const fileName = `${pdfBasename}_page_${pageNum}.png`;
            const filePath = normalizePath(`${outDir}/${fileName}`);
            await app.vault.createBinary(filePath, arrayBuffer);
            results.push(`🖼️ ${filePath} (página completa)`);
            totalExtracted++;
          } catch (err) {
            results.push(`⚠️ Página ${pageNum}: falló el renderizado`);
          }
        }

        return `Extraídas ${totalExtracted} imágenes de ${validPages.length} páginas:\n${results.join("\n")}`;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`${TAG} Failed:`, msg);
        return `Error: ${msg}`;
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
