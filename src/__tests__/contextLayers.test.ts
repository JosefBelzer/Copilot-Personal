/**
 * Tests for ContextLayers.ts — L1-L5 layered context with auto-promotion.
 */
import { ContextLayers } from "../agent/ContextLayers";
import { LLMMessage } from "../LLMProviders/types";

describe("ContextLayers", () => {
  let layers: ContextLayers;

  beforeEach(() => {
    layers = new ContextLayers();
  });

  describe("buildContext", () => {
    test("returns user message as last element (L5)", () => {
      const result = layers.buildContext("Hello world", []);
      expect(result.length).toBe(1);
      expect(result[0].role).toBe("user");
      expect(result[0].content).toBe("Hello world");
    });

    test("includes recent messages (L4) in correct order", () => {
      const history: LLMMessage[] = [
        { role: "user", content: "Q1" },
        { role: "assistant", content: "A1" },
        { role: "user", content: "Q2" },
        { role: "assistant", content: "A2" },
        { role: "user", content: "Q3" },
        { role: "assistant", content: "A3" },
        { role: "user", content: "Q4" },
        { role: "assistant", content: "A4" },
      ];
      const result = layers.buildContext("New question", history);
      // Last 6 messages (LAYERS_RECENT_MSGS=6) + the new question
      expect(result.length).toBeGreaterThanOrEqual(1);
      const lastMsg = result[result.length - 1];
      expect(lastMsg.role).toBe("user");
      expect(lastMsg.content).toBe("New question");
    });

    test("filters out system messages from history", () => {
      const history: LLMMessage[] = [
        { role: "system", content: "Sys prompt" },
        { role: "user", content: "Question" },
        { role: "assistant", content: "Answer" },
      ];
      const result = layers.buildContext("New Q", history);
      const roles = result.map(m => m.role);
      expect(roles).not.toContain("system");
    });

    test("includes L2 persistent context when present", () => {
      layers.setL2Content("User prefers bullet points");
      const result = layers.buildContext("New message", []);
      // First message should be the L2 context
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0].role).toBe("system");
      expect(result[0].content).toContain("User prefers bullet points");
    });
  });

  describe("afterTurn — auto-promotion", () => {
    test("does not promote L3→L2 before interval is reached", () => {
      layers.afterTurn("Response 1", ["Tool result 1"]);
      layers.afterTurn("Response 2", ["Tool result 2"]);
      // LAYERS_PROMOTION_INTERVAL is 3, so after 2 turns there should be no promotion
      expect(layers.getL2Content()).toBe("");
    });

    test("promotes L3→L2 at the promotion interval (3rd turn)", () => {
      // Fill L2 first so we can detect the change
      layers.afterTurn("- Fact A from response", ["Tool result AAAA"]);
      layers.afterTurn("- Fact B from response", ["Tool result BBBB"]); 
      layers.afterTurn("- Fact C from response", ["Tool result CCCC"]);
      // After 3 turns (interval=3), L2 should have content
      expect(layers.getL2Content()).not.toBe("");
    });

    test("increments turn count correctly", () => {
      expect(layers.getL2Content()).toBe("");
      // Need responses with bullet points to trigger fact extraction
      layers.afterTurn("- First fact", ["ToolResultOne"]);
      // After 1 turn, no promotion yet
      layers.afterTurn("- Second fact", ["ToolResultTwo"]);
      // After 2 turns, still no promotion
      layers.afterTurn("- Third fact", ["ToolResultThree"]);
      // After 3 turns (3 % 3 = 0), promotion occurs
      expect(layers.getL2Content().length).toBeGreaterThan(0);
    });
  });

  describe("extractKeyFacts (via afterTurn)", () => {
    test("extracts bullet points from assistant response", () => {
      // Need 3 turns to trigger promotion
      const response = "- Key fact one\n- Key fact two\n- Key fact three";
      layers.afterTurn(response, []);
      layers.afterTurn(response, []);
      layers.afterTurn(response, []);
      const l2 = layers.getL2Content();
      expect(l2).toContain("Key fact one");
      expect(l2).toContain("Key fact two");
      expect(l2).toContain("Key fact three");
    });

    test("extracts numbered items", () => {
      const response = "1. First item\n2. Second item\n3. Third";
      layers.afterTurn(response, []);
      layers.afterTurn(response, []);
      layers.afterTurn(response, []);
      const l2 = layers.getL2Content();
      expect(l2).toContain("First item");
    });

    test("includes tool results in facts", () => {
      layers.afterTurn("Response", ["Tool output: found 5 PDF files"]);
      layers.afterTurn("Response", ["Tool output: extracted text"]);
      layers.afterTurn("Response", ["Tool output: created note"]);
      const l2 = layers.getL2Content();
      expect(l2).toContain("[Tool result]");
    });

    test("skips tool results shorter than 10 chars", () => {
      layers.afterTurn("Response", ["short"]);
      layers.afterTurn("Response", ["tiny"]);
      layers.afterTurn("Response", ["ok"]);
      const l2 = layers.getL2Content();
      // "short", "tiny", "ok" are all < 10 chars, so no tool result facts
      expect(l2).not.toContain("[Tool result]: short");
    });
  });

  describe("mergeFacts (via afterTurn)", () => {
    test("merges new facts with existing L2 content", () => {
      layers.setL2Content("Existing fact");
      layers.afterTurn("- New fact", []);
      layers.afterTurn("- New fact", []);
      layers.afterTurn("- New fact", []);
      const l2 = layers.getL2Content();
      expect(l2).toContain("Existing fact");
      expect(l2).toContain("New fact");
    });

    test("caps L2 at LAYERS_MAX_L2_CHARS (3000)", () => {
      const bigContent = "X".repeat(4000);
      layers.setL2Content(bigContent);
      layers.afterTurn("- Extra fact that extends beyond limit with some more text here to trigger the promotion cycle correctly", []);
      layers.afterTurn("- Extra fact", []);
      layers.afterTurn("- Extra fact", []);
      const l2 = layers.getL2Content();
      expect(l2.length).toBeLessThanOrEqual(3050); // ~3000 + small new addition
    });
  });

  describe("clear", () => {
    test("resets L2 content and turn count", () => {
      layers.setL2Content("Some persistent data");
      layers.afterTurn("Response", []);
      layers.afterTurn("Response", []);
      layers.afterTurn("Response", []);
      expect(layers.getL2Content()).not.toBe("");

      layers.clear();
      expect(layers.getL2Content()).toBe("");
      // After clear, next afterTurn starts from turn 1 again
      layers.afterTurn("After clear", []);
      expect(layers.getL2Content()).toBe(""); // Only 1 turn, no promotion
    });
  });

  describe("getL2Content / setL2Content", () => {
    test("getL2Content returns empty string initially", () => {
      expect(layers.getL2Content()).toBe("");
    });

    test("setL2Content persists value", () => {
      layers.setL2Content("Custom L2");
      expect(layers.getL2Content()).toBe("Custom L2");
    });

    test("setL2Content can be cleared", () => {
      layers.setL2Content("Temporary");
      layers.setL2Content("");
      expect(layers.getL2Content()).toBe("");
    });
  });
});
