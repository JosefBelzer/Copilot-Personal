import { AgentTool } from "../agent/ToolRegistry";
import { IndexOperations } from "../search/indexOperations";
import { CopilotSettings } from "../settings";

/**
 * search_vault_semantic — expone la búsqueda semántica del vault como herramienta.
 */
export function createSemanticSearchTool(
  indexOps: IndexOperations | null,
  settings: CopilotSettings
): AgentTool {
  return {
    name: "search_vault_semantic",
    description:
      "Busca información en las notas del vault usando búsqueda semántica (RAG). Devuelve fragmentos relevantes segun la consulta.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "La consulta de búsqueda." },
        start_date: { type: "string", description: "Filtro opcional: fecha inicio ISO." },
        end_date: { type: "string", description: "Filtro opcional: fecha fin ISO." },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = params.query as string;
      if (!query) return "Error: consulta vacia.";

      if (!indexOps || !settings.enableSemanticSearch) {
        return "Error: la búsqueda semántica no esta habilitada. Habilita 'enableSemanticSearch' en la configuracion e indexa el vault.";
      }

      try {
        const results = await indexOps.searchSimilar(query);
        if (results.length === 0) {
          return "No se encontraron fragmentos relevantes para la consulta.";
        }

        return results
          .map(
            (r: { path: string; text: string; score?: number }, i: number) =>
              `[Fragmento ${i + 1}] (${r.path}, relevancia: ${r.score ? (r.score * 100).toFixed(0) + "%" : "N/A"})\n${r.text}`
          )
          .join("\n\n");
      } catch (err) {
        return `Error en la búsqueda semántica: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
