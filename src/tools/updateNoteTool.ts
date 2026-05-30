import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizePath } from "../utils/pathUtils";

/**
 * update_note — sobreescribe o modifica una nota existente.
 * Verifica que el contenido se haya escrito realmente después de la operación.
 */
export function createUpdateNoteTool(app: App): AgentTool {
  return {
    name: "update_note",
    description:
      "Overwrites the content of an existing note in the vault. Use the full path. If the note does not exist, it returns an error (use create_note for new notes).",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Full path of the note to modify (e.g. '10_Mundo/Reinos.md').",
        },
        content: {
          type: "string",
          description: "New full content of the note in Markdown format.",
        },
      },
      required: ["path", "content"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      const content = params.content as string;

      if (!raw) return "Error: no path provided.";
      if (content === undefined || content === null) return "Error: no content provided.";

      const path = normalizePath(raw);

      try {
        const exists = await app.vault.adapter.exists(path);
        if (!exists) {
          return `Error: the note "${path}" does not exist. Use create_note to create a new one.`;
        }

        await app.vault.adapter.write(path, content);

        // Verify content was actually written
        const written = await app.vault.adapter.read(path);
        if (written !== content) {
          return `Error: The note "${path}" was reported as updated but the content does not match (expected ${content.length} chars, read ${written.length} chars).`;
        }

        return `Note "${path}" updated successfully (${content.length} characters).`;
      } catch (err) {
        console.error("[update_note] Failed:", err);
        return `Error updating "${raw}": ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
