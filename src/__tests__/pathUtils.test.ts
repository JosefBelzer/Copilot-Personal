/**
 * Tests for pathUtils.ts — all 9 exported utility functions.
 */
import {
  normalizePath,
  ensureMd,
  dirname,
  basenameNoExt,
  normalizeGerman,
  normalizeApiUrl,
  withTimeout,
} from "../utils/pathUtils";

describe("normalizePath", () => {
  test("converts backslashes to forward slashes", () => {
    expect(normalizePath("folder\\subfolder\\file.md")).toBe("folder/subfolder/file.md");
  });

  test("collapses duplicate slashes", () => {
    expect(normalizePath("folder//subfolder///file.md")).toBe("folder/subfolder/file.md");
  });

  test("removes trailing slash", () => {
    expect(normalizePath("folder/subfolder/")).toBe("folder/subfolder");
  });

  test("preserves plain paths", () => {
    expect(normalizePath("simple-note")).toBe("simple-note");
  });

  test("handles mixed separators", () => {
    expect(normalizePath("folder\\nested//deep///file.md")).toBe("folder/nested/deep/file.md");
  });
});

describe("ensureMd", () => {
  test("adds .md when missing", () => {
    expect(ensureMd("MyNote")).toBe("MyNote.md");
  });

  test("preserves .md when present", () => {
    expect(ensureMd("MyNote.md")).toBe("MyNote.md");
  });

  test("handles paths with folders", () => {
    expect(ensureMd("folder/Note")).toBe("folder/Note.md");
  });

  test("does not double-add .md", () => {
    expect(ensureMd("folder/Note.md")).toBe("folder/Note.md");
  });
});

describe("dirname", () => {
  test("extracts directory from path", () => {
    expect(dirname("folder/note.md")).toBe("folder");
  });

  test("returns empty string for root files", () => {
    expect(dirname("root.md")).toBe("");
  });

  test("handles nested paths", () => {
    expect(dirname("a/b/c/file.md")).toBe("a/b/c");
  });

  test("normalizes backslashes first", () => {
    expect(dirname("folder\\subfolder\\file.md")).toBe("folder/subfolder");
  });
});

describe("basenameNoExt", () => {
  test("extracts basename without .md", () => {
    expect(basenameNoExt("folder/MyNote.md")).toBe("MyNote");
  });

  test("handles root-level files", () => {
    expect(basenameNoExt("RootNote.md")).toBe("RootNote");
  });

  test("handles paths without extension", () => {
    expect(basenameNoExt("folder/NoExt")).toBe("NoExt");
  });

  test("case-insensitive .md removal", () => {
    expect(basenameNoExt("folder/Note.MD")).toBe("Note");
  });
});

describe("normalizeGerman", () => {
  test("lowercases text", () => {
    expect(normalizeGerman("HALLO")).toBe("hallo");
  });

  test("replaces ä with a", () => {
    expect(normalizeGerman("Qualität")).toBe("qualitat");
  });

  test("replaces ö with o", () => {
    expect(normalizeGerman("Öffnen")).toBe("offnen");
  });

  test("replaces ü with u", () => {
    expect(normalizeGerman("Über")).toBe("uber");
  });

  test("replaces ß with s", () => {
    expect(normalizeGerman("Straße")).toBe("strase");
  });

  test("replaces ae with a (fuzzy match)", () => {
    expect(normalizeGerman("Qualitaetsmanagement")).toBe("qualitatsmanagement");
  });

  test("handles mixed combinations", () => {
    expect(normalizeGerman("Änderungswünsche für Öl")).toBe("anderungswunsche fur ol");
  });
});

describe("normalizeApiUrl", () => {
  test("strips trailing slashes", () => {
    expect(normalizeApiUrl("https://api.example.com///")).toBe("https://api.example.com/v1");
  });

  test("preserves URL without trailing slash", () => {
    expect(normalizeApiUrl("https://api.example.com")).toBe("https://api.example.com/v1");
  });

  test("does not double-add /v1", () => {
    expect(normalizeApiUrl("https://api.example.com/v1")).toBe("https://api.example.com/v1");
  });

  test("handles DeepSeek URL", () => {
    expect(normalizeApiUrl("https://api.deepseek.com")).toBe("https://api.deepseek.com/v1");
  });

  test("handles local LM Studio URL", () => {
    expect(normalizeApiUrl("http://localhost:1234/v1")).toBe("http://localhost:1234/v1");
  });

  test("handles OpenRouter URL", () => {
    expect(normalizeApiUrl("https://openrouter.ai/api/v1/")).toBe("https://openrouter.ai/api/v1");
  });
});

describe("withTimeout", () => {
  test("resolves when promise completes before timeout", async () => {
    const result = await withTimeout(Promise.resolve("ok"), 1000, "test");
    expect(result).toBe("ok");
  });

  test("rejects when promise takes too long", async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve("too late"), 200));
    await expect(withTimeout(slow, 10, "slowOp")).rejects.toThrow("slowOp timed out after 10ms");
  });

  test("rejects with original error if promise rejects fast", async () => {
    const failing = Promise.reject(new Error("original failure"));
    await expect(withTimeout(failing, 1000, "test")).rejects.toThrow("original failure");
  });

  test("label appears in timeout error message", async () => {
    const hanging = new Promise(() => {});
    await expect(withTimeout(hanging, 1, "customLabel")).rejects.toThrow("customLabel timed out");
  });

  test("default label is 'Operation'", async () => {
    const hanging = new Promise(() => {});
    await expect(withTimeout(hanging, 1)).rejects.toThrow("Operation timed out");
  });
});
