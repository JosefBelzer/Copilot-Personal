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
      "Lee el contenido completo de una nota del vault. Acepta el nombre de la nota con o sin extensión .md y con o sin ruta. Ej: '01_02_Qualitaet_als_Erfolgsfaktor', 'Carpeta/MiNota.md'. Ideal para consultar notas guardadas previamente.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Nombre o ruta de la nota (con o sin .md, con o sin carpeta). Ej: '01_02_Qualitaet_als_Erfolgsfaktor' o '10_Mundo/ReinosDeAcanthia.md'.",
        },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      if (!raw) return "Error: ruta no proporcionada.";

      // Path traversal protection: reject directory escapes
      const normalized = normalizePath(raw);
      // Check for path traversal patterns AFTER normalization
      const segments = normalized.split("/");
      if (
        segments.some(s => s === ".." || s === ".") ||     // directory escape
        raw.startsWith("/") || raw.startsWith("\\") ||       // absolute path
        /%[2eE]{2}/i.test(raw)                              // encoded .. (%2e%2e, %2E%2E, etc.)
      ) {
        return "Error: ruta no válida.";
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
          return `[Auto-encontrada: ${autoFind[0].path}]\n\n${content}`;
        }

        // If multiple matches, list them
        if (autoFind.length > 1) {
          const paths = autoFind.map(f => `  - ${f.path}`).join("\n");
          return `Encontradas ${autoFind.length} notas con nombre "${basenameNoExt(normalized)}". Especifica la ruta completa:\n${paths}`;
        }

        // Partial match fallback
        const partial = app.vault.getMarkdownFiles().filter(f =>
          normalizeGerman(f.basename).includes(target)
        ).slice(0, 10);
        if (partial.length > 0) {
          const paths = partial.map(f => `  - ${f.path}`).join("\n");
          return `No se encontró exactamente "${basenameNoExt(normalized)}". Notas similares:\n${paths}`;
        }

        return `Error: la nota "${normalized}" no existe en el vault.`;
      } catch (err) {
        console.error("[read_note] Failed:", err);
        return `Error al leer "${raw}": ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
