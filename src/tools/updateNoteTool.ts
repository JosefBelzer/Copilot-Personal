import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath } from "../utils/pathUtils";
import { t } from "../i18n";

/**
 * update_note — sobreescribe o modifica una nota existente.
 * Verifica que el contenido se haya escrito realmente después de la operación.
 */
export function createUpdateNoteTool(app: App): AgentTool {
  return {
    name: "update_note",
    description:
      t("tools.updateNote.description"),
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: t("tools.updateNote.paramPath"),
        },
        content: {
          type: "string",
          description: t("tools.updateNote.paramContent"),
        },
      },
      required: ["path", "content"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      const content = params.content as string;

      if (!raw) return t("tools.updateNote.error.noPath");
      if (content === undefined || content === null) return t("tools.updateNote.error.noContent");

      const path = normalizePath(raw);

      try {
        const exists = await app.vault.adapter.exists(path);
        if (!exists) {
          return t("tools.updateNote.error.notFound", { path });
        }

        await app.vault.adapter.write(path, content);

        // Verify content was actually written
        const written = await app.vault.adapter.read(path);
        if (written !== content) {
          return t("tools.updateNote.error.mismatch", { path, expected: content.length, actual: written.length });
        }

        return t("tools.updateNote.success", { path, length: content.length });
      } catch (err) {
        console.error("[update_note] Failed:", err);
        return t("tools.updateNote.error.updateError", { path: raw, error: err instanceof Error ? err.message : String(err) });
      }
    },
  };
}
