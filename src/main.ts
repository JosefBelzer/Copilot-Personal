import { CopilotSettings, DEFAULT_SETTINGS } from "./settings";
import { CopilotChatView, CHAT_VIEW_TYPE } from "./chatView";
import { CopilotSettingTab } from "./settingsTab";
import { ProviderManager } from "./LLMProviders/providerManager";
import { VectorStoreManager } from "./search/vectorStoreManager";
import { IndexOperations } from "./search/indexOperations";
import { IndexEventHandler } from "./search/indexEventHandler";
import { FileParserManager } from "./tools/FileParserManager";
import { WebSearchClient } from "./services/webSearchClient";
import { ToolRegistry } from "./agent/ToolRegistry";
import { AgentModeRunner } from "./agent/AgentModeRunner";
import { createTimeSearchTool } from "./tools/timeSearchTool";
import { createSemanticSearchTool } from "./tools/semanticSearchTool";
import { createImageAnalysisTool } from "./tools/imageAnalysisTool";
import { createYoutubeTranscriptTool } from "./tools/youtubeTranscriptTool";
import { createWebSearchTool } from "./tools/webSearchTool";
import { createCreateNoteTool } from "./tools/createNoteTool";
import { createFileSearchTool } from "./tools/fileSearchTool";
import { createReadNoteTool } from "./tools/readNoteTool";
import { createUpdateNoteTool } from "./tools/updateNoteTool";
import { createReadPdfTool } from "./tools/readPdfTool";
import { createRenderPdfPagesTool } from "./tools/renderPdfPagesTool";
import { createExtractPdfImagesTool } from "./tools/extractPdfImagesTool";
import { createListNotesTool, createFulltextSearchTool, createVaultStatsTool, createGetActiveFileTool, createGetFrontmatterTool } from "./tools/additionalTools";
import { MemoryManager } from "./memory/MemoryManager";
import { LicenseManager } from "./services/LicenseManager";
import { BudgetManager } from "./services/BudgetManager";
import { Plugin, WorkspaceLeaf, Notice, Modal, MarkdownRenderer } from "obsidian";
import { t } from "./i18n";

export default class CopilotPlugin extends Plugin {
  settings!: CopilotSettings;
  providerManager!: ProviderManager;
  vectorStoreManager!: VectorStoreManager;
  indexOperations!: IndexOperations;
  indexEventHandler!: IndexEventHandler;
  fileParserManager!: FileParserManager;
  webSearchClient!: WebSearchClient;
  toolRegistry!: ToolRegistry;
  agentRunner!: AgentModeRunner;
  memoryManager!: MemoryManager;
  licenseManager!: LicenseManager;
  budgetManager!: BudgetManager;

  async onload() {
    await this.loadSettings();

    // Migrate legacy apiKey to per-provider keys for backward compatibility
    this.migrateLegacyApiKey();

    // Initialize i18n with user's language preference
    const { setLanguage } = await import("./i18n");
    setLanguage(this.settings.language as any);
    console.log(`[i18n] Language set to: ${this.settings.language}`);

    this.providerManager = new ProviderManager(this.settings);
    const llmProvider = this.providerManager.getProviderFor("embeddings");

    // Initialize semantic search
    const vaultPath = (this.app.vault.adapter as any).getBasePath?.() ?? "";
    this.vectorStoreManager = VectorStoreManager.getInstance();
    this.vectorStoreManager.configure(llmProvider, this.settings, vaultPath, this.app.vault.adapter);
    await this.vectorStoreManager.loadIndex();

    this.indexOperations = new IndexOperations(
      this.app.vault,
      this.vectorStoreManager,
      llmProvider,
      this.settings
    );

    this.fileParserManager = new FileParserManager(this.app.vault);

    this.webSearchClient = WebSearchClient.getInstance(this.settings);

    // Initialize agent system
    this.toolRegistry = ToolRegistry.getInstance();
    this.registerAgentTools();

    this.agentRunner = new AgentModeRunner(this.providerManager.getActiveProvider());

    this.memoryManager = new MemoryManager(this.app, this.settings.memoryFolder);

    // License manager — activates free tier by default, applies restrictions
    this.licenseManager = new LicenseManager();
    this.licenseManager.storeFingerprint(this.settings._licenseFingerprint ?? null);
    await this.licenseManager.activate(this.settings.licenseKey || "FREE");
    this.settings = this.licenseManager.applyRestrictions(this.settings);
    // Save fingerprint for device binding
    this.settings._licenseFingerprint = this.licenseManager.getStoredFingerprint();
    await this.saveSettings();
    // Persist message count across plugin reloads
    this.licenseManager.restoreMessageCount(this.settings._messageCount ?? null);
    this.licenseManager.setPersistence(
      () => {
        this.settings._messageCount = this.licenseManager.getPersistableState();
        this.saveSettings(); // fire-and-forget — Obsidian's saveData is fast
        return this.settings._messageCount as { count: number; day: string };
      },
      (data) => { if (data) this.settings._messageCount = data; }
    );

    // Budget manager — bundled API for Pro users (tracking server-side in Worker KV)
    this.budgetManager = new BudgetManager();
    this.budgetManager.setEnabled(this.licenseManager.getTier() === "pro");

    // Store as property so we can unregister on unload
    this.indexEventHandler = new IndexEventHandler(this.app.vault, this.indexOperations);

    this.registerView(CHAT_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
      return new CopilotChatView(leaf, this, this.settings, this.indexOperations, this.fileParserManager);
    });

    this.addSettingTab(new CopilotSettingTab(this.app, this));

    this.addRibbonIcon("message-square", t("chat.title"), () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-copilot-chat",
      name: t("commands.openChat"),
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: "send-selection-to-copilot",
      name: t("commands.sendSelection"),
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (selection) {
          this.activateView();
          const view = this.getChatView();
          if (view) {
            view.setInputText(selection);
          }
        } else {
          new Notice(t("notices.noTextSelected"));
        }
      },
    });

    // RAG commands
    this.addCommand({
      id: "index-vault",
      name: t("commands.indexVault"),
      callback: async () => {
        new Notice(t("notices.indexingVault"));
        try {
          await this.indexOperations.indexVaultToVectorStore((current, total) => {
            if (current % 10 === 0 || current === total) {
              new Notice(t("notices.indexingProgress", { current, total }));
            }
          });

          // Verify the index has valid vectors
          const isEmpty = await this.vectorStoreManager.isIndexEmpty();
          if (isEmpty && !this.vectorStoreManager.wasLoaded()) {
            new Notice(t("notices.indexCorrupted"), 8000);
          } else if (isEmpty) {
            new Notice(t("notices.indexEmpty"));
          } else {
            const chunks = this.vectorStoreManager.getChunks();
            const sampleVector = chunks[0]?.vector;
            if (!sampleVector || sampleVector.length === 0 || sampleVector.every((n) => n === 0)) {
              new Notice(
                t("notices.indexEmptyVectors"),
                10000
              );
            } else {
              new Notice(t("notices.indexComplete", { chunks: chunks.length }));
            }
          }
        } catch (err) {
          new Notice(t("notices.indexFailed", { error: String(err) }));
          console.error(err);
        }
      },
    });

    this.addCommand({
      id: "clear-index",
      name: t("commands.clearIndex"),
      callback: async () => {
        await this.vectorStoreManager.clearIndex();
        new Notice(t("notices.indexCleared"));
      },
    });

    // Chat management commands
    this.addCommand({
      id: "new-chat",
      name: t("commands.newChat"),
      callback: () => {
        const view = this.getChatView();
        if (view) {
          view.clearChat();
        } else {
          this.activateView();
        }
      },
    });

    this.addCommand({
      id: "save-chat",
      name: t("commands.saveChat"),
      callback: () => {
        const view = this.getChatView();
        if (view) {
          view.saveChatToFile();
        }
      },
    });

    // Quick Ask command
    this.addCommand({
      id: "quick-ask",
      name: t("commands.quickAsk"),
      callback: () => this.quickAsk(),
    });

    // Export commands
    this.addCommand({
      id: "export-chat-md",
      name: t("commands.exportMd"),
      callback: () => {
        const view = this.getChatView();
        if (view) view.exportChatMarkdown();
      },
    });

    this.addCommand({
      id: "export-chat-json",
      name: t("commands.exportJson"),
      callback: () => {
        const view = this.getChatView();
        if (view) view.exportChatJSON();
      },
    });
  }

  onunload(): void {
    // Clean up event listeners to prevent leaks on reload
    this.indexEventHandler?.unregister();
    // Save index before unloading — fire and forget to match Obsidian's void return type
    this.vectorStoreManager.saveIndex();
    // Detaching leaves on unload resets the leaf to its default location,
    // which is not recommended. Let Obsidian manage the workspace.
    // await this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
    // Reset singletons so fresh instances are created on next load
    ToolRegistry.resetInstance();
    VectorStoreManager.resetInstance();
    WebSearchClient.resetInstance();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  /** Migrate legacy single apiKey to the current provider's per-provider key */
  private migrateLegacyApiKey(): void {
    if (!this.settings.apiKey) return;
    const provider = this.settings.providerType === "auto" ? "deepseek" : this.settings.providerType;
    const keyField = `${provider}ApiKey` as keyof CopilotSettings;
    if (!this.settings[keyField]) {
      (this.settings as any)[keyField] = this.settings.apiKey;
      // Also save after migration
      this.saveData(this.settings);
      console.log(`[Migrate] Legacy apiKey copied to ${keyField}`);
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.providerManager.updateSettings(this.settings);
    this.webSearchClient.updateSettings(this.settings);

    // Refresh chat view header badges (privacy icon + tier badge)
    const chatView = this.getChatView();
    if (chatView) chatView.updateHeaderBadges();
  }

  private registerAgentTools() {
    // Clear previous registrations (on reload)
    // Register all tools fresh
    this.toolRegistry.register(createTimeSearchTool(this.app));
    this.toolRegistry.register(
      createSemanticSearchTool(this.indexOperations, this.settings)
    );
    this.toolRegistry.register(createImageAnalysisTool(this.app, this.providerManager));
    this.toolRegistry.register(createYoutubeTranscriptTool());
    this.toolRegistry.register(createWebSearchTool(this.webSearchClient));
    this.toolRegistry.register(createCreateNoteTool(this.app));
    this.toolRegistry.register(createFileSearchTool(this.app));
    this.toolRegistry.register(createReadNoteTool(this.app));
    this.toolRegistry.register(createUpdateNoteTool(this.app));
    this.toolRegistry.register(createReadPdfTool(this.app));
    this.toolRegistry.register(createRenderPdfPagesTool(this.app));
    this.toolRegistry.register(createExtractPdfImagesTool(this.app));
    this.toolRegistry.register(createListNotesTool(this.app));
    this.toolRegistry.register(createFulltextSearchTool(this.app));
    this.toolRegistry.register(createVaultStatsTool(this.app));
    this.toolRegistry.register(createGetActiveFileTool(this.app));
    this.toolRegistry.register(createGetFrontmatterTool(this.app));
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(CHAT_VIEW_TYPE);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type: CHAT_VIEW_TYPE, active: true });
      }
    }

    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  getChatView(): CopilotChatView | null {
    const leaves = this.app.workspace.getLeavesOfType(CHAT_VIEW_TYPE);
    if (leaves.length > 0) {
      return leaves[0].view as CopilotChatView;
    }
    return null;
  }

  async quickAsk(): Promise<void> {
    const modal = new Modal(this.app);
    modal.titleEl.setText(t("quickAsk.title"));
    const inputEl = modal.contentEl.createEl("textarea", { cls: "copilot-input copilot-input-tall copilot-input-full" });
    inputEl.placeholder = t("quickAsk.placeholder");

    const btnEl = modal.contentEl.createEl("button", { text: t("quickAsk.btnAsk"), cls: "copilot-send-btn" });
    const resultEl = modal.contentEl.createEl("div", { cls: "copilot-message-content" });

    btnEl.addEventListener("click", async () => {
      const query = inputEl.value.trim();
      if (!query) return;
      if (!this.licenseManager.trackMessage()) {
        new Notice(t("license.dailyLimitReached"));
        return;
      }
      btnEl.disabled = true;
      btnEl.setText(t("quickAsk.btnThinking"));
      try {
        const response = await this.providerManager.getActiveProvider().chat([
          { role: "system", content: "Be concise and helpful." },
          { role: "user", content: query },
        ]);
        resultEl.empty();
        await MarkdownRenderer.render(this.app, response, resultEl, "", {} as any);
      } catch (err) {
        resultEl.setText(t("quickAsk.error", { error: String(err) }));
      }
      btnEl.disabled = false;
      btnEl.setText(t("quickAsk.btnAsk"));
    });

    modal.open();
  }
}
