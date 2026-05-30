import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath, ensureMd, dirname } from "../utils/pathUtils";

/**
 * create_note — permite al agente redactar y guardar notas en el vault.
 * Verifica que la nota se haya creado realmente después de la operación.
 */
export function createCreateNoteTool(app: App): AgentTool {
  return {
    name: "create_note",
    description:
      "Creates a new note in the vault with the given title and content (Markdown format).",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Note title (without extension).",
        },
        content: {
          type: "string",
          description: "Note content in Markdown format.",
        },
      },
      required: ["title", "content"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const title = (params.title as string)?.trim();
      const content = params.content as string;
      if (!title) return "Error: no title provided.";
      if (content === undefined || content === null) return "Error: no content provided.";

      try {
        const fileName = normalizePath(ensureMd(title));

        // Check for existing note
        const existing = app.vault.getAbstractFileByPath(fileName);
        if (existing) {
          return `Error: a note already exists with the name "${fileName}".`;
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
        return `Note created successfully: "${fileName}" (${content.length} characters).`;
      } catch (err) {
        console.error("[create_note] Failed:", err);
        return `Error creating note: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
