import { App, TFile } from "obsidian";

/**
 * MemoryManager — persistent memory across chat conversations.
 * Saves summaries to vault notes in copilot/memory/ and loads them on new chats.
 * Supports @remember command for explicit memories.
 */
export class MemoryManager {
  private app: App;
  private memoryFolder: string;

  constructor(app: App, memoryFolder: string = "copilot/memory") {
    this.app = app;
    this.memoryFolder = memoryFolder;
  }

  /**
   * Generate and save a summary of the current conversation.
   */
  async summarizeConversation(messages: Array<{ role: string; content: string }>): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `${timestamp}-ChatSummary.md`;
    const path = `${this.memoryFolder}/${fileName}`;

    const content = this.buildSummaryMarkdown(messages, timestamp);
    await this.ensureFolder();
    await this.app.vault.create(path, content);
  }

  /**
   * Load recent memory summaries for context.
   */
  async loadRecentMemories(maxMemories: number): Promise<string[]> {
    await this.ensureFolder();
    const files = this.app.vault.getFiles()
      .filter((f: TFile) => f.path.startsWith(this.memoryFolder) && f.path.endsWith(".md"))
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, maxMemories);

    const memories: string[] = [];
    for (const file of files) {
      try {
        const content = await this.app.vault.read(file);
        memories.push(content);
      } catch (err) {
        console.error("[MemoryManager] Skipping unreadable memory file:", err);
      }
    }
    return memories;
  }

  /**
   * Save an explicit memory (triggered by @remember command).
   */
  async saveExplicitMemory(text: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const path = `${this.memoryFolder}/important.md`;

    await this.ensureFolder();

    const exists = await this.app.vault.adapter.exists(path);
    if (exists) {
      const existing = await this.app.vault.adapter.read(path);
      await this.app.vault.adapter.write(path, existing + `\n\n[${timestamp}]\n${text}`);
    } else {
      await this.app.vault.create(path, `# Important Memories\n\n[${timestamp}]\n${text}`);
    }
  }

  /**
   * Build a markdown summary from conversation messages.
   */
  private buildSummaryMarkdown(
    messages: Array<{ role: string; content: string }>,
    timestamp: string
  ): string {
    let md = `# Chat Summary — ${timestamp}\n\n`;
    md += `Messages: ${messages.length}\n\n`;
    md += `## Key Points\n\n`;

    // Extract bullet points and key lines
    const keyLines: string[] = [];
    for (const msg of messages) {
      if (msg.role !== "assistant") continue;
      for (const line of msg.content.split("\n")) {
        const trimmed = line.trim();
        if (
          trimmed.startsWith("- ") || trimmed.startsWith("* ") ||
          /^\d+\./.test(trimmed) || trimmed.startsWith("**") ||
          trimmed.includes(":") && trimmed.length < 200
        ) {
          keyLines.push(trimmed);
          if (keyLines.length >= 20) break;
        }
      }
      if (keyLines.length >= 20) break;
    }

    md += keyLines.join("\n") || "No key points extracted.";
    md += "\n";
    return md;
  }

  /**
   * Ensure the memory folder exists.
   */
  private async ensureFolder(): Promise<void> {
    const exists = await this.app.vault.adapter.exists(this.memoryFolder);
    if (!exists) {
      await this.app.vault.createFolder(this.memoryFolder);
    }
  }
}
