import { App } from "obsidian";

/**
 * ApplyView — simple diff-like view for AI-generated note edits.
 * Shows original vs modified content with Accept/Reject capabilities.
 */
export class ApplyView {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  /**
   * Generate a simple unified diff between original and modified text.
   */
  generateDiff(original: string, modified: string): Array<{
    type: "unchanged" | "added" | "removed";
    text: string;
  }> {
    const origLines = original.split("\n");
    const modLines = modified.split("\n");
    const diff: Array<{ type: "unchanged" | "added" | "removed"; text: string }> = [];

    // Simple line-by-line comparison
    const maxLen = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i] ?? null;
      const mod = modLines[i] ?? null;
      if (orig === mod) {
        if (orig) diff.push({ type: "unchanged", text: orig });
      } else {
        if (orig) diff.push({ type: "removed", text: orig });
        if (mod) diff.push({ type: "added", text: mod });
      }
    }

    return diff;
  }

  /**
   * Render the diff into an HTML element.
   */
  renderDiff(diff: Array<{ type: "unchanged" | "added" | "removed"; text: string }>, container: HTMLElement): void {
    container.empty();
    for (const line of diff) {
      const el = container.createDiv(`copilot-diff-${line.type}`);
      el.setText(line.text);
    }
  }

  /**
   * Apply the modified content to the vault file.
   */
  async applyEdit(path: string, content: string): Promise<boolean> {
    try {
      await this.app.vault.adapter.write(path, content);
      return true;
    } catch {
      return false;
    }
  }
}
