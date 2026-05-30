import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath, ensureMd, basenameNoExt, normalizeGerman } from "../utils/pathUtils";

/**
 * read_note — lee el contenido completo de una nota del vault.
 * Búsqueda tolerante: auto-agrega .md, busca por basename (case-insensitive),
 * y ofrece sugerencias cuando hay múltiples coincidencias.
 */
export function createReadNoteTool(app: App): AgentTool {
  return {
    name: "read_note",
    description:
      "Reads the full content of a note from the vault. Accepts note name with or without .md extension and with or without path. E.g. '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. Ideal for consulting previously saved notes.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Note name or path (with or without .md, with or without folder). E.g. '01_02_Qualitaet_als_Erfolgsfaktor' or '10_Mundo/ReinosDeAcanthia.md'.",
        },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      if (!raw) return "Error: no path provided.";

      // Path traversal protection: reject directory escapes
      const normalized = normalizePath(raw);
      // Check for path traversal patterns AFTER normalization
      const segments = normalized.split("/");
      if (
        segments.some(s => s === ".." || s === ".") ||     // directory escape
        raw.startsWith("/") || raw.startsWith("\\") ||       // absolute path
        /%[2eE]{2}/i.test(raw)                              // encoded .. (%2e%2e, %2E%2E, etc.)
      ) {
        return "Error: invalid path.";
      }

      try {
        const normalized = normalizePath(raw);

        // Try exact path first (with and without .md)
        if (await app.vault.adapter.exists(normalized)) {
          return await app.vault.adapter.read(normalized);
        }
        const withMd = ensureMd(normalized);
        if (withMd !== normalized && await app.vault.adapter.exists(withMd)) {
          return await app.vault.adapter.read(withMd);
        }

        // Auto-find by basename (handles model guessing wrong folder)
        const target = normalizeGerman(basenameNoExt(normalized));
        const autoFind = app.vault.getMarkdownFiles().filter(f =>
          normalizeGerman(f.basename) === target
        );
        if (autoFind.length === 1) {
          const content = await app.vault.read(autoFind[0]);
          return `[Auto-found: ${autoFind[0].path}]\n\n${content}`;
        }

        // If multiple matches, list them
        if (autoFind.length > 1) {
          const paths = autoFind.map(f => `  - ${f.path}`).join("\n");
          return `Found ${autoFind.length} notes with name "${basenameNoExt(normalized)}". Specify the full path:\n${paths}`;
        }

        // Partial match fallback
        const partial = app.vault.getMarkdownFiles().filter(f =>
          normalizeGerman(f.basename).includes(target)
        ).slice(0, 10);
        if (partial.length > 0) {
          const paths = partial.map(f => `  - ${f.path}`).join("\n");
          return `Exact match not found for "${basenameNoExt(normalized)}". Similar notes:\n${paths}`;
        }

        return `Error: the note "${normalized}" does not exist in the vault.`;
      } catch (err) {
        console.error("[read_note] Failed:", err);
        return `Error reading "${raw}": ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
