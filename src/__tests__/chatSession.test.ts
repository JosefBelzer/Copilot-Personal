/**
 * Tests for chatView session backup migration.
 *
 * Validates that _sessionBackup stored via plugin.loadData()/saveData()
 * is properly persisted, expires correctly, and survives saveSettings cycles.
 *
 * This replaces the old sessionStorage approach which was flagged by the
 * Obsidian plugin review as violating the "localStorage" recommendation.
 */
import { Plugin } from "obsidian";

// Replicate the saveSession logic from chatView.ts
function buildSessionData(messages: Array<{ role: string; content: string }>): {
  messages: Array<{ role: string; content: string }>;
  timestamp: number;
} {
  const msgs = messages.map((m) => ({
    role: m.role,
    content:
      m.content.length > 5000
        ? m.content.substring(0, 2500) +
          "..." +
          m.content.substring(m.content.length - 2500)
        : m.content,
  }));
  return { messages: msgs.slice(-20), timestamp: Date.now() };
}

// Replicate the restoreSession TTL check from chatView.ts
function isExpired(age: number): boolean {
  return age > 3600000; // 1 hour
}

function wasMidConversation(
  lastMsg: { role: string; content: string } | undefined,
  age: number
): boolean {
  return lastMsg?.role === "user" && age < 600000; // 10 min
}

describe("Session backup file persistence (migrated from sessionStorage)", () => {
  let plugin: InstanceType<typeof Plugin>;

  beforeEach(() => {
    plugin = new (Plugin as any)();
  });

  test("saveSession writes _sessionBackup via plugin.saveData", async () => {
    const state = buildSessionData([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi!" },
    ]);

    // Simulate saveSession
    const data = await plugin.loadData();
    data._sessionBackup = state;
    await plugin.saveData(data);

    // Verify
    const loaded = await plugin.loadData();
    expect(loaded._sessionBackup).toBeDefined();
    expect(loaded._sessionBackup.messages).toHaveLength(2);
    expect(loaded._sessionBackup.messages[0].role).toBe("user");
    expect(loaded._sessionBackup.messages[0].content).toBe("Hello");
  });

  test("restoreSession reads _sessionBackup from plugin.loadData", async () => {
    const state = buildSessionData([
      { role: "user", content: "Test message" },
    ]);

    // Write backup
    const data = await plugin.loadData();
    data._sessionBackup = state;
    await plugin.saveData(data);

    // Read and verify
    const loaded = await plugin.loadData();
    expect(loaded._sessionBackup).toBeDefined();
    expect(loaded._sessionBackup.messages[0].content).toBe("Test message");
  });

  test("clean up removes _sessionBackup from data.json", async () => {
    const state = buildSessionData([{ role: "user", content: "Clean me" }]);

    // Write backup
    const data = await plugin.loadData();
    data._sessionBackup = state;
    await plugin.saveData(data);

    // Simulate cleanup after restore
    const data2 = await plugin.loadData();
    data2._sessionBackup = undefined;
    await plugin.saveData(data2);

    const loaded = await plugin.loadData();
    expect(loaded._sessionBackup).toBeUndefined();
  });

  test("_sessionBackup survives data round-trip alongside settings", async () => {
    // Simulate the plugin's loadSettings pattern:
    // this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    const DEFAULT_SETTINGS = { apiKey: "", providerType: "auto", chatModel: "deepseek-v4-flash" };

    // First, save settings + session backup together
    const state = buildSessionData([{ role: "user", content: "Persist me" }]);
    const initialData = { ...DEFAULT_SETTINGS, apiKey: "sk-test", _sessionBackup: state };
    await plugin.saveData(initialData);

    // loadSettings round-trip
    const merged = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
    expect(merged.apiKey).toBe("sk-test");
    expect(merged._sessionBackup).toBeDefined();

    // saveSettings round-trip (saves this.settings)
    await plugin.saveData(merged);
    const final = await plugin.loadData();
    expect(final._sessionBackup).toBeDefined();
    expect(final._sessionBackup.messages[0].content).toBe("Persist me");
  });

  test("_sessionBackup supports multiple sequential updates", async () => {
    // Simulate periodic saves every 30s
    const msgs1 = [{ role: "user", content: "Message 1" }];
    const msgs2 = [
      { role: "user", content: "Message 1" },
      { role: "assistant", content: "Reply 1" },
    ];

    // Save #1
    let data = await plugin.loadData();
    data._sessionBackup = buildSessionData(msgs1);
    await plugin.saveData(data);

    // Save #2
    data = await plugin.loadData();
    data._sessionBackup = buildSessionData(msgs2);
    await plugin.saveData(data);

    const loaded = await plugin.loadData();
    expect(loaded._sessionBackup.messages).toHaveLength(2);
    expect(loaded._sessionBackup.messages[1].content).toBe("Reply 1");
  });

  test("trims messages to last 20", async () => {
    const manyMsgs: Array<{ role: string; content: string }> = [];
    for (let i = 0; i < 30; i++) {
      manyMsgs.push({ role: i % 2 === 0 ? "user" : "assistant", content: `Message ${i}` });
    }

    const state = buildSessionData(manyMsgs);
    expect(state.messages).toHaveLength(20);
    expect(state.messages[0].content).toBe("Message 10"); // first of last 20
    expect(state.messages[19].content).toBe("Message 29"); // last
  });

  test("truncates very long message content", () => {
    const longContent = "x".repeat(10000);
    const state = buildSessionData([{ role: "user", content: longContent }]);

    expect(state.messages[0].content.length).toBeLessThan(5500); // 2500 + "..." + 2500
    expect(state.messages[0].content).toContain("...");
  });
});

describe("Session TTL and crash recovery logic", () => {
  test("isExpired returns true for ages over 1 hour", () => {
    expect(isExpired(3600001)).toBe(true);
    expect(isExpired(3600000)).toBe(false); // exactly 1 hour
    expect(isExpired(3599999)).toBe(false);
  });

  test("isExpired returns false for recent sessions", () => {
    expect(isExpired(0)).toBe(false);
    expect(isExpired(60000)).toBe(false);
    expect(isExpired(1800000)).toBe(false); // 30 min
  });

  test("wasMidConversation detects user message within 10 min", () => {
    const lastUser = { role: "user", content: "Help me" };
    const lastAssistant = { role: "assistant", content: "Sure" };

    expect(wasMidConversation(lastUser, 0)).toBe(true); // just now
    expect(wasMidConversation(lastUser, 300000)).toBe(true); // 5 min
    expect(wasMidConversation(lastUser, 600000)).toBe(false); // exactly 10 min
    expect(wasMidConversation(lastUser, 600001)).toBe(false); // > 10 min
    expect(wasMidConversation(lastAssistant, 0)).toBe(false); // not a user msg
  });

  test("wasMidConversation returns false when there are no messages", () => {
    expect(wasMidConversation(undefined, 0)).toBe(false);
  });
});

describe("settingsSchema compatibility with extra fields", () => {
  let plugin: InstanceType<typeof Plugin>;

  beforeEach(() => {
    plugin = new (Plugin as any)();
  });

  test("Object.assign preserves _sessionBackup when loading settings", () => {
    const defaults = { apiKey: "", providerType: "auto" };
    const savedData = {
      apiKey: "sk-test",
      providerType: "deepseek",
      _sessionBackup: { messages: [{ role: "user", content: "Hi" }], timestamp: Date.now() },
    };

    const merged = Object.assign({}, defaults, savedData);
    expect(merged._sessionBackup).toBeDefined();
    expect(merged._sessionBackup.messages[0].content).toBe("Hi");
    expect(merged.apiKey).toBe("sk-test");
  });

  test("saveData preserves _sessionBackup when saving settings", async () => {
    // Simulate the plugin pattern: saveData(this.settings)
    // where this.settings contains everything from loadSettings
    const settingsWithBackup = {
      apiKey: "sk-123",
      providerType: "deepseek",
      _sessionBackup: { messages: [{ role: "user", content: "Test" }], timestamp: Date.now() },
    };

    await plugin.saveData(settingsWithBackup);
    const reloaded = await plugin.loadData();
    expect(reloaded._sessionBackup).toBeDefined();
    expect(reloaded.apiKey).toBe("sk-123");
  });
});
