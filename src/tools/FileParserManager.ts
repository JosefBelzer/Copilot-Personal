import { TFile, Vault } from "obsidian";

export interface FileParser {
  supportedExtensions: string[];
  parseFile: (content: ArrayBuffer, fileName: string) => Promise<string>;
}

/**
 * Parses text-based files (Markdown, text, etc.)
 */
export class TextParser implements FileParser {
  supportedExtensions = ["md", "txt", "canvas", "json"];

  async parseFile(content: ArrayBuffer, fileName: string): Promise<string> {
    const decoder = new TextDecoder();
    return decoder.decode(content);
  }
}

/**
 * Parses PDF files using pdfjs-dist.
 */
export class PDFParser implements FileParser {
  supportedExtensions = ["pdf"];

  async parseFile(content: ArrayBuffer, fileName: string): Promise<string> {
    try {
      // @ts-ignore
      // eslint-disable-next-line import/no-extraneous-dependencies
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const { WORKER_URI } = await import("./pdfWorkerUri");
      if (!pdfjsLib.GlobalWorkerOptions) {
        (pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions = { workerSrc: "" };
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URI;
      const uint8Array = new Uint8Array(content);
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages && i <= 100; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => (item as { str?: string }).str ?? "")
          .join(" ");
        pages.push(pageText);
      }

      return pages.join("\n\n");
    } catch (err) {
      console.error("PDF parsing error:", err);
      throw new Error(`Failed to parse PDF: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }
}

/**
 * Handles image files by converting to base64.
 */
export class ImageParser implements FileParser {
  supportedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

  async parseFile(content: ArrayBuffer, fileName: string): Promise<string> {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "png";
    const mimeType = ext === "jpg" ? "jpeg" : ext;
    const base64 = await this.arrayBufferToBase64(content);
    return `data:image/${mimeType};base64,${base64}`;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer]);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1] ?? "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

/**
 * Manages file parsing for different file types.
 * Inspired by obsidian-copilot's FileParserManager.
 */
export class FileParserManager {
  private parsers: FileParser[] = [];
  private vault: Vault;

  constructor(vault: Vault) {
    this.vault = vault;
    this.registerParser(new TextParser());
    this.registerParser(new PDFParser());
    this.registerParser(new ImageParser());
  }

  registerParser(parser: FileParser) {
    this.parsers.push(parser);
  }

  getSupportedExtensions(): string[] {
    const exts: string[] = [];
    for (const parser of this.parsers) {
      exts.push(...parser.supportedExtensions);
    }
    return exts;
  }

  getParserForFile(fileName: string): FileParser | null {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    return this.parsers.find((p) => p.supportedExtensions.includes(ext)) ?? null;
  }

  async parseFile(file: TFile): Promise<string> {
    const content = await this.vault.readBinary(file);
    const parser = this.getParserForFile(file.name);
    if (!parser) {
      throw new Error(`No parser found for file type: ${file.extension}`);
    }
    return parser.parseFile(content, file.name);
  }

  async parseFileFromDrop(file: File): Promise<string> {
    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const parser = this.getParserForFile(file.name);
    if (!parser) {
      throw new Error(`No parser found for file type: ${file.name.split(".").pop()}`);
    }
    return parser.parseFile(arrayBuffer, file.name);
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}
