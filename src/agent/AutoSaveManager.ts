import { App } from "obsidian";
import { normalizeGerman } from "../utils/pathUtils";

/**
 * Build all common number format variants from a heading like "1.5 Auswirkungen..."
 * → ["01_05", "1_05", "1.5"]
 */
function buildNumberVariants(heading: string): string[] {
  const variants: string[] = [];
  const m = heading.match(/(\d+)[._-](\d+)(?:[._-](\d+))?/);
  if (!m) return variants;
  const [a, b, c] = [m[1], m[2], m[3] || ""];
  const padA = a.padStart(2, "0");
  const padB = b.padStart(2, "0");
  const padC = c ? c.padStart(2, "0") : "";
  variants.push(`${padA}_${padB}${padC ? "_" + padC : ""}`);
  variants.push(`${a}_${b}${c ? "_" + c : ""}`);
  variants.push(`${a}.${b}${c ? "." + c : ""}`);
  return variants;
}

/**
 * AutoSaveManager — maneja la detección y guardado automático de notas
 * que el modelo escribe en el chat en vez de usar herramientas.
 * Extraído de chatView.ts para reducir su tamaño y responsabilidades.
 */
export class AutoSaveManager {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  /**
   * Split a multi-note response into individual note sections.
   * Detects # headings that look like note titles (contain numbers like 1.4, 01_04, etc.)
   */
  splitNoteSections(text: string): Array<{ heading: string; content: string }> {
    const sections: Array<{ heading: string; content: string }> = [];
    const lines = text.split("\n");
    let currentHeading = "";
    let currentContent: string[] = [];

    for (const line of lines) {
      const isNoteHeading = /^#\s+.+/.test(line) && /\d/.test(line) && !/←|⚠️|NOTA|Auto-guardado/i.test(line);
      if (isNoteHeading && currentContent.length > 0) {
        if (currentHeading) {
          sections.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
        }
        currentHeading = line.replace(/^#+\s*/, "").trim();
        currentContent = [line];
      } else {
        currentContent.push(line);
      }
      if (!currentHeading && isNoteHeading) {
        currentHeading = line.replace(/^#+\s*/, "").trim();
      }
    }

    if (currentHeading && currentContent.length > 0) {
      sections.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
    }

    if (sections.length === 0) {
      const firstHeading = text.match(/^#\s+(.+)$/m);
      if (firstHeading) {
        sections.push({ heading: firstHeading[1].trim(), content: text.trim() });
      }
    }

    return sections;
  }

  /**
   * Validate wiki-links against vault contents. Returns names of non-existent links.
   * Only checks .md note links — image embeds (![[.png]]) are skipped.
   */
  validateWikiLinks(text: string): string[] {
    const links = text.match(/\[\[([^\]]+)\]\]/g);
    if (!links) return [];

    const allFiles = this.app.vault.getFiles() as Array<{ path: string; name: string }>;
    const invented: string[] = [];

    for (const link of links) {
      const full = link.replace(/^\[\[|\]\]$/g, "");
      const name = full.split("|")[0].trim();

      if (/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i.test(name)) continue;

      if (name.includes("/")) {
        const exists = allFiles.some(f => f.path === name || f.path === name + ".md");
        if (!exists && !invented.includes(name)) invented.push(name);
        continue;
      }

      const exists = allFiles.some(f => {
        const fileBasename = f.name.replace(/\.md$/i, "");
        return normalizeGerman(fileBasename) === normalizeGerman(name) ||
          normalizeGerman(fileBasename).startsWith(normalizeGerman(name + "_")) ||
          normalizeGerman(name).startsWith(normalizeGerman(fileBasename));
      });

      if (!exists && !invented.includes(name)) {
        invented.push(name);
      }
    }

    return invented;
  }

  /**
   * Strip invented [[links]] from text, replacing them with plain text.
   */
  stripInventedLinks(text: string, invented: string[]): string {
    let result = text;
    for (const name of invented) {
      result = result.replace(
        new RegExp(`\\[\\[${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\|[^\\]]*)?\\]\\]`, 'g'),
        name
      );
    }
    return result;
  }

  /**
   * Search for a target note file by heading name in the vault.
   * Uses number-pattern matching (e.g., "1.5" → "01_05") anchored to basename start.
   */
  findNoteByHeading(heading: string): { path: string } | null {
    const allFiles = this.app.vault.getMarkdownFiles() as unknown as Array<{ path: string; basename: string; name: string }>;
    const variants = buildNumberVariants(heading);

    let target = allFiles.find(f => {
      const norm = normalizeGerman(f.basename);
      return variants.some(v => {
        if (!norm.startsWith(v)) return false;
        const after = norm.substring(v.length);
        if (after === "") return true;
        if (after.startsWith("_") && !/^_\d/.test(after)) return true;
        return false;
      });
    });

    if (!target) {
      const candidates = allFiles.filter(f =>
        variants.some(v => normalizeGerman(f.basename).includes(v))
      );
      if (candidates.length === 1) target = candidates[0];
    }

    if (!target) {
      const wordMatch = heading.match(/\b([A-Za-zäöüß]{6,})\b/g);
      const keywords = wordMatch?.filter(w => !/^(Kapitel|und|der|die|das|als|des|von|mit|für|auf|aus|bei|nach|seit|zu|durch|gegen|ohne|um|entlang)$/i.test(w)) || [];
      for (const kw of keywords.slice(0, 3)) {
        const match = allFiles.find(f => normalizeGerman(f.basename).includes(normalizeGerman(kw)));
        if (match) { target = match; break; }
      }
    }

    return target || null;
  }

  /**
   * Auto-save a single section to its corresponding note file.
   */
  async saveSection(section: { heading: string; content: string }, targetPath: string): Promise<string> {
    try {
      await this.app.vault.adapter.write(targetPath, section.content);
      return `✅ ${targetPath}`;
    } catch (err) {
      return `❌ ${targetPath}: ${err}`;
    }
  }
}
