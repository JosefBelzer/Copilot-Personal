import { App } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { t } from "../i18n";

/**
 * search_vault_by_timeframe — busca notas del vault modificadas entre dos fechas.
 */
export function createTimeSearchTool(app: App): AgentTool {
  return {
    name: "search_vault_by_timeframe",
    description:
      t("tools.searchVaultByTimeframe.description"),
    parameters: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: t("tools.searchVaultByTimeframe.paramStartDate"),
        },
        end_date: {
          type: "string",
          description: t("tools.searchVaultByTimeframe.paramEndDate"),
        },
      },
      required: ["start_date", "end_date"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const startDate = new Date(params.start_date as string);
      const endDate = new Date(params.end_date as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return t("tools.searchVaultByTimeframe.error.invalidDates");
      }

      const files = app.vault.getMarkdownFiles();
      const matched: Array<{ path: string; title: string; snippet: string; mtime: number }> = [];

      for (const file of files) {
        const mtime = file.stat.mtime;
        if (mtime >= startDate.getTime() && mtime <= endDate.getTime()) {
          try {
            const content = await app.vault.read(file);
            const snippet = content.slice(0, 500);
            const title = file.basename;
            matched.push({ path: file.path, title, snippet, mtime });
          } catch (err) {
            console.error("[search_vault_by_timeframe] Skipping unreadable file:", err);
          }
        }
      }

      if (matched.length === 0) {
        return t("tools.searchVaultByTimeframe.noResults", { start: params.start_date as string, end: params.end_date as string });
      }

      return matched
        .map(
          (m, i) =>
            t("tools.searchVaultByTimeframe.result", { index: i + 1, title: m.title, path: m.path, mtime: new Date(m.mtime).toISOString(), snippet: m.snippet })
        )
        .join("\n\n");
    },
  };
}
