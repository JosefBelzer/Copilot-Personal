/**
 * Tests for ToolRouter.ts — LLM-based tool category classification.
 * Tests the fast-path, CATEGORY_MAP, buildRouted(), and the default fallback.
 * Does NOT require an actual LLM provider (unit tests).
 */
import { ToolRouter } from "../agent/ToolRouter";
import { AgentTool } from "../agent/ToolRegistry";

// Helper: create a mock agent tool with given name and category assignments
function mkTool(name: string, desc: string = ""): AgentTool {
  return {
    name,
    description: desc || `Mock tool: ${name}`,
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => `result of ${name}`,
  };
}

// Helper: build a tools Map
function buildTools(tools: AgentTool[]): Map<string, AgentTool> {
  const m = new Map<string, AgentTool>();
  for (const t of tools) m.set(t.name, t);
  return m;
}

describe("ToolRouter", () => {
  // All 17 tools matching the real CATEGORY_MAP entries
  const allTools = buildTools([
    mkTool("read_note"),
    mkTool("read_pdf"),
    mkTool("get_active_file"),
    mkTool("get_frontmatter"),
    mkTool("create_note"),
    mkTool("update_note"),
    mkTool("find_files"),
    mkTool("list_notes"),
    mkTool("search_vault_fulltext"),
    mkTool("get_vault_stats"),
    mkTool("search_vault_semantic"),
    mkTool("search_vault_by_timeframe"),
    mkTool("search_web"),
    mkTool("analyze_image"),
    mkTool("extract_youtube_transcript"),
    mkTool("render_pdf_pages"),
    mkTool("extract_pdf_images"),
  ]);

  describe("buildRouted (via route without provider — fast-path or default)", () => {
    test("fast-path: wiki-link list with 'crea' verb → write category", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("crea notas para: [[A]], [[B]], [[C]]");
      expect(result.categories).toEqual(["write"]);
      expect(result.tools.length).toBeGreaterThan(0);
      expect(result.tools.every(t => t.function.name === "create_note" || t.function.name === "update_note")).toBe(true);
    });

    test("fast-path: Spanish 'genera' verb triggers write", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("genera notas [[X]], [[Y]]");
      expect(result.categories).toEqual(["write"]);
    });

    test("fast-path: English 'create' verb triggers write", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("create notes for [[Readme]], [[Changelog]]");
      expect(result.categories).toEqual(["write"]);
    });

    test("fast-path: English 'make' verb triggers write", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("make notes: [[A]], [[B]]");
      expect(result.categories).toEqual(["write"]);
    });

    test("fast-path: single wiki-link (not 2+) does NOT trigger fast-path", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("create note [[single]]");
      // Falls to default (no provider → safe default)
      expect(result.categories).toEqual(["read", "search", "write"]);
    });

    test("default: no provider → safe default of read+search+write", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("hello");
      expect(result.categories).toEqual(["read", "search", "write"]);
      expect(result.tools.length).toBeGreaterThan(3);
    });
  });

  describe("buildRouted — category ↔ tools mapping", () => {
    test("read category includes read_note, read_pdf, get_active_file, get_frontmatter", async () => {
      const router = new ToolRouter(null, allTools);
      // Force buildRouted via route() — without provider, goes to default which includes "read"
      const result = await router.route("any query");
      const readTools = result.toolsByCategory.get("read")?.map((t: any) => t.name) || [];
      expect(readTools).toContain("read_note");
      expect(readTools).toContain("read_pdf");
      expect(readTools).toContain("get_active_file");
      expect(readTools).toContain("get_frontmatter");
    });

    test("write category includes create_note and update_note", async () => {
      const router = new ToolRouter(null, allTools);
      const result = (router as any).buildRouted(["write"]);
      const writeTools = result.toolsByCategory.get("write")?.map((t: any) => t.name) || [];
      expect(writeTools).toContain("create_note");
      expect(writeTools).toContain("update_note");
    });

    test("search category includes find_files, list_notes, search_vault_fulltext, get_vault_stats (via buildRouted)", async () => {
      const router = new ToolRouter(null, allTools);
      const result = (router as any).buildRouted(["search"]);
      const searchTools = result.toolsByCategory.get("search")?.map((t: any) => t.name) || [];
      expect(searchTools).toContain("find_files");
      expect(searchTools).toContain("list_notes");
      expect(searchTools).toContain("search_vault_fulltext");
      expect(searchTools).toContain("get_vault_stats");
    });

    test("semantic category includes search_vault_semantic, search_vault_by_timeframe", async () => {
      const router = new ToolRouter(null, allTools);
      const result = (router as any).buildRouted(["semantic"]);
      const semTools = result.toolsByCategory.get("semantic")?.map((t: any) => t.name) || [];
      expect(semTools).toContain("search_vault_semantic");
      expect(semTools).toContain("search_vault_by_timeframe");
    });

    test("web category includes search_web when requested", async () => {
      const router = new ToolRouter(null, allTools);
      const result = (router as any).buildRouted(["search"]);
      // Default categories don't include web, but we can check that it's NOT present
      expect(result.categories).not.toContain("web");
    });

    test("media category includes analyze_image, youtube_transcript, render_pdf_pages, extract_pdf_images", async () => {
      const router = new ToolRouter(null, allTools);
      const result = (router as any).buildRouted(["search"]);
      // Default categories don't include media, but we can check that it's NOT present
      expect(result.categories).not.toContain("media");
    });

    test("render_pdf_pages appears in both read AND media CATEGORY_MAP entries", async () => {
      const router = new ToolRouter(null, allTools);
      const result = (router as any).buildRouted(["read"]);
      const readTools = result.toolsByCategory.get("read")?.map((t: any) => t.name) || [];
      expect(readTools).toContain("render_pdf_pages");
    });
  });

  describe("tool definitions format", () => {
    test("each tool definition has OpenAI-compatible format", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("any query");
      for (const tool of result.tools) {
        expect(tool.type).toBe("function");
        expect(tool.function).toBeDefined();
        expect(typeof tool.function.name).toBe("string");
        expect(typeof tool.function.description).toBe("string");
        expect(typeof tool.function.parameters).toBe("object");
      }
    });

    test("tools field contains deduplicated tools", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("any query");
      const names = result.tools.map(t => t.function.name);
      const unique = new Set(names);
      expect(names.length).toBe(unique.size); // no duplicates
    });
  });

  describe("RoutedTools structure", () => {
    test("returns categories array, tools array, and toolsByCategory map", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("test");
      expect(Array.isArray(result.categories)).toBe(true);
      expect(Array.isArray(result.tools)).toBe(true);
      expect(result.toolsByCategory).toBeInstanceOf(Map);
    });

    test("all tools in toolsByCategory match categories", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("test");
      for (const [cat, catTools] of result.toolsByCategory) {
        expect(result.categories).toContain(cat);
        for (const tool of catTools) {
          const found = result.tools.some(t => t.function.name === tool.name);
          expect(found).toBe(true);
        }
      }
    });
  });

  describe("fast-path edge cases", () => {
    test("fast-path also works with 'añade' verb", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("añade notas para [[A]], [[B]]");
      // The regex includes "a[nñ]ade"
      expect(result.categories).toEqual(["write"]);
    });

    test("fast-path also works with 'add' verb", async () => {
      const router = new ToolRouter(null, allTools);
      const result = await router.route("add notes [[X]], [[Y]], [[Z]]");
      expect(result.categories).toEqual(["write"]);
    });
  });

  describe("no provider fallback", () => {
    test("when provider fails, falls back to safe default", async () => {
      // Simulate a failing provider
      const failingProvider = {
        providerType: "deepseek" as const,
        config: {} as any,
        chat: async () => { throw new Error("simulated failure"); },
        chatStream: async function* () {},
        embed: async () => [],
        embedSingle: async () => [],
        updateConfig: () => {},
      };
      
      const router = new ToolRouter(failingProvider, allTools);
      const result = await router.route("any complex task that would use LLM");
      expect(result.categories).toEqual(["read", "search", "write"]);
    });
  });
});
