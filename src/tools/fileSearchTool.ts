import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { normalizeGerman } from "../utils/pathUtils";

/**
 * find_files — busca archivos en el vault por nombre o patrón.
 * Permite al agente encontrar imágenes y otros archivos sin conocer la ruta exacta.
 */
export function createFileSearchTool(app: App): AgentTool {
  return {
    name: "find_files",
    description:
      "Searches files in the vault by name pattern. Returns paths of matching files. Useful for finding images, PDFs or notes when you don't know the exact path.",
    parameters: {
      type: "object",
      properties: {
        nameQuery: {
          type: "string",
          description:
            "Part of the file name to search for (e.g. 'MapaPolitico', 'diagram', 'photo.png'). Case-insensitive.",
        },
        extension: {
          type: "string",
          description:
            "Filter by extension (e.g. 'png', 'pdf', 'md'). Optional.",
        },
      },
      required: ["nameQuery"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      // Accept both nameQuery and query (model often uses "query" by mistake with native tool calling)
      const nameQuery = ((params.nameQuery || params.query || "") as string).toLowerCase();
      const extension = ((params.extension || "") as string).toLowerCase();

      if (!nameQuery) return "Error: empty search term.";

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
          return `No files found matching "${nameQuery}"${extension ? " (." + extension + ")" : ""}.`;
        }

        // Limit to 15 results
        const limited = matched.slice(0, 15);
        return limited
          .map((f, i) => `[${i + 1}] ${f.path}`)
          .join("\n") +
          (matched.length > 15 ? `\n... and ${matched.length - 15} more.` : "");
      } catch (err) {
        return `Error searching files: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
