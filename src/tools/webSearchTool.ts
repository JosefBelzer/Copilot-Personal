import { AgentTool } from "../agent/ToolRegistry";
import { WebSearchClient } from "../services/webSearchClient";

/**
 * search_web — envuelve el WebSearchClient como herramienta para el agente.
 */
export function createWebSearchTool(webSearchClient: WebSearchClient): AgentTool {
  return {
    name: "search_web",
    description:
      "Realiza una busqueda en la web usando un navegador automatizado y devuelve los resultados mas relevantes (titulo, url, snippet).",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "La consulta de busqueda web.",
        },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = params.query as string;
      if (!query) return "Error: consulta vacia.";

      try {
        const response = await webSearchClient.search(query);
        if (response.results.length === 0) {
          return `No se encontraron resultados para: "${query}".`;
        }

        return webSearchClient.formatResultsForLLM(response.results);
      } catch (err) {
        return `Error en la busqueda web: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
