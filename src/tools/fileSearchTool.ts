import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizeGerman } from "../utils/pathUtils";
import { t } from "../i18n";

/**
 * find_files — busca archivos en el vault por nombre o patrón.
 * Permite al agente encontrar imágenes y otros archivos sin conocer la ruta exacta.
 */
export function createFileSearchTool(app: App): AgentTool {
  return {
    name: "find_files",
    description:
      t("tools.findFiles.description"),
    parameters: {
      type: "object",
      properties: {
        nameQuery: {
          type: "string",
          description:
            t("tools.findFiles.paramNameQuery"),
        },
        extension: {
          type: "string",
          description:
            t("tools.findFiles.paramExtension"),
        },
      },
      required: ["nameQuery"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      // Accept both nameQuery and query (model often uses "query" by mistake with native tool calling)
      const nameQuery = ((params.nameQuery || params.query || "") as string).toLowerCase();
      const extension = ((params.extension || "") as string).toLowerCase();

      if (!nameQuery) return t("tools.findFiles.error.emptyQuery");

      try {
        const allFiles = app.vault.getFiles();
        const normalizedQuery = normalizeGerman(nameQuery);
        const matched = allFiles.filter((f) => {
          const name = normalizeGerman(f.name);
          const nameMatch = name.includes(normalizedQuery);
          const extMatch = extension ? f.name.toLowerCase().endsWith("." + extension.toLowerCase()) : true;
          return nameMatch && extMatch;
        });

        if (matched.length === 0) {
          const extSuffix = extension ? " (." + extension + ")" : "";
          return t("tools.findFiles.noResults", { query: nameQuery, extension: extSuffix });
        }

        // Limit to 15 results
        const limited = matched.slice(0, 15);
        return matched.length > 15
          ? t("tools.findFiles.results", { results: limited.map((f) => f.path).join("\n"), more: matched.length - 15 })
          : limited.map((f) => f.path).join("\n");
      } catch (err) {
        return t("tools.findFiles.error.searchError", { error: err instanceof Error ? err.message : String(err) });
      }
    },
  };
}
