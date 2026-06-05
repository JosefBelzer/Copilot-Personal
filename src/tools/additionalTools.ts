import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { t } from "../i18n";

export function createListNotesTool(app: App): AgentTool {
  return {
    name: "list_notes",
    description: t("tools.listNotes.description"),
    parameters: {
      type: "object",
      properties: {
        folder: { type: "string", description: t("tools.listNotes.paramFolder") },
      },
      required: [],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const folder = (params.folder as string || "").toLowerCase();
      const files = app.vault.getMarkdownFiles()
        .filter(f => !folder || f.path.toLowerCase().startsWith(folder))
        .slice(0, 50);
      if (files.length === 0) return t("tools.listNotes.noNotes");
      return files.map((f, i) => `[${i + 1}] ${f.path}`).join("\n");
    },
  };
}

export function createFulltextSearchTool(app: App): AgentTool {
  return {
    name: "search_vault_fulltext",
    description: t("tools.searchVaultFulltext.description"),
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: t("tools.searchVaultFulltext.paramQuery") },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const query = (params.query as string || "").toLowerCase();
      if (!query) return t("tools.searchVaultFulltext.error.emptyQuery");
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
      if (matches.length === 0) return t("tools.searchVaultFulltext.notFound", { query });
      return matches.map((m, i) => `[${i + 1}] ${m}`).join("\n");
    },
  };
}

export function createVaultStatsTool(app: App): AgentTool {
  return {
    name: "get_vault_stats",
    description: t("tools.getVaultStats.description"),
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
      const notes = files.length;
      const size = `${(totalSize / 1024).toFixed(0)} KB`;
      return t("tools.getVaultStats.stats", { notes, size, folders: folders.size });
    },
  };
}

export function createGetActiveFileTool(app: App): AgentTool {
  return {
    name: "get_active_file",
    description: t("tools.getActiveFile.description"),
    parameters: { type: "object", properties: {}, required: [] },
    execute: async (): Promise<string> => {
      const file = app.workspace.getActiveFile();
      if (!file) return t("tools.getActiveFile.noFileOpen");
      try {
        const content = await app.vault.read(file);
        return `[${file.path}]\n\n${content}`;
      } catch (err) {
        return t("tools.getActiveFile.error", { error: String(err) });
      }
    },
  };
}

export function createGetFrontmatterTool(app: App): AgentTool {
  return {
    name: "get_frontmatter",
    description: t("tools.getFrontmatter.description"),
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: t("tools.getFrontmatter.paramPath") },
      },
      required: ["path"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const path = params.path as string;
      const file = app.vault.getAbstractFileByPath(path);
      if (!file) return t("tools.getFrontmatter.error.notFound", { path });
      try {
        const content = await app.vault.read(file as any);
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fmMatch) return t("tools.getFrontmatter.noFrontmatter");
        return fmMatch[1];
      } catch (err) {
        return t("tools.getFrontmatter.error.generic", { error: String(err) });
      }
    },
  };
}
