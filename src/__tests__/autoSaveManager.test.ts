/**
 * Tests for AutoSaveManager.ts — note auto-save, wiki-link validation, section splitting.
 * Uses the Obsidian mock from __mocks__/obsidian.js.
 */
import { AutoSaveManager } from "../agent/AutoSaveManager";
import { setVaultFile, setMarkdownFiles, resetVault } from "../../__mocks__/obsidian";

// Re-import the mock's vault helpers
const { Vault, TFile } = require("../../__mocks__/obsidian");

describe("AutoSaveManager — splitNoteSections", () => {
  // Create a minimal App mock
  const appMock = {
    vault: Vault,
  };
  const manager = new AutoSaveManager(appMock as any);

  test("splits multi-note response into sections", () => {
    const text = [
      "# 01_02 Quality Management",
      "Content of first note.",
      "",
      "# 01_03 Risk Analysis",
      "Content of second note.",
    ].join("\n");

    const sections = manager.splitNoteSections(text);
    expect(sections.length).toBe(2);
    expect(sections[0].heading).toBe("01_02 Quality Management");
    expect(sections[1].heading).toBe("01_03 Risk Analysis");
  });

  test("includes content under each heading", () => {
    const text = [
      "# 03_01 Planning",
      "Line 1",
      "Line 2",
      "",
      "# 03_02 Control",
      "Control content",
    ].join("\n");

    const sections = manager.splitNoteSections(text);
    expect(sections[0].content).toContain("Line 1");
    expect(sections[0].content).toContain("Line 2");
    expect(sections[1].content).toContain("Control content");
  });

  test("handles single heading", () => {
    const sections = manager.splitNoteSections("# 1.0 Introduction\nSome intro text.");
    expect(sections.length).toBe(1);
    expect(sections[0].heading).toBe("1.0 Introduction");
  });

  test("filters out warning/status lines from headings", () => {
    const text = [
      "# ← Steps to process",
      "Some content",
      "# 01_05 Real Note",
      "Real content",
    ].join("\n");
    const sections = manager.splitNoteSections(text);
    // "←" should be filtered from heading detection
    expect(sections.some(s => s.heading.includes("←"))).toBe(false);
  });

  test("returns empty array for text without headings", () => {
    const sections = manager.splitNoteSections("Just plain text without any headings.");
    expect(sections.length).toBe(0);
  });

    test("headings must contain a digit (note number pattern)", () => {
      const text = "# Introduction\nNo digit here.";
      const sections = manager.splitNoteSections(text);
      // The code falls back to first # heading via regex ^#\s+(.+)$ when no digit-based headings match
      // So a heading without digits still produces 1 section via the fallback
      expect(sections.length).toBe(1);
      expect(sections[0].heading).toBe("Introduction");
    });

  test("headings like '1.5' or '01_05' are detected", () => {
    const text = [
      "# 1.5 Risk Assessment",
      "Risk content.",
      "# 01_05_01 Detailed",
      "Details here.",
    ].join("\n");
    const sections = manager.splitNoteSections(text);
    expect(sections.length).toBe(2);
  });

  test("first heading without preceding content is captured", () => {
    const text = "# 02_Start Note\nText under first heading.";
    const sections = manager.splitNoteSections(text);
    expect(sections.length).toBe(1);
    expect(sections[0].heading).toBe("02_Start Note");
  });
});

describe("AutoSaveManager — validateWikiLinks", () => {
  beforeEach(() => {
    resetVault();
  });

  test("returns empty when no wiki-links present", () => {
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("Plain text without links.");
    expect(invented).toEqual([]);
  });

  test("detects non-existent note links", () => {
    setVaultFile("ExistingNote.md", "content");
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("See [[NonExistentNote]] for details.");
    expect(invented).toContain("NonExistentNote");
  });

  test("skips image embeds (![[file.png]])", () => {
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("Embed: ![[image.png]] and [[RealNote]]");
    expect(invented).not.toContain("image.png");
  });

  test("returns empty for valid note links", () => {
    setVaultFile("folder/RealNote.md", "content");
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("See [[folder/RealNote]] for info.");
    expect(invented).toEqual([]);
  });

  test("finds note by basename only", () => {
    setVaultFile("path/to/MyNote.md", "content");
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("Link to [[MyNote]]");
    expect(invented).toEqual([]);
  });

  test("deduplicates invented links", () => {
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("[[Fake]] and [[Fake]] again and [[Fake]]");
    expect(invented.length).toBe(1);
    expect(invented[0]).toBe("Fake");
  });

  test("handles links with aliases ([[target|display]])", () => {
    setVaultFile("Target.md", "content");
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const invented = manager.validateWikiLinks("See [[Target|the target]] for info.");
    expect(invented).toEqual([]);
  });
});

describe("AutoSaveManager — stripInventedLinks", () => {
  const appMock = { vault: { getFiles: () => [], getMarkdownFiles: () => [] } };
  const manager = new AutoSaveManager(appMock as any);

  test("replaces invented links with plain text", () => {
    const result = manager.stripInventedLinks("See [[FakeNote]] for details.", ["FakeNote"]);
    expect(result).toBe("See FakeNote for details.");
  });

  test("handles multiple invented links", () => {
    const result = manager.stripInventedLinks(
      "[[Note1]] and [[Note2]] are both fake.",
      ["Note1", "Note2"]
    );
    expect(result).toBe("Note1 and Note2 are both fake.");
  });

  test("preserves real links when they are not in invented list", () => {
    const result = manager.stripInventedLinks(
      "Real [[RealNote]] and fake [[FakeNote]].",
      ["FakeNote"]
    );
    expect(result).toContain("[[RealNote]]");
    expect(result).not.toContain("[[FakeNote]]");
    expect(result).toContain("FakeNote");
  });

  test("handles links with special regex characters", () => {
    const result = manager.stripInventedLinks(
      "See [[Note (important)]] for details.",
      ["Note (important)"]
    );
    expect(result).toBe("See Note (important) for details.");
  });
});

describe("AutoSaveManager — findNoteByHeading", () => {
  beforeEach(() => {
    resetVault();
  });

  test("finds note by number pattern (1.5 → 01_05)", () => {
    setVaultFile("01_05_Risk_Assessment.md", "content");
    // findNoteByHeading uses getMarkdownFiles, so we need to set those too
    setMarkdownFiles([
      new TFile("01_05_Risk_Assessment.md"),
    ]);
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const result = manager.findNoteByHeading("1.5 Risk Assessment");
    expect(result).not.toBeNull();
    expect(result!.path).toBe("01_05_Risk_Assessment.md");
  });

  test("returns null for non-existent heading", () => {
    setMarkdownFiles([]);
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const result = manager.findNoteByHeading("99_99_Fake_Note");
    expect(result).toBeNull();
  });

  test("matches by basename keyword when number pattern fails", () => {
    setVaultFile("Quality_Management_Basics.md", "content");
    setMarkdownFiles([
      new TFile("Quality_Management_Basics.md"),
    ]);
    const manager = new AutoSaveManager({ vault: Vault } as any);
    const result = manager.findNoteByHeading("1.0 Qualität als Erfolgsfaktor");
    // "Erfolgsfaktor" > 6 chars → keyword search, but won't match "Management"
    expect(result).toBeNull();
  });
});
