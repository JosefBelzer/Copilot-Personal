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
      "Sobreescribe el contenido de una nota existente en el vault. Usa la ruta completa. Si la nota no existe, da error (usa create_note para notas nuevas).",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Ruta completa de la nota a modificar (ej. '10_Mundo/Reinos.md').",
        },
        content: {
          type: "string",
          description: "Nuevo contenido completo de la nota en formato Markdown.",
        },
      },
      required: ["path", "content"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const raw = (params.path as string)?.trim();
      const content = params.content as string;

      if (!raw) return "Error: ruta no proporcionada.";
      if (content === undefined || content === null) return "Error: contenido no proporcionado.";

      const path = normalizePath(raw);

      try {
        const exists = await app.vault.adapter.exists(path);
        if (!exists) {
          return `Error: la nota "${path}" no existe. Usa create_note para crear una nueva.`;
        }

        await app.vault.adapter.write(path, content);

        // Verify content was actually written
        const written = await app.vault.adapter.read(path);
        if (written !== content) {
          return `Error: La nota "${path}" se reportó como actualizada pero el contenido no coincide (esperado ${content.length} chars, leído ${written.length} chars).`;
        }

        return `Nota "${path}" actualizada correctamente (${content.length} caracteres).`;
      } catch (err) {
        console.error("[update_note] Failed:", err);
        return `Error al actualizar "${raw}": ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
