import { AgentTool } from "../agent/ToolRegistry";
import type { SearchClient } from "../services/searchClientInterface";
import { t } from "../i18n";

/**
 * search_web — wraps the active search client (browser-use or Exa) as an agent tool.
 */
export function createWebSearchTool(webSearchClient: SearchClient): AgentTool {
  return {
    name: "search_web",
    description:
      t("tools.searchWeb.description"),
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: t("tools.searchWeb.paramQuery"),
        },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = params.query as string;
      if (!query) return t("tools.searchWeb.error.emptyQuery");

      try {
        const response = await webSearchClient.search(query);
        if (response.results.length === 0) {
          return t("tools.searchWeb.noResults", { query });
        }

        return webSearchClient.formatResultsForLLM(response.results);
      } catch (err) {
        return t("tools.searchWeb.error.generic", { error: err instanceof Error ? err.message : String(err) });
      }
    },
  };
}
