/**
 * ContextPills — visual chips that show what context is available to the model.
 * Rendered below the chat input using Obsidian's createEl() (no React needed).
 */
export interface ContextPill {
  type: "note" | "image" | "url" | "folder" | "rag" | "web" | "active-note";
  label: string;
  detail?: string;
}

export class ContextPills {
  private container: HTMLElement;
  private pills: Map<string, HTMLElement> = new Map();
  private onRemove?: (pill: ContextPill) => void;

  constructor(parentEl: HTMLElement, onRemove?: (pill: ContextPill) => void) {
    this.onRemove = onRemove;
    this.container = parentEl.createDiv("copilot-context-pills");
  }

  addPill(pill: ContextPill): void {
    const key = `${pill.type}:${pill.label}`;
    if (this.pills.has(key)) return;

    const el = this.container.createDiv("copilot-context-pill");
    const icon = this.getIcon(pill.type);

    el.createSpan({ text: icon, cls: "copilot-pill-icon" });
    el.createSpan({ text: pill.label, cls: "copilot-pill-label" });
    if (pill.detail) {
      el.createSpan({ text: pill.detail, cls: "copilot-pill-detail" });
    }

    const removeBtn = el.createEl("button", { cls: "copilot-pill-remove", text: "×" });
    removeBtn.addEventListener("click", () => {
      this.removePill(key);
      this.onRemove?.(pill);
    });

    this.pills.set(key, el);
  }

  removePill(key: string): void {
    const el = this.pills.get(key);
    if (el) {
      el.remove();
      this.pills.delete(key);
    }
  }

  clear(): void {
    this.pills.forEach((el) => el.remove());
    this.pills.clear();
  }

  getPills(): ContextPill[] {
    const result: ContextPill[] = [];
    this.pills.forEach((_, key) => {
      const [type, ...labelParts] = key.split(":");
      result.push({ type: type as ContextPill["type"], label: labelParts.join(":") });
    });
    return result;
  }

  private getIcon(type: string): string {
    switch (type) {
      case "note": return "📄";
      case "image": return "🖼️";
      case "url": return "🔗";
      case "folder": return "📁";
      case "rag": return "🔍";
      case "web": return "🌐";
      case "active-note": return "📝";
      default: return "📌";
    }
  }
}
