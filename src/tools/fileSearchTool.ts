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
      "Busca archivos en el vault cuyo nombre coincida con un término. Devuelve las rutas de los archivos encontrados. Útil para localizar imágenes, PDFs o notas cuando no conoces la ruta exacta.",
    parameters: {
      type: "object",
      properties: {
        nameQuery: {
          type: "string",
          description:
            "Parte del nombre del archivo a buscar (ej. 'MapaPolitico', 'diagrama', 'foto.png'). No distingue mayúsculas/minúsculas.",
        },
        extension: {
          type: "string",
          description:
            "Filtrar por extensión (ej. 'png', 'pdf', 'md'). Opcional.",
        },
      },
      required: ["nameQuery"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      // Accept both nameQuery and query (model often uses "query" by mistake with native tool calling)
      const nameQuery = ((params.nameQuery || params.query || "") as string).toLowerCase();
      const extension = ((params.extension || "") as string).toLowerCase();

      if (!nameQuery) return "Error: término de búsqueda vacío.";

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
          return `No se encontraron archivos que coincidan con "${nameQuery}"${extension ? " (." + extension + ")" : ""}.`;
        }

        // Limit to 15 results
        const limited = matched.slice(0, 15);
        return limited
          .map((f, i) => `[${i + 1}] ${f.path}`)
          .join("\n") +
          (matched.length > 15 ? `\n... y ${matched.length - 15} más.` : "");
      } catch (err) {
        return `Error al buscar archivos: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
