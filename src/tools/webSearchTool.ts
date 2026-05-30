import { AgentTool } from "../agent/ToolRegistry";
import { WebSearchClient } from "../services/webSearchClient";

/**
 * search_web — envuelve el WebSearchClient como herramienta para el agente.
 */
export function createWebSearchTool(webSearchClient: WebSearchClient): AgentTool {
  return {
    name: "search_web",
    description:
      "Performs a web search using an automated browser and returns the most relevant results (title, url, snippet).",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The web search query.",
        },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = params.query as string;
      if (!query) return "Error: empty query.";

      try {
        const response = await webSearchClient.search(query);
        if (response.results.length === 0) {
          return `No results found for: "${query}".`;
        }

        return webSearchClient.formatResultsForLLM(response.results);
      } catch (err) {
        return `Error in web search: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
