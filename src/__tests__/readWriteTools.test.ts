/**
 * Tests for readNoteTool and updateNoteTool — the tools most involved
 * in the silent-failure bugs (missing .md extension, write verification).
 */
import { createReadNoteTool } from "../tools/readNoteTool";
import { createUpdateNoteTool } from "../tools/updateNoteTool";
import { createCreateNoteTool } from "../tools/createNoteTool";

const obsidian = require("../../__mocks__/obsidian");

describe("readNoteTool — path resolution", () => {
  beforeEach(() => {
    obsidian.resetVault();
    // Set up vault files
    obsidian.setVaultFile("QM/01_02_Qualitaet_als_Erfolgsfaktor.md", "# 1.2 Qualität als Erfolgsfaktor\n\nInhalt...");
    obsidian.setVaultFile("Grundlagen_QM/01_02_Qualitaet_als_Erfolgsfaktor.md", "# Duplicate note\n\nOther content...");
    obsidian.setVaultFile("Notes/Simple.md", "Simple note content");
  });

  function makeApp() {
    return {
      vault: {
        adapter: obsidian.Vault.adapter,
        read: obsidian.Vault.read,
        getMarkdownFiles: () => [
          { path: "QM/01_02_Qualitaet_als_Erfolgsfaktor.md", basename: "01_02_Qualitaet_als_Erfolgsfaktor", name: "01_02_Qualitaet_als_Erfolgsfaktor.md" },
          { path: "Grundlagen_QM/01_02_Qualitaet_als_Erfolgsfaktor.md", basename: "01_02_Qualitaet_als_Erfolgsfaktor", name: "01_02_Qualitaet_als_Erfolgsfaktor.md" },
          { path: "Notes/Simple.md", basename: "Simple", name: "Simple.md" },
        ],
      },
    };
  }

  test("Strategy 1: exact path with .md works", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "Notes/Simple.md" });
    expect(result).toContain("Simple note content");
  });

  test("Strategy 2: auto-appends .md when missing", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "Notes/Simple" });
    expect(result).toContain("Simple note content");
  });

  test("Strategy 3: finds unique note by basename (no path, no .md)", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "Simple" });
    expect(result).toContain("Simple note content");
    expect(result).toContain("Notes/Simple.md");
  });

  test("Strategy 3: returns list when multiple notes share basename", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "01_02_Qualitaet_als_Erfolgsfaktor" });
    expect(result).toContain("Encontradas 2 notas");
    expect(result).toContain("QM/01_02_Qualitaet_als_Erfolgsfaktor.md");
    expect(result).toContain("Grundlagen_QM/01_02_Qualitaet_als_Erfolgsfaktor.md");
  });

  test("Strategy 3: resolves correctly when full path with .md is given", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "QM/01_02_Qualitaet_als_Erfolgsfaktor.md" });
    expect(result).toContain("1.2 Qualität als Erfolgsfaktor");
  });

  test("Strategy 4: partial match fallback for non-existent names", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "Qualitaet" });
    // Should find partial matches
    expect(result).toContain("Notas similares");
    expect(result).toContain("01_02_Qualitaet");
  });

  test("Returns error for completely non-existent note", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "ZXYZ_DoesNotExist" });
    expect(result).toContain("no existe");
  });

  test("Error when path is empty", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "" });
    expect(result).toContain("Error");
  });

  test("Case-insensitive basename matching", async () => {
    const tool = createReadNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "simple" });
    // basename "Simple" should match "simple" case-insensitively
    expect(result).toContain("Simple note content");
  });
});

describe("updateNoteTool — write verification", () => {
  beforeEach(() => {
    obsidian.resetVault();
    obsidian.setVaultFile("existing.md", "Original content");
  });

  function makeApp() {
    return {
      vault: {
        adapter: obsidian.Vault.adapter,
      },
    };
  }

  test("successfully updates existing note and verifies content", async () => {
    const tool = createUpdateNoteTool(makeApp() as any);
    const newContent = "# Updated\n\nNew content here.";
    const result = await tool.execute({ path: "existing.md", content: newContent });

    expect(result).toContain("actualizada correctamente");
    expect(result).toContain(String(newContent.length));

    // Verify the file was actually written
    const written = await obsidian.Vault.adapter.read("existing.md");
    expect(written).toBe(newContent);
  });

  test("returns error when path is empty", async () => {
    const tool = createUpdateNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "", content: "x" });
    expect(result).toContain("Error");
    expect(result).toContain("ruta no proporcionada");
  });

  test("returns error when content is null/undefined", async () => {
    const tool = createUpdateNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "existing.md", content: null });
    expect(result).toContain("Error");
    expect(result).toContain("contenido no proporcionado");
  });

  test("returns error when note does not exist", async () => {
    const tool = createUpdateNoteTool(makeApp() as any);
    const result = await tool.execute({ path: "nonexistent.md", content: "content" });
    expect(result).toContain("no existe");
  });

  test("rejects write when verification fails (content mismatch)", async () => {
    // Override adapter.write to simulate a silent write failure
    const app = makeApp();
    const originalWrite = app.vault.adapter.write;
    app.vault.adapter.write = async (p: string, c: string) => {
      // Don't actually write — simulate a disk error
    };

    const tool = createUpdateNoteTool(app as any);
    const result = await tool.execute({ path: "existing.md", content: "Should fail" });
    // Should detect that content doesn't match after write
    expect(result).toContain("Error");
  });
});

describe("createNoteTool — duplicate prevention", () => {
  beforeEach(() => {
    obsidian.resetVault();
  });

  test("rejects duplicate note names", async () => {
    obsidian.setVaultFile("exists.md", "existing");
    const app = {
      vault: {
        getAbstractFileByPath: (p: string) => p === "exists.md" ? { path: p } : null,
        create: async () => {},
        adapter: obsidian.Vault.adapter,
      },
    };
    const tool = createCreateNoteTool(app as any);
    const result = await tool.execute({ title: "exists", content: "x" });
    expect(result).toContain("ya existe");
  });
});
