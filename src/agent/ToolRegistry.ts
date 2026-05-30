import type { ToolDefinition } from "../LLMProviders/providerTypes";
export type { ToolDefinition } from "../LLMProviders/providerTypes";

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<string>;
  /** Optional model-specific guidance injected into the system prompt */
  customPromptInstructions?: string;
}

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, AgentTool> = new Map();

  private constructor() {}

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  static resetInstance(): void {
    ToolRegistry.instance = undefined as any;
  }

  register(tool: AgentTool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): AgentTool | undefined {
    return this.tools.get(name);
  }

  /** Returns all registered tool objects with their customPromptInstructions */
  getAllTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  getToolDefinitions(): ToolDefinition[] {
    const defs: ToolDefinition[] = [];
    for (const tool of this.tools.values()) {
      defs.push({
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      });
    }
    return defs;
  }

  async executeTool(name: string, params: Record<string, unknown>): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      return `Error: Tool "${name}" not found.`;
    }
    try {
      return await tool.execute(params);
    } catch (err) {
      return `Error executing tool "${name}": ${err instanceof Error ? err.message : String(err)}`;
    }
  }
}
