import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";

export function createListNotesTool(app: App): AgentTool {
  return {
    name: "list_notes",
    description: "Lists notes in a vault folder (or root if not specified).",
    parameters: {
      type: "object",
      properties: {
        folder: { type: "string", description: "Folder to list (optional). If not specified, lists root." },
      },
      required: [],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const folder = (params.folder as string || "").toLowerCase();
      const files = app.vault.getMarkdownFiles()
        .filter(f => !folder || f.path.toLowerCase().startsWith(folder))
        .slice(0, 50);
      if (files.length === 0) return "No notes found.";
      return files.map((f, i) => `[${i + 1}] ${f.path}`).join("\n");
    },
  };
}

export function createFulltextSearchTool(app: App): AgentTool {
  return {
    name: "search_vault_fulltext",
    description: "Searches exact text across all vault notes (faster than semantic search).",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Text to search." },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = (params.query as string || "").toLowerCase();
      if (!query) return "Error: empty query.";
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
      if (matches.length === 0) return `Did not find "${query}" in any note.`;
      return matches.map((m, i) => `[${i + 1}] ${m}`).join("\n");
    },
  };
}

export function createVaultStatsTool(app: App): AgentTool {
  return {
    name: "get_vault_stats",
    description: "Returns vault statistics: number of notes, total size, folders.",
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
      return `Notes: ${files.length}\nFolders: ${folders.size}\nTotal size: ${(totalSize / 1024).toFixed(0)} KB\nEstimated tokens: ${Math.ceil(estimatedChars / 4).toLocaleString()}`;
    },
  };
}

export function createGetActiveFileTool(app: App): AgentTool {
  return {
    name: "get_active_file",
    description: "Returns the content of the file currently open in the editor.",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async (): Promise<string> => {
      const file = app.workspace.getActiveFile();
      if (!file) return "No file is currently open.";
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
    description: "Extracts the frontmatter (YAML metadata) from a note.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path to the note." },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const path = params.path as string;
      const file = app.vault.getAbstractFileByPath(path);
      if (!file) return `Error: "${path}" does not exist.`;
      try {
        const content = await app.vault.read(file as any);
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fmMatch) return "No frontmatter.";
        return fmMatch[1];
      } catch (err) {
        return `Error: ${err}`;
      }
    },
  };
}
