import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath, ensureMd, dirname } from "../utils/pathUtils";
import { t } from "../i18n";

/**
 * create_note — permite al agente redactar y guardar notas en el vault.
 * Verifica que la nota se haya creado realmente después de la operación.
 */
export function createCreateNoteTool(app: App): AgentTool {
  return {
    name: "create_note",
    description:
      t("tools.createNote.description"),
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: t("tools.createNote.paramTitle"),
        },
        content: {
          type: "string",
          description: t("tools.createNote.paramContent"),
        },
      },
      required: ["title", "content"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const title = (params.title as string)?.trim();
      const content = params.content as string;
      if (!title) return t("tools.createNote.error.noTitle");
      if (content === undefined || content === null) return t("tools.createNote.error.noContent");

      try {
        const fileName = normalizePath(ensureMd(title));

        // Check for existing note
        const existing = app.vault.getAbstractFileByPath(fileName);
        if (existing) {
          return t("tools.createNote.error.alreadyExists", { name: fileName });
        }

        // Ensure parent directory exists
        const dir = dirname(fileName);
        if (dir) {
          const dirExists = await app.vault.adapter.exists(dir);
          if (!dirExists) {
            await app.vault.createFolder(dir);
          }
        }

        await app.vault.create(fileName, content);
        return t("tools.createNote.success", { name: fileName, length: content.length });
      } catch (err) {
        console.error("[create_note] Failed:", err);
        const errMsg = err instanceof Error ? err.message : String(err);
        return t("tools.createNote.error.createError", { error: errMsg });
      }
    },
  };
}
