import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath, ensureMd, basenameNoExt, normalizeGerman } from "../utils/pathUtils";
import { t } from "../i18n";

/**
 * read_note — lee el contenido completo de una nota del vault.
 * Búsqueda tolerante: auto-agrega .md, busca por basename (case-insensitive),
 * y ofrece sugerencias cuando hay múltiples coincidencias.
 */
export function createReadNoteTool(app: App): AgentTool {
  return {
    name: "read_note",
    description:
      t("tools.readNote.description"),
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: t("tools.readNote.paramPath"),
        },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      if (!raw) return t("tools.readNote.error.noPath");

      // Path traversal protection: reject directory escapes
      const normalized = normalizePath(raw);
      // Check for path traversal patterns AFTER normalization
      const segments = normalized.split("/");
      if (
        segments.some(s => s === ".." || s === ".") ||     // directory escape
        raw.startsWith("/") || raw.startsWith("\\") ||       // absolute path
        /%[2eE]{2}/i.test(raw)                              // encoded .. (%2e%2e, %2E%2E, etc.)
      ) {
        return t("tools.readNote.error.invalidPath");
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
          return `${t("tools.readNote.autoFound", { path: autoFind[0].path })}\n\n${content}`;
        }

        // If multiple matches, list them
        if (autoFind.length > 1) {
          const paths = autoFind.map(f => `  - ${f.path}`).join("\n");
          return t("tools.readNote.foundMultiple", { count: autoFind.length, name: basenameNoExt(normalized), paths });
        }

        // Partial match fallback
        const partial = app.vault.getMarkdownFiles().filter(f =>
          normalizeGerman(f.basename).includes(target)
        ).slice(0, 10);
        if (partial.length > 0) {
          const paths = partial.map(f => `  - ${f.path}`).join("\n");
          return t("tools.readNote.exactMatchNotFound", { name: basenameNoExt(normalized), paths });
        }

        return t("tools.readNote.error.notFound", { path: normalized });
      } catch (err) {
        console.error("[read_note] Failed:", err);
        const errMsg = err instanceof Error ? err.message : String(err);
        return t("tools.readNote.error.readError", { path: raw, error: errMsg });
      }
    },
  };
}
