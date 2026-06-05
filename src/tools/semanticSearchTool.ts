import { AgentTool } from "../agent/ToolRegistry";
import { IndexOperations } from "../search/indexOperations";
import { CopilotSettings } from "../settings";
import { t } from "../i18n";

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
      t("tools.searchVaultSemantic.description"),
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: t("tools.searchVaultSemantic.paramQuery") },
        start_date: { type: "string", description: t("tools.searchVaultSemantic.paramStartDate") },
        end_date: { type: "string", description: t("tools.searchVaultSemantic.paramEndDate") },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = params.query as string;
      if (!query) return t("tools.searchVaultSemantic.error.emptyQuery");

      if (!indexOps || !settings.enableSemanticSearch) {
        return t("tools.searchVaultSemantic.error.notEnabled");
      }

      try {
        const results = await indexOps.searchSimilar(query);
        if (results.length === 0) {
          return t("tools.searchVaultSemantic.noResults");
        }

        return results
          .map(
            (r: { path: string; text: string; score?: number }, i: number) =>
              t("tools.searchVaultSemantic.fragment", { index: i + 1, path: r.path, score: r.score ? (r.score * 100).toFixed(0) + "%" : "N/A", text: r.text })
          )
          .join("\n\n");
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        return t("tools.searchVaultSemantic.error.generic", { error: errMsg });
      }
    },
  };
}
