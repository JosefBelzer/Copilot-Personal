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
      "Searches vault notes using semantic search (RAG). Returns relevant fragments based on the query.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query." },
        start_date: { type: "string", description: "Optional filter: ISO start date." },
        end_date: { type: "string", description: "Optional filter: ISO end date." },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = params.query as string;
      if (!query) return "Error: empty query.";

      if (!indexOps || !settings.enableSemanticSearch) {
        return "Error: semantic search is not enabled. Enable 'enableSemanticSearch' in settings and index the vault.";
      }

      try {
        const results = await indexOps.searchSimilar(query);
        if (results.length === 0) {
          return "No relevant fragments found for the query.";
        }

        return results
          .map(
            (r: { path: string; text: string; score?: number }, i: number) =>
              `[Fragment ${i + 1}] (${r.path}, relevance: ${r.score ? (r.score * 100).toFixed(0) + "%" : "N/A"})\n${r.text}`
          )
          .join("\n\n");
      } catch (err) {
        return `Error in semantic search: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
