import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";

/**
 * search_vault_by_timeframe — busca notas del vault modificadas entre dos fechas.
 */
export function createTimeSearchTool(app: App): AgentTool {
  return {
    name: "search_vault_by_timeframe",
    description:
      "Busca notas del vault modificadas entre dos fechas en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss). Utíl para saber que hizo el usuario en un periodo de tiempo.",
    parameters: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "Fecha de inicio en formato ISO 8601, ej. 2026-05-01T00:00:00",
        },
        end_date: {
          type: "string",
          description: "Fecha de fin en formato ISO 8601, ej. 2026-05-10T23:59:59",
        },
      },
      required: ["start_date", "end_date"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const startDate = new Date(params.start_date as string);
      const endDate = new Date(params.end_date as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Error: fechas invalidas. Usa formato ISO 8601 (YYYY-MM-DDTHH:mm:ss).";
      }

      const files = app.vault.getMarkdownFiles();
      const matched: Array<{ path: string; title: string; snippet: string; mtime: number }> = [];

      for (const file of files) {
        const mtime = file.stat.mtime;
        if (mtime >= startDate.getTime() && mtime <= endDate.getTime()) {
          try {
            const content = await app.vault.read(file);
            const snippet = content.slice(0, 500);
            const title = file.basename;
            matched.push({ path: file.path, title, snippet, mtime });
          } catch (err) {
            console.error("[search_vault_by_timeframe] Skipping unreadable file:", err);
          }
        }
      }

      if (matched.length === 0) {
        return `No se encontraron notas modificadas entre ${params.start_date} y ${params.end_date}.`;
      }

      return matched
        .map(
          (m, i) =>
            `[${i + 1}] ${m.title} (${m.path})\nModificado: ${new Date(m.mtime).toISOString()}\nContenido: ${m.snippet}...`
        )
        .join("\n\n");
    },
  };
}
