import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath } from "../utils/pathUtils";

const TAG = "[render_pdf_pages]";

/**
 * render_pdf_pages — renders specified PDF pages as PNG images and saves them
 * in the vault for embedding with ![[page.png]] in notes.
 *
 * Uses Electron's native canvas (HTMLCanvasElement) to render pdfjs pages,
 * avoiding the need for the node-canvas native module.
 */
export function createRenderPdfPagesTool(app: App): AgentTool {
  return {
    name: "render_pdf_pages",
    description:
      "Renders specific PDF pages as PNG images and saves them in the vault. Returns exact paths (e.g. 'Resources/PDF_images/PDF_page_40.png'). IMPORTANT: use the EXACT paths returned by this tool for ![[embeds]]. Do NOT invent paths.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the PDF in the vault.",
        },
        pages: {
          type: "string",
          description: "Pages to render (e.g. '30-33', '5,8,12', '30').",
        },
        outputFolder: {
          type: "string",
          description: "Folder to save the images (optional, default: next to PDF).",
        },
        scale: {
          type: "number",
          description: "Render scale (1.0 = 72 DPI, 2.0 = 144 DPI). Default: 2.0.",
        },
      },
      required: ["path", "pages"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      const pagesSpec = (params.pages as string)?.trim();
      const outputFolder = (params.outputFolder as string)?.trim() || "";
      const scale = (params.scale as number) || 2.0;

      if (!raw) return "Error: no PDF path provided.";
      if (!pagesSpec) return "Error: no pages specified.";

      try {
        // Auto-find the PDF if the path is wrong
        let resolvedPath = normalizePath(raw);
        let exists = await app.vault.adapter.exists(resolvedPath);
        if (!exists) {
          const basename = raw.replace(/^.*[/\\]/, "").toLowerCase();
          const pdfFiles = app.vault.getFiles().filter(f =>
            f.name.toLowerCase().endsWith(".pdf") &&
            f.name.toLowerCase().includes(basename)
          );
          if (pdfFiles.length === 1) {
            resolvedPath = pdfFiles[0].path;
            exists = true;
          } else if (pdfFiles.length > 1) {
            return `Multiple PDFs match "${raw}". Specify the exact path.`;
          }
        }
        if (!exists) return `Error: "${raw}" does not exist.`;

        // Parse page range
        const pageNums = parsePageRange(pagesSpec, 9999);
        if (pageNums.length === 0) return `Error: invalid page range: "${pagesSpec}".`;

        // Determine output folder
        const pdfDir = resolvedPath.substring(0, resolvedPath.lastIndexOf("/") + 1);
        const pdfBasename = resolvedPath.split("/").pop()?.replace(/\.pdf$/i, "") || "pdf";
        const outDir = outputFolder
          ? normalizePath(outputFolder)
          : `${pdfDir}${pdfBasename}_images`;

        // Ensure output folder exists — create recursively if needed
        if (!(await app.vault.adapter.exists(outDir))) {
          try {
            // Create parent folders first
            const parts = outDir.split("/");
            let currentPath = "";
            for (const part of parts) {
              currentPath = currentPath ? `${currentPath}/${part}` : part;
              if (!(await app.vault.adapter.exists(currentPath))) {
                await app.vault.createFolder(currentPath);
              }
            }
          } catch (err) {
            return `Error: could not create output folder "${outDir}": ${err instanceof Error ? err.message : String(err)}`;
          }
        }

        // Load pdfjs
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const { WORKER_URI } = await import("./pdfWorkerUri");
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URI;

        const pdfBuffer = await app.vault.adapter.readBinary(resolvedPath);
        const uint8 = new Uint8Array(pdfBuffer);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

        const validPages = pageNums.filter(n => n >= 1 && n <= pdf.numPages);
        if (validPages.length === 0) {
          return `Error: no valid pages. The PDF has ${pdf.numPages} pages.`;
        }

        const results: string[] = [];
        for (const pageNum of validPages) {
          try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            // Create an offscreen canvas (Electron/Obsidian has full DOM)
            const canvas = document.createElement("canvas");
            console.log(`[renderPdfPages] Canvas created for page ${pageNum}: ${canvas.width}x${canvas.height}`);
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              const err = `Error: could not create canvas 2D context for page ${pageNum}.`;
              console.error(`[renderPdfPages] ${err}`);
              results.push(err);
              continue;
            }

            // pdfjs v5+ requires 'canvas' + 'canvasContext' + 'viewport'
            const renderParams: any = { canvasContext: ctx, canvas, viewport };
            try {
              await page.render(renderParams).promise;
            } catch (renderErr) {
              const err = `Error rendering page ${pageNum}: ${renderErr instanceof Error ? renderErr.message : String(renderErr)}`;
              console.error(`[renderPdfPages] ${err}`);
              results.push(`❌ ${err}`);
              continue;
            }

            // Convert canvas to PNG blob, then to ArrayBuffer
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob((b) => {
                if (b) {
                  console.log(`[renderPdfPages] Page ${pageNum}: blob OK, ${b.size} bytes`);
                  resolve(b);
                } else {
                  console.error(`[renderPdfPages] Page ${pageNum}: toBlob returned null`);
                  reject(new Error("toBlob returned null"));
                }
              }, "image/png");
            });
            const arrayBuffer = await blob.arrayBuffer();

            // Save to vault
            const fileName = `${pdfBasename}_page_${pageNum}.png`;
            const filePath = normalizePath(`${outDir}/${fileName}`);
            await app.vault.createBinary(filePath, arrayBuffer);

            results.push(`✅ ${filePath}`);
          } catch (err) {
            results.push(`❌ Page ${pageNum}: ${err instanceof Error ? err.message : String(err)}`);
          }
        }

        return `Rendered ${results.filter(r => r.startsWith("✅")).length}/${validPages.length} pages:\n${results.join("\n")}`;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`${TAG} Failed:`, msg);
        return `Error rendering PDF pages: ${msg}`;
      }
    },
  };
}

function parsePageRange(spec: string, maxPages: number): number[] {
  const pages: number[] = [];
  const parts = spec.split(",").map(s => s.trim()).filter(s => s);
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (isNaN(start) || isNaN(end)) continue;
      for (let i = Math.max(1, start); i <= Math.min(end, maxPages); i++) {
        pages.push(i);
      }
    } else {
      const num = parseInt(part);
      if (!isNaN(num) && num >= 1 && num <= maxPages) pages.push(num);
    }
  }
  return pages;
}
