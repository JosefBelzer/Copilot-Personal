/**
 * Tests for ToolRegistry singleton, registration, and execution.
 */
import { ToolRegistry, AgentTool } from "../agent/ToolRegistry";

describe("ToolRegistry", () => {
  beforeEach(() => {
    // Reset singleton for clean tests
    (ToolRegistry as any).instance = undefined;
  });

  test("getInstance returns singleton", () => {
    const a = ToolRegistry.getInstance();
    const b = ToolRegistry.getInstance();
    expect(a).toBe(b);
  });

  test("register stores a tool and getTool retrieves it", () => {
    const registry = ToolRegistry.getInstance();
    const tool: AgentTool = {
      name: "test_tool",
      description: "A test tool",
      parameters: { type: "object", properties: {}, required: [] },
      execute: async (params) => JSON.stringify(params),
    };
    registry.register(tool);
    expect(registry.getTool("test_tool")).toBe(tool);
    expect(registry.getTool("nonexistent")).toBeUndefined();
  });

  test("getToolDefinitions returns OpenAI-compatible format", () => {
    const registry = ToolRegistry.getInstance();
    registry.register({
      name: "echo",
      description: "Echoes input",
      parameters: {
        type: "object",
        properties: { text: { type: "string", description: "Text to echo" } },
        required: ["text"],
      },
      execute: async (p) => p.text as string,
    });

    const defs = registry.getToolDefinitions();
    expect(defs).toHaveLength(1);
    expect(defs[0].type).toBe("function");
    expect(defs[0].function.name).toBe("echo");
    expect(defs[0].function.description).toBe("Echoes input");
    expect(defs[0].function.parameters.properties).toHaveProperty("text");
  });

  test("executeTool calls tool and returns result", async () => {
    const registry = ToolRegistry.getInstance();
    registry.register({
      name: "add",
      description: "Adds two numbers",
      parameters: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
      execute: async (p) => String(Number(p.a) + Number(p.b)),
    });

    const result = await registry.executeTool("add", { a: 3, b: 7 });
    expect(result).toBe("10");
  });

  test("executeTool returns error message on tool error", async () => {
    const registry = ToolRegistry.getInstance();
    registry.register({
      name: "failer",
      description: "Always fails",
      parameters: { type: "object", properties: {}, required: [] },
      execute: async () => {
        throw new Error("intentional failure");
      },
    });

    const result = await registry.executeTool("failer", {});
    expect(result).toContain("Error executing tool");
    expect(result).toContain("intentional failure");
  });

  test("executeTool returns error for unknown tool", async () => {
    const registry = ToolRegistry.getInstance();
    const result = await registry.executeTool("ghost", {});
    expect(result).toContain('not found');
  });

  test("register overwrites tool with same name", () => {
    const registry = ToolRegistry.getInstance();
    const tool1: AgentTool = {
      name: "dupe",
      description: "First",
      parameters: {},
      execute: async () => "one",
    };
    const tool2: AgentTool = {
      name: "dupe",
      description: "Second",
      parameters: {},
      execute: async () => "two",
    };
    registry.register(tool1);
    registry.register(tool2);
    expect(registry.getTool("dupe")?.description).toBe("Second");
  });
});
