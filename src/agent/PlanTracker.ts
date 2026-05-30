/**
 * PlanTracker — persistent execution state for the agent loop.
 * Eliminates the need for per-case prompt rules by giving the agent
 * structural awareness of what's been done, what's next, and the overall goal.
 */
export interface PlanStep {
  id: number;
  action: string;        // e.g. "find_files PDF", "read_pdf p28-30", "create_note X"
  status: "pending" | "active" | "done" | "failed";
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  result?: string;       // truncated result summary
}

export class PlanTracker {
  private steps: PlanStep[] = [];
  private goal: string = "";

  /** Set the overall task goal from the user's query */
  setGoal(goal: string): void {
    this.goal = goal.substring(0, 300);
  }

  /** Initialize plan from the model's own plan generation */
  setPlan(rawPlan: string): void {
    this.steps = [];
    const lines = rawPlan.split("\n").filter(l => l.trim());
    for (const line of lines) {
      const match = line.match(/^(\d+)[\.\)]\s*(.+)/);
      if (match) {
        this.steps.push({
          id: parseInt(match[1]),
          action: match[2].trim().substring(0, 120),
          status: "pending",
        });
      }
    }
    // Mark first step as active
    if (this.steps.length > 0) {
      this.steps[0].status = "active";
    }
  }

  /** Mark the current active step as done and advance to next */
  advanceStep(toolName?: string, args?: Record<string, unknown>, result?: string): void {
    const active = this.steps.find(s => s.status === "active");
    if (active) {
      active.status = "done";
      if (toolName) active.toolName = toolName;
      if (args) active.toolArgs = args;
      if (result) active.result = result.substring(0, 200);
    }
    // Activate next pending step
    const next = this.steps.find(s => s.status === "pending");
    if (next) {
      next.status = "active";
    }
  }

  /** Mark current active step as failed */
  failStep(toolName?: string, error?: string): void {
    const active = this.steps.find(s => s.status === "active");
    if (active) {
      active.status = "failed";
      if (toolName) active.toolName = toolName;
      if (error) active.result = `ERROR: ${error.substring(0, 200)}`;
    }
  }

  /** Detect if the model is deviating from the plan */
  isDeviation(toolName: string, args: Record<string, unknown>): boolean {
    const active = this.steps.find(s => s.status === "active");
    if (!active) return false;
    // If the active step has a toolName set and it doesn't match, it's a deviation
    if (active.toolName && active.toolName !== toolName) return true;
    return false;
  }

  /** Get the current plan state as text to inject into system prompt */
  getStateText(): string {
    if (this.steps.length === 0) return "";

    const done = this.steps.filter(s => s.status === "done").length;
    const total = this.steps.length;
    const pending = this.steps.filter(s => s.status === "pending").length;

    let text = `\n## PLAN (${done}/${total} done, ${pending} remaining)`;
    if (this.goal) text += `\nGoal: ${this.goal}`;

    for (const s of this.steps) {
      const icon = s.status === "done" ? "✓" : s.status === "active" ? "→" : s.status === "failed" ? "✗" : "·";
      text += `\n ${icon} ${s.id}. ${s.action}`;
      if (s.status === "failed" && s.result) {
        text += ` — ${s.result}`;
      }
    }

    if (pending === 0) {
      text += `\n\nALL STEPS COMPLETE — provide final answer now.`;
    } else {
      text += `\n\nNEXT: Execute the → step. Do NOT skip ahead.`;
    }

    return text;
  }

  /** Whether all steps are complete */
  isComplete(): boolean {
    return this.steps.length > 0 && this.steps.every(s => s.status === "done" || s.status === "failed");
  }

  /** Whether the plan has been initialized */
  hasPlan(): boolean {
    return this.steps.length > 0;
  }
}
