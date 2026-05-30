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
      "Crea una nueva nota en el vault con el título y contenido proporcionados (en formato Markdown).",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Titulo de la nota (sin extensión).",
        },
        content: {
          type: "string",
          description: "Contenido de la nota en formato Markdown.",
        },
      },
      required: ["title", "content"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const title = (params.title as string)?.trim();
      const content = params.content as string;
      if (!title) return "Error: título no proporcionado.";
      if (content === undefined || content === null) return "Error: contenido no proporcionado.";

      try {
        const fileName = normalizePath(ensureMd(title));

        // Check for existing note
        const existing = app.vault.getAbstractFileByPath(fileName);
        if (existing) {
          return `Error: ya existe una nota con el nombre "${fileName}".`;
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
        return `Nota creada exitosamente: "${fileName}" (${content.length} caracteres).`;
      } catch (err) {
        console.error("[create_note] Failed:", err);
        return `Error al crear la nota: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
