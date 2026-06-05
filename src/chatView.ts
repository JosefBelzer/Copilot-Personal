import { ItemView, WorkspaceLeaf, MarkdownRenderer, Notice } from "obsidian";
import CopilotPlugin from "./main";
import { CopilotSettings } from "./settings";
import { LLMMessage } from "./LLMProviders/types";
import { IndexOperations } from "./search/indexOperations";
import { FileParserManager } from "./tools/FileParserManager";
import { WebSearchClient } from "./services/webSearchClient";
import { AgentEvent } from "./agent/AgentModeRunner";
import { ApplyView } from "./components/ApplyView";
import { ChatHistoryBrowser } from "./components/ChatHistoryBrowser";
import { MAX_MESSAGES_BEFORE_TRIM, MESSAGES_TRIM_KEEP } from "./constants";
import { AutoSaveManager } from "./agent/AutoSaveManager";
import { ToolRouter } from "./agent/ToolRouter";
import { LicenseManager } from "./services/LicenseManager";
import { t } from "./i18n";

export const CHAT_VIEW_TYPE = "copilot-personal-chat-view";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class CopilotChatView extends ItemView {
  private plugin: CopilotPlugin;
  private settings: CopilotSettings;
  private indexOps: IndexOperations;
  private fileParserManager: FileParserManager;
  private messages: ChatMessage[] = [];
  private chatHistoryEl!: HTMLElement;
  private inputEl!: HTMLTextAreaElement;
  private sendBtnEl!: HTMLButtonElement;
  private agentToggleEl!: HTMLButtonElement;
  private statusEl!: HTMLElement;
  private tokenCounterEl!: HTMLElement;
  private chatHistoryBrowser!: ChatHistoryBrowser;
  private applyView!: ApplyView;

  // Control state
  private isGenerating = false;
  private abortController: AbortController | null = null;
  private scrollToBottomPending = false;
  private modelSelectEl!: HTMLSelectElement;
  private thinkingEnabled = false;
  private agentMode = false;
  private stopBtnEl!: HTMLButtonElement;
  private privacyEl!: HTMLElement;
  private tierEl!: HTMLElement;
  private budgetEl!: HTMLElement;
  private _budgetAgentContext: Array<{ role: string; content: string | null; tool_calls?: any[]; tool_call_id?: string }> | null = null;
  private sessionSaveInterval: number | null = null;
  private autoSaveManager!: AutoSaveManager;

  constructor(
    leaf: WorkspaceLeaf,
    plugin: CopilotPlugin,
    settings: CopilotSettings,
    indexOps: IndexOperations,
    fileParserManager: FileParserManager
  ) {
    super(leaf);
    this.plugin = plugin;
    this.settings = settings;
    this.indexOps = indexOps;
    this.fileParserManager = fileParserManager;
    this.agentMode = settings.enableAgentMode;
  }

  getViewType(): string {
    return CHAT_VIEW_TYPE;
  }

  async onClose() {
    // Cleanup session auto-save interval
    if (this.sessionSaveInterval) {
      window.clearInterval(this.sessionSaveInterval);
      this.sessionSaveInterval = null;
    }
    // Final session save
    this.saveSession();
    // Save conversation summary to memory
    if (this.settings.memoryEnabled && this.messages.length > 2) {
      try {
        await this.plugin.memoryManager.summarizeConversation(this.messages);
      } catch (err) {
        console.error("[ChatView] Memory save on close failed:", err);
      }
    }
    // Cleanup any abort controller
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Popout window safety — ensures the view works when moved to a separate window.
   * Uses element.doc / element.win instead of global document/window.
   */
  getDisplayText(): string {
    return "Copilot Personal";
  }

  getIcon(): string {
    return "message-square";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("copilot-chat-container");

    // Load recent memories if enabled
    if (this.settings.memoryEnabled) {
      try {
        const memories = await this.plugin.memoryManager.loadRecentMemories(this.settings.maxMemories);
        if (memories.length > 0) {
          this.addMessage("system", `📝 Loaded ${memories.length} previous summaries.`);
        }
      } catch (err) {
        console.error("[ChatView] Memory load on open failed:", err);
      }
    }

    // Header
    const header = container.createDiv("copilot-chat-header");
    header.createEl("h3", { text: "Copilot Personal" });
    const headerRight = header.createDiv("copilot-header-right");

    const newChatBtn = headerRight.createEl("button", { text: "New", cls: "copilot-header-btn" });
    newChatBtn.title = "Start a new chat";
    newChatBtn.addEventListener("click", () => this.clearChat());

    const saveBtn = headerRight.createEl("button", { text: "Save", cls: "copilot-header-btn" });
    saveBtn.title = "Save chat to file";
    saveBtn.addEventListener("click", () => this.saveChatToFile());

    const historyBtn = headerRight.createEl("button", { text: "History", cls: "copilot-header-btn" });
    historyBtn.title = "Browse saved chats";
    historyBtn.addEventListener("click", () => this.showChatHistory());

    this.modelSelectEl = header.createEl("select", "copilot-model-select");
    this.refreshModelSelector();
    this.modelSelectEl.addEventListener("change", () => {
      this.plugin.settings.chatModel = this.modelSelectEl.value;
      this.plugin.saveSettings();
    });

    // Refresh model selector when tab gets focus
    this.containerEl.addEventListener("focusin", () => this.refreshModelSelector());

    // Status bar
    const statusRow = container.createDiv("copilot-status-row");
    this.statusEl = statusRow.createDiv("copilot-status");
    this.statusEl.setText("Ready");
    this.tokenCounterEl = statusRow.createDiv("copilot-token-counter");
    this.updateTokenCounter();

    // Chat history
    this.chatHistoryEl = container.createDiv("copilot-chat-history");

    // Input area
    const inputArea = container.createDiv("copilot-input-area");
    this.inputEl = inputArea.createEl("textarea", "copilot-input");
    this.inputEl.placeholder = "Type your message... (Enter to send, Shift+Enter for newline)";
    this.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const text = this.inputEl.value.trim();
        const expanded = this.expandSlashCommand(text);
        if (expanded !== text) {
          this.inputEl.value = expanded;
        }
        this.sendMessage();
      }
    });

    this.sendBtnEl = inputArea.createEl("button", { text: "Send", cls: "copilot-send-btn" });
    this.sendBtnEl.addEventListener("click", () => this.sendMessage());

    this.stopBtnEl = inputArea.createEl("button", { text: "Stop", cls: "copilot-stop-btn" });
    this.stopBtnEl.classList.add("copilot-hidden");
    this.stopBtnEl.addEventListener("click", () => this.stopGeneration());

    this.agentToggleEl = inputArea.createEl("button", { text: "Agent", cls: "copilot-agent-toggle" });
    this.agentToggleEl.title = "Toggle agent mode (autonomous tool use)";
    if (this.agentMode) this.agentToggleEl.addClass("copilot-agent-active");
    this.agentToggleEl.addEventListener("click", () => {
      // License gate — Pro only for agent mode
      if (!this.agentMode && !this.plugin.licenseManager.canUseAgent()) {
        this.addMessage("system", "🔒 Agent mode requires a Pro license. Settings → License Key.");
        return;
      }
      this.agentMode = !this.agentMode;
      this.settings.enableAgentMode = this.agentMode;
      this.plugin.saveSettings();
      if (this.agentMode) {
        this.agentToggleEl.addClass("copilot-agent-active");
        this.statusEl.setText("Agent mode ON");
        this.setThinking(false);
      } else {
        this.agentToggleEl.removeClass("copilot-agent-active");
        this.statusEl.setText("Ready");
      }
    });

    const thinkBtn = inputArea.createEl("button", { text: "Think", cls: "copilot-agent-toggle" });
    thinkBtn.title = "Enable thinking mode (model reasons before responding)";
    if (this.settings.enableThinking) thinkBtn.addClass("copilot-agent-active");
    thinkBtn.addEventListener("click", () => {
      this.setThinking(!this.thinkingEnabled);
      this.settings.enableThinking = this.thinkingEnabled;
      this.plugin.saveSettings();
      if (this.thinkingEnabled) thinkBtn.addClass("copilot-agent-active");
      else thinkBtn.removeClass("copilot-agent-active");
    });

    // Privacy indicator + License tier badge — created once, updated dynamically
    this.privacyEl = header.createSpan({ cls: "copilot-privacy-indicator" });
    this.tierEl = header.createSpan({ cls: "copilot-tier-badge" });
    this.budgetEl = header.createSpan({ cls: "copilot-budget-badge" });
    this.updateHeaderBadges();

    // Session auto-save for crash recovery (every 30s)
    this.restoreSession();
    this.sessionSaveInterval = window.setInterval(() => this.saveSession(), 30000);
    window.addEventListener("beforeunload", () => this.saveSession());

    this.chatHistoryBrowser = new ChatHistoryBrowser(this.plugin.app, this.settings.chatHistoryFolder);
    this.applyView = new ApplyView(this.plugin.app);
    this.autoSaveManager = new AutoSaveManager(this.plugin.app);

    // File drop support
    container.addEventListener("dragover", (e) => e.preventDefault());
    container.addEventListener("drop", (e: Event) => {
      e.preventDefault();
      this.handleFileDrop(e as any);
    });

    // Welcome message
    this.addMessage("assistant", "Hello! I'm your personal AI copilot. Ask me anything, or drag notes and files into the chat.");
  }

  private refreshModelSelector() {
    this.modelSelectEl.empty();
    this.populateModelSelector();
    this.modelSelectEl.value = this.plugin.settings.chatModel;
  }

  private populateModelSelector() {
    const select = this.modelSelectEl;
    const s = this.plugin.settings;

    // If detected models exist (from LM Studio), use those
    const detected = s.detectedModels ?? [];
    if (detected.length > 0) {
      detected.forEach((m) => {
        const opt = select.createEl("option", { text: m });
        opt.value = m;
        if (m === s.chatModel) opt.selected = true;
      });
      return;
    }

    // Otherwise show defaults based on provider
    const provider = s.providerType;
    const defaults: Record<string, Array<{ value: string; label: string }>> = {
      deepseek: [
        { value: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
        { value: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
      ],
      openai: [
        { value: "gpt-4o", label: "GPT-4o" },
        { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
        { value: "o3-mini", label: "o3 Mini" },
      ],
      gemini: [
        { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
        { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      ],
      mistral: [
        { value: "mistral-large", label: "Mistral Large" },
        { value: "mistral-small", label: "Mistral Small" },
      ],
      groq: [
        { value: "llama-4-scout", label: "Llama 4 Scout" },
        { value: "mixtral-8x7b", label: "Mixtral 8x7B" },
      ],
      perplexity: [
        { value: "sonar-pro", label: "Sonar Pro" },
        { value: "sonar-reasoning", label: "Sonar Reasoning" },
      ],
      xai: [
        { value: "grok-3", label: "Grok 3" },
      ],
      anthropic: [
        { value: "claude-sonnet-4-0", label: "Claude Sonnet 4" },
        { value: "claude-opus-4-0", label: "Claude Opus 4" },
        { value: "claude-haiku-3-5", label: "Claude Haiku 3.5" },
      ],
      openrouter: [
        { value: "openai/gpt-4o", label: "OpenAI GPT-4o" },
        { value: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4" },
        { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      ],
      lmstudio: [],
      budget: [
        { value: "mistralai/mistral-nemo", label: t("chat.budgetModelLabel") },
      ],
      auto: [
        { value: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
        { value: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
      ],
    };

    const entries = defaults[provider] ?? defaults["auto"];
    entries.forEach((m) => {
      const opt = select.createEl("option", { text: m.label });
      opt.value = m.value;
      if (m.value === s.chatModel) opt.selected = true;
    });
  }

  setInputText(text: string) {
    this.inputEl.value = text;
    this.inputEl.focus();
  }

  private async showChatHistory(): Promise<void> {
    const chats = await this.chatHistoryBrowser.listChats();
    if (chats.length === 0) {
      new Notice("No saved chats found.");
      return;
    }
    this.chatHistoryEl.empty();
    this.addMessage("system", `📂 ${chats.length} saved chats:`);
    for (const chat of chats.slice(0, 10)) {
      this.addMessage("system", `📄 ${chat.title} (${chat.date.toLocaleDateString()})`);
    }
  }

  clearChat() {
    // Save to memory before clearing — clone array to avoid race condition
    if (this.settings.memoryEnabled && this.messages.length > 2) {
      const snapshot = [...this.messages];
      this.plugin.memoryManager.summarizeConversation(snapshot)
        .catch(err => console.error("[ChatView] Memory save on clear failed:", err));
    }
    this.messages = [];
    this.chatHistoryEl.empty();
    // Reset layered context on new chat
    this.plugin.agentRunner.contextLayers.clear();
    this.addMessage("assistant", "Hello! I'm your personal AI copilot. Ask me anything, or drag notes and files into the chat.");
    this.statusEl.setText("New chat started");
  }

  async saveChatToFile() {
    if (this.messages.length === 0) {
      new Notice("No messages to save.");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `Chat ${timestamp}.md`;
    const folder = this.settings.chatHistoryFolder;

    let content = `# Copilot Chat - ${new Date().toLocaleString()}\n\n`;
    for (const msg of this.messages) {
      const roleLabel = msg.role === "user" ? "**You**" : msg.role === "assistant" ? "**Assistant**" : "**System**";
      content += `${roleLabel}:\n${msg.content}\n\n---\n\n`;
    }

    try {
      const folderExists = await this.app.vault.adapter.exists(folder);
      if (!folderExists) {
        await this.app.vault.createFolder(folder);
      }

      const filePath = `${folder}/${fileName}`;
      await this.app.vault.create(filePath, content);
      new Notice(`Chat saved to ${filePath}`);
    } catch (err) {
      new Notice(`Failed to save chat: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  private stopGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isGenerating = false;
    this.sendBtnEl.disabled = false;
    this.stopBtnEl.classList.add("copilot-hidden");
    this.statusEl.setText("Stopped");
  }

  private async sendMessage() {
    const userText = this.inputEl.value.trim();
    if (!userText || this.isGenerating) return;

    // Update header badges from live settings
    this.updateHeaderBadges();

    // Abort any in-flight generation before starting a new one
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Rate limit check (free tier: 50 msgs/day)
    if (!this.plugin.licenseManager.trackMessage()) {
      const limit = this.plugin.licenseManager.getRateLimit();
      this.addMessage("system",
        `⚠️ Daily limit reached (${limit.used}/${limit.limit}). Upgrade to Pro for unlimited messages.`);
      return;
    }

    this.inputEl.value = "";
    this.isGenerating = true;
    this.sendBtnEl.disabled = true;
    this.stopBtnEl.classList.remove("copilot-hidden");
    this.statusEl.setText(this.agentMode ? "Agent thinking..." : "Thinking...");

    this.addMessage("user", userText);

    // Web search gate — Pro only
    if (userText.startsWith("!search")) {
      if (!this.plugin.licenseManager.canUseWebSearch()) {
        this.addMessage("system", "🔒 Web search requires a Pro license. Settings → License Key.");
        this.isGenerating = false;
        this.sendBtnEl.disabled = false;
    this.stopBtnEl.classList.add("copilot-hidden");
    this.stopBtnEl.classList.remove("copilot-show-inline");
        return;
      }
      if (this.settings.webSearchEnabled) {
        await this.handleWebSearch(userText);
      }
    } else if (this.agentMode && this.plugin.agentRunner) {
      // For budget provider, use AgentModeRunner with a BudgetLLMProvider wrapper
      if (this.plugin.settings.providerType === "budget") {
        await this.handleBudgetAgentChat(userText);
      } else {
        await this.handleAgentChat(userText);
      }
    } else if (this.plugin.settings.providerType === "budget" && this.plugin.budgetManager.isEnabled()) {
      await this.handleBudgetChat(userText);
    } else {
      await this.handleChat(userText);
    }

    this.isGenerating = false;
    this.sendBtnEl.disabled = false;
    this.stopBtnEl.classList.add("copilot-hidden");
    this.abortController = null;
    this.statusEl.setText(this.agentMode ? "Agent mode ON" : "Ready");
    this.inputEl.focus();
  }

  private async handleChat(userText: string) {
    const context = await this.buildContext(userText);
    const assistantMsg = this.addMessage("assistant", "");
    const contentEl = assistantMsg.querySelector(".copilot-message-content") as HTMLElement;

    if (!contentEl) return;

    try {
      if (this.settings.streamEnabled) {
        let fullContent = "";
        const gen = this.plugin.providerManager.getActiveProvider().chatStream(context);

        for await (const chunk of gen) {
          if (chunk.done) break;
          fullContent += chunk.content;
          contentEl.empty();
          await this.renderMarkdown(contentEl, fullContent);
          this.scrollToBottom();
        }
        // Save rendered content to messages array for context
        this.messages[this.messages.length - 1].content = fullContent;
      } else {
        const response = await this.plugin.providerManager.getActiveProvider().chat(context);
        contentEl.empty();
        const clean = this.sanitizeAgentResponse(response);
        await this.renderMarkdown(contentEl, clean);
        this.messages[this.messages.length - 1].content = clean;
      }
    } catch (error) {
      contentEl.empty();
      contentEl.setText(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      this.statusEl.setText("Error");
    }

    this.scrollToBottom();
  }

  private async handleAgentChat(userText: string) {
    const toolMsgs: HTMLElement[] = [];
    let writingToolCalled = false;
    let writeCount = 0;
    let progressEl: HTMLElement | null = null;
    let toolStepCount = 0;
    const expectedNotes = (userText.match(/\[\[([^\]]+)\]\]/g)?.length ?? 0); // track if update_note or create_note was actually called

    // Listen for tool events
    const toolListener = (event: AgentEvent) => {
      if (event.type === "tool-start") {
        toolStepCount++;
        // Update or create progress indicator
        if (!progressEl) {
          progressEl = document.createElement("div");
          progressEl.className = "copilot-agent-progress";
          this.chatHistoryEl.appendChild(progressEl);
        }
        progressEl.setText(`⏳ Step ${toolStepCount}: ${event.toolName}...`);
      } else if (event.type === "tool-end") {
        // Track writing tools
        if (event.toolName === "update_note" || event.toolName === "create_note") {
          writingToolCalled = true;
          writeCount++;
        }
        // Update the last tool message status with truncated result data
        const lastTool = toolMsgs[toolMsgs.length - 1];
        if (lastTool) {
          const icon = this.getToolIcon(event.toolName);
          const summary = this.summarizeToolResult(event.toolName, event.data || "");
          const contentEl = lastTool.querySelector(".copilot-message-content");
          if (contentEl) {
            contentEl.empty();
            contentEl.createDiv({ text: `${icon} ${event.toolName}: done` });
            if (summary) {
              const detail = contentEl.createDiv("copilot-tool-result");
              detail.setText(summary);
            }
          }
        }
      }
    };

    this.plugin.agentRunner.on(toolListener);

    try {
      const context = await this.buildContext(userText);
      // Remove the greeting message (first assistant message) from agent context
      const filtered = context.filter(
        (m) =>
          !(
            m.role === "assistant" &&
            m.content.startsWith("Hello! I'm your personal AI copilot")
          )
      );

      const response = await this.plugin.agentRunner.run(
        filtered,
        this.plugin.toolRegistry,
        this.settings.agentMaxIterations,
        userText,
        expectedNotes  // pass expected count so the agent knows the target
      );

      const assistantMsg = this.addMessage("assistant", "");
      const contentEl = assistantMsg.querySelector(".copilot-message-content") as HTMLElement;
      if (contentEl) {
        // Strip hallucinated tool_code blocks from agent responses
        const cleanResponse = this.fixWikiLinks(this.sanitizeAgentResponse(response));

        // Auto-detect <!--save:path--> markers and save the content
        const saveMarker = cleanResponse.match(/<!--save:([^\s>]+)-->/);
        if (saveMarker) {
          const savePath = saveMarker[1];
          const contentToSave = cleanResponse.replace(saveMarker[0], "").trim();
          try {
            // Ensure parent directory exists
            const dir = savePath.includes("/") ? savePath.substring(0, savePath.lastIndexOf("/")) : "";
            if (dir) {
              const dirExists = await this.app.vault.adapter.exists(dir);
              if (!dirExists) {
                await this.app.vault.createFolder(dir);
              }
            }
            const exists = await this.app.vault.adapter.exists(savePath);
            if (exists) {
              // Show diff before overwriting
              try {
                const original = await this.plugin.app.vault.adapter.read(savePath);
                const diff = this.applyView.generateDiff(original, contentToSave);
                const changed = diff.filter(d => d.type !== "unchanged").length;
                if (changed > 0) {
                  this.addMessage("system", `📝 Updated ${savePath} (${changed} lines changed)`);
                }
              } catch (err) {
                console.error("[ChatView] Diff generation failed:", err);
              }
              await this.plugin.app.vault.adapter.write(savePath, contentToSave);
            } else {
              await this.app.vault.create(savePath, contentToSave);
            }
            this.statusEl.setText(`Saved to ${savePath}`);
          } catch (err) {
            this.statusEl.setText(`Save failed: ${err}`);
          }
        }

        // Detect hallucinated completion claims — model says it saved/updated
        // but no write tool was called and no <!--save:--> marker exists.
        const hallucinatedSave = !writingToolCalled && !saveMarker && looksLikeCompletionClaim(cleanResponse);
        let displayResponse = cleanResponse;
        if (hallucinatedSave) {
          displayResponse = `⚠️ **NOTE: The model claimed to have saved/modified a note, but NO write tool (update_note, create_note) or <!--save:--> marker was used. The claim is a hallucination.**\n\n---\n\n${cleanResponse}`;
        }

        // Validate wiki-links: flag any [[link]] that doesn't exist in the vault
        const inventedLinks = this.autoSaveManager.validateWikiLinks(cleanResponse);
        let savedContent = cleanResponse;
        if (inventedLinks.length > 0) {
          // Strip invented links from the saved content
          for (const name of inventedLinks) {
            savedContent = savedContent.replace(
              new RegExp(`\\[\\[${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\|[^\\]]*)?\\]\\]`, 'g'),
              name
            );
          }
          displayResponse = `⚠️ ${inventedLinks.length} invented links removed: ${inventedLinks.join(", ")}\n\n---\n\n${savedContent}`;
        } else {
          displayResponse = savedContent;
        }

        // Detect unsaved note content — model wrote full notes in chat without saving.
        // Auto-save each note section to its corresponding vault file.
        // Uses savedContent (links stripped) not displayResponse (has warning prefix).
        const looksLikeUnsavedNote = !saveMarker && !writingToolCalled &&
          /^#{1,3}\s+\S/m.test(savedContent) && /\[\[.+\]\]/.test(savedContent);
        if (looksLikeUnsavedNote) {
          const sections = this.autoSaveManager.splitNoteSections(savedContent);
          if (sections.length >= 1) {
            const results: string[] = [];

            for (const section of sections) {
              const noteName = section.heading;
              if (!noteName) continue;

              const target = this.autoSaveManager.findNoteByHeading(noteName);
              if (target) {
                try {
                  await this.plugin.app.vault.adapter.write(target.path, section.content);
                  results.push(`✅ ${target.path}`);
                } catch (err) {
                  results.push(`❌ ${target.path}: ${err}`);
                }
              } else {
                results.push(`⚠️ note not found: "${noteName}"`);
              }
            }

            const saved = results.filter(r => r.startsWith("✅")).length;
            writeCount += saved; // count auto-saved notes as successful writes
            displayResponse = `📝 Auto-saved ${saved}/${sections.length} notes:\n${results.join("\n")}\n\n---\n\n${displayResponse}`;
          }
        }

        await this.renderMarkdown(contentEl, displayResponse);
        // After rendering, clean up progress indicator
        if (progressEl) (progressEl as HTMLElement).remove();
        this.messages[this.messages.length - 1].content = displayResponse;

        // Verify task completion: model claims "all done" but write count (tools + auto-save) doesn't match
        if (expectedNotes >= 2 && writeCount < expectedNotes && /(todas|todos|all|complet|listo|done|finished)/i.test(displayResponse)) {
          const missing = expectedNotes - writeCount;
          const warn = this.addMessage("system", `⚠️ Model claims completion but only ${writeCount} of ${expectedNotes} notes were saved. ${missing} missing.`);
          warn.style.color = "var(--text-warning)";
        }
      }
    } catch (error) {
      console.error("Agent run failed, falling back to direct chat:", error);
      // Fallback cascade: if agent mode fails, try simpler direct chat
      try {
        const context = await this.buildContext(userText);
        let response: string;
        if (this.plugin.settings.providerType === "budget" && this.plugin.budgetManager.isEnabled()) {
          const { BudgetLLMProvider } = await import("./LLMProviders/budgetLLMProvider");
          const bp = new BudgetLLMProvider(this.plugin.budgetManager, this.plugin.settings.licenseKey || "");
          response = await bp.chat(context);
        } else {
          response = await this.plugin.providerManager.getActiveProvider().chat(context);
        }
        this.addMessage("assistant", `⚠️ Agent mode failed — fallback response:\n\n${response}`);
      } catch (fallbackErr) {
        this.addMessage("assistant", `Agent error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      this.statusEl.setText("Agent error");
    } finally {
      this.plugin.agentRunner.off(toolListener);
    }

    this.scrollToBottom();
  }

  /**
   * Converts Markdown links to Obsidian wiki-links.
   */
  private fixWikiLinks(text: string): string {
    return text
      // [Note Name](app://obsidian.md/Note%20Name) → [[Note Name]]
      .replace(/\[([^\]]+)\]\(app:\/\/obsidian\.md\/([^)]+)\)/g, (_, label, path) => {
        const decoded = decodeURIComponent(path).replace(/_/g, " ");
        return `[[${decoded}]]`;
      })
      // [Note Name](app://obsidian.md/index.md?file=Note%20Name...) → [[Note Name]]
      .replace(/\[([^\]]+)\]\(app:\/\/obsidian\.md\/index\.md\?file=([^)&]+)/g, (_, label, file) => {
        const decoded = decodeURIComponent(file).replace(/_/g, " ");
        return `[[${decoded}]]`;
      })
      // [Note Name](Note%20Name.md) → [[Note Name]]
      .replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, (_, label, path) => {
        return `[[${path.replace(/\.md$/, "").replace(/%20/g, " ")}]]`;
      })
      // Catch-all: [anything](not-a-url) → [[not-a-url]] if it looks like a note name
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        // Keep web URLs as-is (http://, https://, www., mailto:)
        if (/^(https?:\/\/|www\.|mailto:|ftp:\/\/|#)/i.test(url)) return `[${label}](${url})`;
        // Convert internal links to wiki-links
        const clean = decodeURIComponent(url).replace(/_/g, " ").replace(/\.md$/i, "");
        return `[[${clean}]]`;
      });
  }

  private sanitizeAgentResponse(text: string): string {
    // Aggressively strip any XML/HTML-like tags the model hallucinates.
    // Order matters: complete tags first, then unclosed, then line-level cleanup.
    return text
      .replace(/<tool_code>[\s\S]*?<\/tool_code>/gi, "")
      .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
      .replace(/<environment_details>[\s\S]*?<\/environment_details>/gi, "")
      .replace(/<environment_details>[\s\S]*/gi, "")      // unclosed tag
      .replace(/<tool_code>[\s\S]*/gi, "")                // unclosed tag
      .replace(/<tool_call>[\s\S]*/gi, "")                // unclosed tag
      .replace(/<\/?environment_details>[\s\S]*/gi, "")   // variant with closing slash
      .replace(/^.*<environment_details>.*$/gim, "")       // line containing the tag
      .trim();
  }

  private updateTokenCounter(): void {
    const totalChars = this.messages.reduce((sum, m) => sum + m.content.length, 0);
    const estimatedTokens = Math.ceil(totalChars / 4);
    this.tokenCounterEl.setText(`~${estimatedTokens} tokens`);
    this.tokenCounterEl.className = "copilot-token-counter";
    if (estimatedTokens > 8000) this.tokenCounterEl.addClass("copilot-token-warning");
    if (estimatedTokens > 12000) this.tokenCounterEl.addClass("copilot-token-danger");
  }

  private setLoadingState(phase: string): void {
    const messages: Record<string, string> = {
      reading: "📕 Reading file...",
      searching: "🔍 Searching vault...",
      analyzing: "🖼️ Analyzing image...",
      embedding: "🧮 Generating embeddings...",
      compacting: "📦 Compacting context...",
      thinking: "💭 Thinking...",
    };
    this.statusEl.setText(messages[phase] || phase);
  }
  /**
   * Summarizes tool results for inline display. Shows first line or error status
   * with character count so the user can verify the tool actually returned data.
   */
  private summarizeToolResult(toolName: string, result: string): string {
    if (!result) return "";
    const totalChars = result.length;

    // Error results: show the first line
    if (/^(error|usage):/i.test(result.trim())) {
      return result.split("\n")[0].substring(0, 120);
    }

    // Empty/no-results
    if (totalChars < 10) {
      return result.trim() || "(empty)";
    }

    // For read tools: show first line + char count
    const firstLine = result.split("\n")[0].substring(0, 80);
    const extra = firstLine.length < result.length ? "…" : "";
    return `${firstLine}${extra}  [${totalChars.toLocaleString()} chars]`;
  }

  private getToolIcon(toolName: string): string {
    const icons: Record<string, string> = {
      search_vault_by_timeframe: "📅",
      search_vault_semantic: "🔍",
      find_files: "📁",
      read_note: "📄",
      read_pdf: "📕",
      update_note: "✏️",
      analyze_image: "🖼️",
      extract_youtube_transcript: "📺",
      search_web: "🌐",
      create_note: "📝",
    };
    return icons[toolName] ?? "🔧";
  }

  private setThinking(enabled: boolean) {
    this.thinkingEnabled = enabled;
    // Update all provider configs with the thinking toggle
    const providers = [
      this.plugin.providerManager.getProvider("deepseek"),
      this.plugin.providerManager.getProvider("openai"),
      this.plugin.providerManager.getProvider("anthropic"),
      this.plugin.providerManager.getProvider("lmstudio"),
      this.plugin.providerManager.getProvider("openrouter"),
      this.plugin.providerManager.getProvider("gemini"),
      this.plugin.providerManager.getProvider("mistral"),
      this.plugin.providerManager.getProvider("groq"),
      this.plugin.providerManager.getProvider("perplexity"),
      this.plugin.providerManager.getProvider("xai"),
    ];
    for (const p of providers) {
      if (p) {
        const config = p.config;
        if (config) {
          config.enableThinking = enabled;
        }
      }
    }
    this.statusEl.setText(enabled ? "Thinking ON" : this.agentMode ? "Agent mode ON" : "Ready");
  }

  private async handleWebSearch(userText: string) {
    const query = userText.slice("!search".length).trim();
    if (!query) {
      this.addMessage("assistant", "Please provide a search query after `!search`.");
      return;
    }

    this.statusEl.setText(`Searching the web: "${query}"...`);
    this.addMessage("system", `Searching: ${query}`);

    try {
      const searchClient = WebSearchClient.getInstance(this.settings);
      const response = await searchClient.search(query);
      const formattedResults = searchClient.formatResultsForLLM(response.results);

      // Feed search results as context to the LLM
      const context: LLMMessage[] = [
        {
          role: "system",
          content: `You are a helpful assistant. Use the following web search results to answer the user's question. Search results:\n${formattedResults}`,
        },
        { role: "user", content: query },
      ];

      const assistantMsg = this.addMessage("assistant", "");
      const contentEl = assistantMsg.querySelector(".copilot-message-content") as HTMLElement;
      if (!contentEl) return;

      if (this.settings.streamEnabled) {
        let fullContent = "";
        const gen = this.plugin.providerManager.getActiveProvider().chatStream(context);
        for await (const chunk of gen) {
          if (chunk.done) break;
          fullContent += chunk.content;
          contentEl.empty();
          await this.renderMarkdown(contentEl, fullContent);
          this.scrollToBottom();
        }
        this.messages[this.messages.length - 1].content = fullContent;
      } else {
        const llmResponse = await this.plugin.providerManager.getActiveProvider().chat(context);
        contentEl.empty();
        await this.renderMarkdown(contentEl, llmResponse);
        this.messages[this.messages.length - 1].content = llmResponse;
      }
    } catch (error) {
      this.addMessage("assistant", `Web search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      this.statusEl.setText("Search error");
    }
  }

  private async buildContext(userText: string): Promise<LLMMessage[]> {
    // Prevent unbounded memory growth — trim oldest messages periodically
    if (this.messages.length > MAX_MESSAGES_BEFORE_TRIM) {
      const removed = this.messages.length - MESSAGES_TRIM_KEEP;
      this.messages = [
        { role: "system", content: `[${removed} older messages trimmed to save memory]` },
        ...this.messages.slice(-MESSAGES_TRIM_KEEP),
      ];
    }

    const turns = this.settings.contextTurns * 2;
    const recentMessages = this.messages.slice(-turns);

    let systemContent = "You are a helpful AI assistant integrated into Obsidian. Answer the user's questions clearly and concisely. Use markdown formatting when appropriate.";

    // Add RAG context if semantic search is enabled
    if (this.settings.enableSemanticSearch) {
      try {
        const relevantChunks = await this.indexOps.searchSimilar(userText);
        if (relevantChunks.length > 0) {
          const ragContext = relevantChunks
            .map((c, i) => `[Source ${i + 1}: ${c.path}]\n${c.text}`)
            .join("\n\n");
          systemContent += `\n\nRelevant notes from the user's vault:\n\n${ragContext}\n\nUse this context to help answer the user's question. Cite sources when possible.`;
        }
      } catch (err) {
        console.error("RAG search failed:", err);
      }
    }

    const context: LLMMessage[] = [
      { role: "system", content: systemContent },
    ];

    // Count user messages in the recent window. Only skip the last one
    // if there are MULTIPLE user messages (genuine multi-turn chat), NOT
    // when there's just the initial greeting + one query.
    const userMsgsInWindow = recentMessages.filter(m => m.role === "user");
    const isMultiTurn = userMsgsInWindow.length >= 2;

    for (let i = 0; i < recentMessages.length; i++) {
      const msg = recentMessages[i];
      if (msg.role !== "user" && msg.role !== "assistant") continue;

      // Skip the current user query ONLY in multi-turn chats (2+ user messages).
      // Single-turn (fresh chat or only greeting present): always include the query.
      if (msg.role === "user" && msg === userMsgsInWindow[userMsgsInWindow.length - 1] && isMultiTurn) continue;

      let content = msg.content;

      // Truncate long assistant responses (e.g., full note content from <!--save:-->)
      // to prevent them from dominating the next turn's context window.
      if (msg.role === "assistant" && content.length > 2000) {
        content = content.substring(0, 1000) +
          `\n\n[... ${content.length - 2000} more chars — full content in vault ...]\n\n` +
          content.substring(content.length - 1000);
      }

      context.push({ role: msg.role as "user" | "assistant", content });
    }

    return context;
  }

  /**
   * Update header badges (🔒 Local / ☁️ Cloud + ⭐ Pro / 🆓 Free)
   * from live plugin settings. Called onOpen + every sendMessage.
   */
  public updateHeaderBadges() {
    const s = this.plugin.settings;
    const tier = this.plugin.licenseManager.getTier();

    // Privacy
    if (this.privacyEl) {
      const isLocal = s.providerType === "lmstudio" ||
                      s.apiUrl?.includes("localhost") ||
                      s.apiUrl?.includes("127.0.0.1");
      this.privacyEl.setText(isLocal ? "🔒 Local" : "☁️ Cloud");
      this.privacyEl.title = isLocal
        ? "Data processed locally. Never leaves your device."
        : "Data sent to external server. Check Settings > API Configuration.";
    }

    // License tier
    if (this.tierEl) {
      this.tierEl.setText(tier === "pro" ? "⭐ Pro" : "🆓 Free");
      this.tierEl.title = tier === "pro"
        ? "Pro license active — all features unlocked"
        : "Free tier — 50 messages/day, limited features";
    }

    // Budget badge (Pro only)
    if (this.budgetEl) {
      const bm = this.plugin.budgetManager;
      if (bm.isEnabled() && bm.canUse()) {
        const cached = (bm as any).cachedUsage;
        if (cached) {
          const pct = cached.queryPercent;
          this.budgetEl.setText(`💰 ${cached.dailyQueries}/${cached.limitQueries}`);
          this.budgetEl.title = `${cached.dailyQueries} of ${cached.limitQueries} queries used today · Resets in ${cached.resetsInHours}h`;
          this.budgetEl.className = "copilot-budget-badge" +
            (pct >= 90 ? " copilot-budget-critical" : pct >= 75 ? " copilot-budget-warn" : "");
          this.budgetEl.style.display = "";
        } else {
          this.budgetEl.setText("💰 --/50");
          this.budgetEl.className = "copilot-budget-badge";
          this.budgetEl.style.display = "";
        }
      } else {
        this.budgetEl.style.display = "none";
      }
    }

    // Model selector — refresh when provider changes
    if (this.modelSelectEl) this.refreshModelSelector();
  }

  /**
   * Save current chat session for crash recovery.
   * sessionStorage is used ONLY for temporary crash recovery (cleared on new chat).
   * All persistent data (settings, API keys, license, message counts) uses
   * Obsidian's loadData()/saveData() API as required by review guidelines.
   */
  private saveSession(): void {
    try {
      const msgs = this.messages.map(m => ({ role: m.role, content: m.content.length > 5000 ? m.content.substring(0, 2500) + "..." + m.content.substring(m.content.length - 2500) : m.content }));
      const state = { messages: msgs.slice(-20), timestamp: Date.now() };
      const json = JSON.stringify(state);
      if (json.length > 100000) return; // skip if too large for sessionStorage
      // sessionStorage — temporary crash recovery only
      sessionStorage.setItem("copilot-session-backup", json);
    } catch { /* full or unavailable */ }
  }

  /**
   * Restore the last saved session after a crash or reload.
   */
  private restoreSession(): void {
    try {
      const raw = sessionStorage.getItem("copilot-session-backup");
      if (!raw) return;
      const state = JSON.parse(raw);
      if (!state.messages?.length) return;
      const age = Date.now() - state.timestamp;
      if (age > 3600000) { sessionStorage.removeItem("copilot-session-backup"); return; } // >1h old

      const lastMsg = state.messages[state.messages.length - 1];
      const wasMidConversation = lastMsg?.role === "user" && age < 600000; // 10min

      if (wasMidConversation) {
        this.messages = state.messages;
        for (const m of this.messages) {
          this.addMessage(m.role as "user" | "assistant" | "system", m.content);
        }
        this.addMessage("system", "📝 Previous session restored (crash recovery).");
      }
      sessionStorage.removeItem("copilot-session-backup");
    } catch {
      // Corrupted session data
    }
  }

  // Slash commands — quick prompt templates
  private readonly SLASH_COMMANDS: Record<string, string> = {
    "/summarize": "Summarize the following content concisely, highlighting key points:\n\n",
    "/translate": "Translate the following content to English, preserving formatting and technical terms:\n\n",
    "/explain": "Explain the following concept in detail, with examples and practical applications:\n\n",
    "/toc": "Generate a structured table of contents for the following content:\n\n",
    "/flashcards": "Create 10 Q&A flashcards in Q: ... A: ... format:\n\n",
    "/rewrite": "Rewrite the following content improving clarity, structure, and style:\n\n",
    "/expand": "Expand the following content adding more details, context, and examples:\n\n",
  };

  /**
   * Expand slash commands like "/summarize" into their full prompt template.
   */
  private expandSlashCommand(text: string): string {
    const parts = text.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const template = this.SLASH_COMMANDS[cmd];
    if (template) {
      const rest = parts.slice(1).join(" ");
      return rest ? template + rest : template;
    }
    return text;
  }

  /**
   * Export current chat to Markdown format and save to vault.
   */
  async exportChatMarkdown(): Promise<void> {
    const lines: string[] = [
      `# Copilot Chat — ${new Date().toLocaleString()}`,
      `Messages: ${this.messages.length}\n`,
    ];
    for (const m of this.messages) {
      const role = m.role === "user" ? "👤 User" : m.role === "assistant" ? "🤖 Assistant" : "🔧 System";
      lines.push(`### ${role}`);
      lines.push(m.content);
      lines.push("");
    }
    const md = lines.join("\n");
    const fileName = `copilot-chats/Chat ${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
    try {
      await this.plugin.app.vault.create(fileName, md);
      this.statusEl.setText(`Chat exported to ${fileName}`);
    } catch (err) {
      this.statusEl.setText(`Export failed: ${err}`);
    }
  }

  /**
   * Export current chat to JSON format and save to vault.
   */
  async exportChatJSON(): Promise<void> {
    const data = {
      date: new Date().toISOString(),
      messages: this.messages.map(m => ({ role: m.role, content: m.content })),
    };
    const json = JSON.stringify(data, null, 2);
    const fileName = `copilot-chats/Chat ${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    try {
      await this.plugin.app.vault.create(fileName, json);
      this.statusEl.setText(`Chat exported to ${fileName}`);
    } catch (err) {
      this.statusEl.setText(`Export failed: ${err}`);
    }
  }

  private addMessage(role: "user" | "assistant" | "system", content: string): HTMLElement {
    this.messages.push({ role, content });

    const msgEl = this.chatHistoryEl.createDiv(`copilot-message copilot-message-${role}`);
    msgEl.style.animation = "copilot-fade-in 0.3s ease-out";

    const roleRow = msgEl.createDiv("copilot-message-role-row");

    const avatarEl = roleRow.createSpan("copilot-message-avatar");
    avatarEl.setText(role === "user" ? "👤" : role === "assistant" ? "🤖" : "🔧");

    const roleEl = roleRow.createDiv("copilot-message-role");
    roleEl.setText(role === "user" ? "You" : role === "assistant" ? "Assistant" : "System");

    // Delete button — removes this specific message by its known index
    const msgIndex = this.messages.length - 1; // capture index at creation time
    const delBtn = roleRow.createEl("button", {
      cls: "copilot-delete-msg-btn",
    });
    delBtn.setText("✕");
    delBtn.title = "Delete this message";
    delBtn.addEventListener("click", () => {
      if (msgIndex >= 0 && msgIndex < this.messages.length) {
        this.messages.splice(msgIndex, 1);
      }
      msgEl.remove();
    });

    const contentEl = msgEl.createDiv("copilot-message-content");
    contentEl.setText(content);

    this.scrollToBottom();
    return msgEl;
  }

  private async renderMarkdown(container: HTMLElement, markdown: string) {
    // Sanitize: strip <script> tags and on* event handlers from untrusted sources
    const safe = markdown
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<script[\s\S]*/gi, "")
      .replace(/\bon\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/\bon\w+\s*=\s*'[^']*'/gi, "");
    await MarkdownRenderer.render(
      this.app,
      safe,
      container,
      "",
      this
    );
  }

  private scrollToBottom() {
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
  }

  private async handleFileDrop(event: DragEvent) {
    if (!event.dataTransfer) return;

    const files = event.dataTransfer.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name;
      const ext = name.split(".").pop()?.toLowerCase();

      try {
        if (ext === "pdf") {
          this.statusEl.setText(`Parsing ${name}...`);
          const text = await this.fileParserManager.parseFileFromDrop(file);
          this.inputEl.value = `Regarding this PDF (${name}):\n\n${text}\n\n${this.inputEl.value}`;
          this.statusEl.setText(`PDF parsed: ${name}`);
        } else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext ?? "")) {
          if (this.settings.visionEnabled) {
            const base64 = await this.fileParserManager.parseFileFromDrop(file);
            this.addImageMessage("system", name, base64);
            this.statusEl.setText(`Image ready: ${name}`);
          } else {
            this.addMessage("system", `Image dropped: ${name} (enable vision in settings to analyze images)`);
          }
        } else if (ext === "md") {
          const text = await file.text();
          this.inputEl.value = `Regarding this note (${name}):\n\n${text}\n\n${this.inputEl.value}`;
        } else {
          this.addMessage("system", `File dropped: ${name} (unsupported format)`);
        }
      } catch (err) {
        this.addMessage("system", `Error processing ${name}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }
  }

  private addImageMessage(role: "user" | "assistant" | "system", text: string, imageDataUrl: string) {
    this.messages.push({ role, content: `[Image: ${text}]` });

    const msgEl = this.chatHistoryEl.createDiv(`copilot-message copilot-message-${role}`);

    const roleEl = msgEl.createDiv("copilot-message-role");
    roleEl.setText(text);

    const contentEl = msgEl.createDiv("copilot-message-content");
    const img = contentEl.createEl("img", { cls: "copilot-image-preview" });
    img.src = imageDataUrl;
    img.alt = text;
    img.classList.add("copilot-img-preview");

    this.scrollToBottom();
  }

  /** Budget AI chat — simple chat proxied through Worker (no agent, no tools). */
  private async handleBudgetChat(userText: string) {
    const turns = this.settings.contextTurns || 4;
    const messages: Array<{ role: string; content: string }> = [];
    messages.push({ role: "system", content: "You are a helpful AI assistant. Answer concisely." });
    for (const m of this.messages.slice(-turns * 2)) {
      if (m.role !== "system") messages.push({ role: m.role, content: m.content.substring(0, 2000) });
    }
    messages.push({ role: "user", content: userText });
    const assistantMsg = this.addMessage("assistant", "");
    const contentEl = assistantMsg.querySelector(".copilot-message-content") as HTMLElement;
    if (!contentEl) return;
    try {
      const licenseKey = this.plugin.settings.licenseKey || "";
      const fp = LicenseManager.getFingerprint();
      if (this.plugin.settings.streamEnabled) {
        let fullContent = "";
        const gen = this.plugin.budgetManager.chatStream(messages, licenseKey, fp);
        for await (const chunk of gen) { if (chunk.done) break; fullContent += chunk.content; contentEl.empty(); await this.renderMarkdown(contentEl, fullContent); this.scrollToBottom(); }
        this.messages[this.messages.length - 1].content = fullContent;
      } else {
        const result = await this.plugin.budgetManager.chat(messages, licenseKey, fp);
        contentEl.empty(); await this.renderMarkdown(contentEl, result.content);
        this.messages[this.messages.length - 1].content = result.content;
      }
    } catch (error) {
      contentEl.empty(); contentEl.setText(error instanceof Error ? error.message : String(error));
      this.statusEl.setText(t("chat.statusError"));
    }
    this.isGenerating = false; this.sendBtnEl.disabled = false; this.stopBtnEl.style.display = "none";
    this.statusEl.setText(t("chat.statusReady")); this.inputEl.focus(); this.scrollToBottom(); this.updateHeaderBadges();
  }

  /** Budget agent chat — tool-calling loop proxied through Worker with native tool calling. */
  private async handleBudgetAgentChat(userText: string) {
    const licenseKey = this.plugin.settings.licenseKey || "";
    const fp = LicenseManager.getFingerprint();
    const maxIter = this.settings.agentMaxIterations || 5;
    const messages: Array<{ role: string; content: string | null; tool_calls?: any[]; tool_call_id?: string }> = [];

    if (this._budgetAgentContext && this._budgetAgentContext.length > 0) {
      for (const m of this._budgetAgentContext) { if (m.role !== "system") messages.push({ ...m }); }
    } else {
      const toolInstructions = this.plugin.toolRegistry?.getAllTools?.()?.filter(t => t.customPromptInstructions)?.map(t => t.customPromptInstructions)?.filter(Boolean) || [];
      if (toolInstructions.length > 0) messages.push({ role: "system", content: toolInstructions.join("\n---\n") });
      messages.push({ role: "system", content: "You are a tool-using agent inside Obsidian. Use [[wikilinks]] to connect notes — no special tool needed. Use create_note or update_note with [[links]] in the content." });
      for (const m of this.messages.slice(-this.settings.contextTurns * 2)) { if (m.role !== "system") messages.push({ role: m.role, content: m.content }); }
    }
    messages.push({ role: "user", content: userText });

    const toolDefs = this.plugin.toolRegistry?.getAllTools?.() || [];
    const toolMap = new Map(toolDefs.map((t: any) => [t.name, t]));
    const router = new ToolRouter(null, toolMap);
    const routed = await router.route(userText);
    const tools = routed.tools;
    const assistantMsg = this.addMessage("assistant", "");
    const contentEl = assistantMsg.querySelector(".copilot-message-content") as HTMLElement;
    if (!contentEl) return;
    this.statusEl.setText(t("chat.statusAgentThinking"));
    let fullContent = "", iteration = 0;

    try {
      while (iteration < maxIter) {
        iteration++;
        const result = await this.plugin.budgetManager.chat(
          messages.map(m => { const item: any = { role: m.role, content: m.content || "" }; if (m.tool_calls) item.tool_calls = m.tool_calls; if (m.tool_call_id) item.tool_call_id = m.tool_call_id; return item; }),
          licenseKey, fp, tools
        );
        if (result.content && !result.toolCalls) { fullContent += result.content; contentEl.empty(); await this.renderMarkdown(contentEl, fullContent); break; }
        if (result.toolCalls) {
          for (const tc of result.toolCalls) {
            const toolName = tc.function?.name; const args = tc.function?.arguments ? JSON.parse(tc.function.arguments) : {};
            try {
              // Skip hallucinated tools that don't exist
              if (!this.plugin.toolRegistry?.getTool(toolName)) {
                console.log(`[Budget Agent] Skipping unknown tool: ${toolName}`);
                continue;
              }
              // Auto-find: silently resolve file paths before executing file tools
              if (args.path && ["read_pdf", "read_note", "render_pdf_pages", "extract_pdf_images"].includes(toolName)) {
                const fileName = args.path.replace(/#page.*|\.md$/, "").split("/").pop() || args.path;
                const searchResult = await this.plugin.toolRegistry?.executeTool("find_files", { nameQuery: fileName }) || "";
                if (searchResult && !searchResult.includes("No files found")) {
                  const correctPath = searchResult.split("\n")[0].trim();
                  if (correctPath !== args.path) args.path = correctPath;
                }
              }
              let resultStr = await this.plugin.toolRegistry?.executeTool(toolName, args) || "";
              const toolCallId = (tc as any).id || `call_${toolName}_${Date.now()}`;
              (messages as any).push({ role: "assistant", content: null, tool_calls: [tc] });
              (messages as any).push({ role: "tool", tool_call_id: toolCallId, content: resultStr.substring(0, 4000) });
              const toolMsg = this.addMessage("system", `🔧 ${toolName}: ${resultStr.substring(0, 200)}`); setTimeout(() => toolMsg?.remove(), 15000);
            } catch (err) {
              const toolCallId = (tc as any).id || `call_${toolName}_${Date.now()}`;
              (messages as any).push({ role: "assistant", content: null, tool_calls: [tc] });
              (messages as any).push({ role: "tool", tool_call_id: toolCallId, content: `Error: ${err instanceof Error ? err.message : String(err)}` });
            }
          }
        } else break;
      }
      if (iteration >= maxIter) this.addMessage("system", t("agent.maxIterationsReached"));
    } catch (err) { contentEl.empty(); contentEl.setText(`Budget agent error: ${err instanceof Error ? err.message : String(err)}`); this.statusEl.setText(t("chat.statusError")); }

    this._budgetAgentContext = messages;
    this.messages[this.messages.length - 1].content = fullContent || "(no response)";
    this.isGenerating = false; this.sendBtnEl.disabled = false; this.stopBtnEl.style.display = "none";
    this.statusEl.setText(t("chat.statusReady")); this.inputEl.focus(); this.scrollToBottom(); this.updateHeaderBadges();
  }

  /** Refresh all translatable UI elements when language changes. */
  public refreshLanguage(): void {
    this.updateHeaderBadges();
    const btns = this.containerEl.querySelectorAll(".copilot-header-btn");
    if (btns[0]) { btns[0].textContent = t("chat.btnNew"); btns[0].setAttribute("title", t("chat.newChatTooltip")); }
    if (btns[1]) { btns[1].textContent = t("chat.btnSave"); btns[1].setAttribute("title", t("chat.saveChatTooltip")); }
    if (btns[2]) { btns[2].textContent = t("chat.btnHistory"); btns[2].setAttribute("title", t("chat.browseHistoryTooltip")); }
    const sendBtn = this.containerEl.querySelector(".copilot-send-btn"); if (sendBtn) sendBtn.textContent = t("chat.btnSend");
    const stopBtn = this.containerEl.querySelector(".copilot-stop-btn"); if (stopBtn) stopBtn.textContent = t("chat.btnStop");
    const agentBtn = this.containerEl.querySelector(".copilot-agent-toggle"); if (agentBtn) { agentBtn.textContent = t("chat.btnAgent"); agentBtn.setAttribute("title", t("chat.agentToggleTooltip")); }
    const input = this.containerEl.querySelector(".copilot-input") as HTMLTextAreaElement; if (input) input.placeholder = t("chat.sendPlaceholder");
  }

} // end CopilotChatView

/**
 * Detects hallucinated completion claims in agent responses.
 * The model says it created/updated/saved a note but no write tool was called.
 * These patterns indicate the model is fabricating completion.
 */
function looksLikeCompletionClaim(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();

  // Spanish patterns
  if (/\b(ha\s+sido\s+(actualizada|creada|modificada|guardada|escrita|completada|generada|renombrada))\b/i.test(text)) return true;
  if (/\b(la\s+nota\s+(ha\s+sido|fue|est[aá])\s+(actualizada|creada|modificada|guardada))\b/i.test(text)) return true;
  if (/\b(ahora\s+deber[ií]as?\s+ver\s+(los\s+cambios|el\s+resultado|la\s+actualizaci[oó]n))\b/i.test(text)) return true;
  if (/\b(los\s+cambios\s+(est[áa]n|fueron|han\s+sido)\s+(reflejados|aplicados|realizados|guardados))\b/i.test(text)) return true;
  if (/\b(actualizaci[oó]n\s+(completada|exitosa|realizada|finalizada))\b/i.test(text)) return true;

  // English patterns
  if (/\b(has\s+been\s+(updated|created|modified|saved|written|completed|generated))\b/i.test(text)) return true;
  if (/\b(the\s+note\s+(has\s+been|was|is\s+now)\s+(updated|created|modified|saved))\b/i.test(text)) return true;
  if (/\b(you\s+should\s+now\s+see\s+(the\s+changes|the\s+result|the\s+update))\b/i.test(text)) return true;
  if (/\b(changes\s+(are|have\s+been|were)\s+(reflected|applied|made|saved))\b/i.test(text)) return true;
  if (/\b(update\s+complete|successfully\s+(updated|saved|created))\b/i.test(text)) return true;

  return false;
}
