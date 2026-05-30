import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";

export function createListNotesTool(app: App): AgentTool {
  return {
    name: "list_notes",
    description: "Lista las notas en una carpeta del vault (o la raíz si no se especifica).",
    parameters: {
      type: "object",
      properties: {
        folder: { type: "string", description: "Carpeta a listar (opcional). Si no se especifica, lista la raíz." },
      },
      required: [],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const folder = (params.folder as string || "").toLowerCase();
      const files = app.vault.getMarkdownFiles()
        .filter(f => !folder || f.path.toLowerCase().startsWith(folder))
        .slice(0, 50);
      if (files.length === 0) return "No se encontraron notas.";
      return files.map((f, i) => `[${i + 1}] ${f.path}`).join("\n");
    },
  };
}

export function createFulltextSearchTool(app: App): AgentTool {
  return {
    name: "search_vault_fulltext",
    description: "Busca texto exacto en todas las notas del vault (más rápido que la búsqueda semántica).",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Texto a buscar." },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = (params.query as string || "").toLowerCase();
      if (!query) return "Error: consulta vacía.";
      const files = app.vault.getMarkdownFiles();
      const matches: string[] = [];
      const MAX_SCAN = 500;
      const BATCH = 20;

      for (let i = 0; i < Math.min(files.length, MAX_SCAN); i += BATCH) {
        const batch = files.slice(i, i + BATCH);
        const results = await Promise.allSettled(batch.map(f => app.vault.read(f)));
        for (let j = 0; j < results.length; j++) {
          const r = results[j];
          if (r.status === "fulfilled" && r.value.toLowerCase().includes(query)) {
            matches.push(`${batch[j].path}`);
            if (matches.length >= 20) break;
          }
        }
        if (matches.length >= 20) break;
      }
      if (matches.length === 0) return `No se encontró "${query}" en ninguna nota.`;
      return matches.map((m, i) => `[${i + 1}] ${m}`).join("\n");
    },
  };
}

export function createVaultStatsTool(app: App): AgentTool {
  return {
    name: "get_vault_stats",
    description: "Devuelve estadísticas del vault: número de notas, tamaño total, carpetas.",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async (): Promise<string> => {
      const files = app.vault.getMarkdownFiles();
      const folders = new Set<string>();
      let totalSize = 0;
      for (const f of files) {
        const dir = f.path.includes("/") ? f.path.substring(0, f.path.lastIndexOf("/")) : "/";
        folders.add(dir);
        totalSize += (f as any).stat?.size ?? 0;
      }
      const estimatedChars = Math.round(totalSize * 0.7); // approximate for UTF-8 overhead
      return `Notas: ${files.length}\nCarpetas: ${folders.size}\nTamaño total: ${(totalSize / 1024).toFixed(0)} KB\nTokens estimados: ${Math.ceil(estimatedChars / 4).toLocaleString()}`;
    },
  };
}

export function createGetActiveFileTool(app: App): AgentTool {
  return {
    name: "get_active_file",
    description: "Devuelve el contenido del archivo actualmente abierto en el editor.",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async (): Promise<string> => {
      const file = app.workspace.getActiveFile();
      if (!file) return "No hay ningún archivo abierto.";
      try {
        const content = await app.vault.read(file);
        return `[${file.path}]\n\n${content}`;
      } catch (err) {
        return `Error: ${err}`;
      }
    },
  };
}

export function createGetFrontmatterTool(app: App): AgentTool {
  return {
    name: "get_frontmatter",
    description: "Extrae el frontmatter (metadatos YAML) de una nota.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Ruta de la nota." },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const path = params.path as string;
      const file = app.vault.getAbstractFileByPath(path);
      if (!file) return `Error: "${path}" no existe.`;
      try {
        const content = await app.vault.read(file as any);
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fmMatch) return "Sin frontmatter.";
        return fmMatch[1];
      } catch (err) {
        return `Error: ${err}`;
      }
    },
  };
}
