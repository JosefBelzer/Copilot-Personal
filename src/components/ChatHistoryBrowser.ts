import { App, TFile } from "obsidian";

/**
 * ChatHistoryBrowser — navigate and manage saved chat history files.
 */
export class ChatHistoryBrowser {
  private app: App;
  private folder: string;

  constructor(app: App, folder: string = "copilot-chats") {
    this.app = app;
    this.folder = folder;
  }

  async listChats(): Promise<Array<{ path: string; title: string; date: Date }>> {
    const files = this.app.vault.getFiles()
      .filter((f: TFile) => f.path.startsWith(this.folder) && f.path.endsWith(".md"))
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, 50);

    return files.map(f => ({
      path: f.path,
      title: f.basename,
      date: new Date(f.stat.mtime),
    }));
  }

  async loadChat(path: string): Promise<string | null> {
    try {
      return await this.app.vault.adapter.read(path);
    } catch {
      return null;
    }
  }

  async deleteChat(path: string): Promise<boolean> {
    try {
      const file = this.app.vault.getAbstractFileByPath(path);
      if (file) {
        await this.app.fileManager.trashFile(file as TFile);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async renameChat(path: string, newName: string): Promise<boolean> {
    try {
      const file = this.app.vault.getAbstractFileByPath(path);
      if (file) {
        const newPath = `${this.folder}/${newName}.md`;
        await this.app.vault.rename(file as TFile, newPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
