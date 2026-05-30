import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import CopilotPlugin from "./main";
import { LmStudioService } from "./services/lmStudioService";
import { PROVIDER_CAPABILITIES, ProviderType } from "./LLMProviders/providerTypes";
import { getApiKeyForProvider, setApiKeyForProvider } from "./settings";

export class CopilotSettingTab extends PluginSettingTab {
  plugin: CopilotPlugin;

  private getCaps() {
    const pt = this.plugin.settings.providerType;
    return PROVIDER_CAPABILITIES[pt] || PROVIDER_CAPABILITIES.auto;
  }

  /** Whether the current license is Pro */
  private isPro(): boolean {
    return this.plugin.licenseManager.getTier() === "pro";
  }

  constructor(app: App, plugin: CopilotPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Copilot Personal - Settings" });

    // Always enforce license restrictions before rendering
    this.plugin.settings = this.plugin.licenseManager.applyRestrictions(this.plugin.settings);

    // License tier + provider capabilities — determines what UI controls are enabled
    const isPro = this.isPro();
    const caps = this.getCaps();

    // === API Configuration ===
    containerEl.createEl("h3", { text: "API Configuration" });

    const currentProvider = this.plugin.settings.providerType === "auto"
      ? "deepseek" // fallback display
      : this.plugin.settings.providerType;
    const currentApiKey = getApiKeyForProvider(this.plugin.settings, currentProvider);

    new Setting(containerEl)
      .setName("API Key")
      .setDesc(`Your API key for ${currentProvider === "lmstudio" ? "LM Studio" : this.plugin.settings.providerType} (stored in data.json — NOT encrypted. Do NOT commit to Git.)`)
      .addText((text) => {
        text.inputEl.type = "password";
        text
          .setPlaceholder("sk-...")
          .setValue(currentApiKey)
          .onChange(async (value) => {
            setApiKeyForProvider(this.plugin.settings, currentProvider, value);
            await this.plugin.saveSettings();
          });
      });

    // License key field — with explicit deactivate button
    const activateLicense = async (value: string) => {
      this.plugin.settings.licenseKey = value;
      const key = value.trim() || "FREE";
      const result = await this.plugin.licenseManager.activate(key);
      this.plugin.settings = this.plugin.licenseManager.applyRestrictions(this.plugin.settings);
      await this.plugin.saveSettings();
      if (result.error) {
        new Notice(`⚠️ ${result.error}`);
      } else if (result.tier === "pro" && key !== "FREE") {
        new Notice("✅ Pro license activated successfully.");
      } else {
        new Notice("🆓 Free mode activated.");
      }
      this.display();
    };

    new Setting(containerEl)
      .setName("License Key")
      .setDesc("Pro license key from Lemon Squeezy. Leave empty for Free tier.")
      .addText((text) => {
        text
          .setPlaceholder("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")
          .setValue(this.plugin.settings.licenseKey || "")
          .onChange(async (value) => {
            await activateLicense(value);
          });
      })
      .addExtraButton((btn) => {
        btn
          .setIcon("trash")
          .setTooltip("Clear license (revert to Free)")
          .onClick(async () => {
            await activateLicense("");
          });
      });

    new Setting(containerEl)
      .setName("API URL")
      .setDesc("Base URL for the API endpoint")
      .addText((text) =>
        text
          .setPlaceholder("https://api.deepseek.com")
          .setValue(this.plugin.settings.apiUrl)
          .onChange(async (value) => {
            this.plugin.settings.apiUrl = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Provider")
      .setDesc("Select the LLM provider")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("auto", "Auto-detect (from URL)")
          .addOption("deepseek", "DeepSeek")
          .addOption("openai", "OpenAI")
          .addOption("anthropic", "Anthropic")
          .addOption("openrouter", "OpenRouter")
          .addOption("lmstudio", "LM Studio")
          .addOption("gemini", "Google Gemini")
          .addOption("mistral", "Mistral")
          .addOption("groq", "Groq")
          .addOption("perplexity", "Perplexity")
          .addOption("xai", "xAI Grok")
          .setValue(this.plugin.settings.providerType)
          .onChange(async (value) => {
            this.plugin.settings.providerType = value as ProviderType;

            // Auto-update API URL for known providers
            const defaultUrls: Record<string, string> = {
              deepseek: "https://api.deepseek.com",
              openai: "https://api.openai.com/v1",
              anthropic: "https://api.anthropic.com",
              openrouter: "https://openrouter.ai/api/v1",
              lmstudio: "http://localhost:1234/v1",
              gemini: "https://generativelanguage.googleapis.com/v1beta",
              mistral: "https://api.mistral.ai/v1",
              groq: "https://api.groq.com/openai/v1",
              perplexity: "https://api.perplexity.ai",
              xai: "https://api.x.ai/v1",
            };

            if (value !== "auto" && defaultUrls[value]) {
              this.plugin.settings.apiUrl = defaultUrls[value];
              if (value === "lmstudio") {
                this.plugin.settings.lmStudioUrl = defaultUrls[value];
              }
            }

            // Clear detected models when switching away from LM Studio
            if (value !== "lmstudio" && value !== "auto") {
              this.plugin.settings.detectedModels = [];
            }

            // Set sensible default model for this provider
            const providerModels: Record<string, string> = {
              deepseek: "deepseek-v4-flash",
              openai: "gpt-4o",
              anthropic: "claude-sonnet-4-0",
              openrouter: "openai/gpt-4o",
              lmstudio: this.plugin.settings.chatModel,
              gemini: "gemini-2.5-flash",
              mistral: "mistral-large",
              groq: "llama-4-scout",
              perplexity: "sonar-pro",
              xai: "grok-3",
            };
            if (providerModels[value]) {
              this.plugin.settings.chatModel = providerModels[value];
            }

            await this.plugin.saveSettings();
            // Re-render to show updated URL in the text field above
            this.display();
          })
      );

    // === LM Studio Model Detection ===
    const lmSection = containerEl.createEl("div");
    lmSection.createEl("h4", { text: "LM Studio - Detect Models" });

    const lmStatusEl = lmSection.createEl("div", {
      text: "Click 'Detect' to fetch available models from LM Studio.",
      cls: "copilot-setting-hint",
    });
    lmStatusEl.style.fontSize = "12px";
    lmStatusEl.style.color = "var(--text-muted)";
    lmStatusEl.style.marginBottom = "8px";

    new Setting(lmSection)
      .setName("Detect models")
      .setDesc("Query LM Studio's /v1/models endpoint to discover loaded models")
      .addButton((btn) =>
        btn
          .setButtonText("Detect")
          .onClick(async () => {
            try {
              // Use dedicated LM Studio URL, NOT the main apiUrl (which could be DeepSeek/etc.)
              const url = this.plugin.settings.lmStudioUrl;
              // Send lmStudioApiKey (or none) — do NOT send the main apiKey
              const apiKey = this.plugin.settings.lmStudioApiKey || undefined;

              lmStatusEl.setText("Querying LM Studio...");
              const models = await LmStudioService.fetchModels(url, apiKey);

              if (models.length === 0) {
                lmStatusEl.setText("No models found. Load a model in LM Studio first.");
                return;
              }

              // Store the full model list so dropdowns are rendered
              this.plugin.settings.detectedModels = models;
              // Set default models (user can change via dropdowns after re-render)
              this.plugin.settings.chatModel = models[0];
              this.plugin.settings.embeddingModel = models.find((m: string) =>
                m.toLowerCase().includes("embed") || m.toLowerCase().includes("nomic")
              ) ?? models[0];
              this.plugin.settings.visionModel = models.find((m: string) =>
                m.toLowerCase().includes("vl") || m.toLowerCase().includes("vision") || m.toLowerCase().includes("qwenvl")
              ) ?? models[0];
              this.plugin.settings.lmStudioModel = this.plugin.settings.visionModel;
              // If provider is LM Studio or auto-detect, sync the main apiUrl too
              if (
                this.plugin.settings.providerType === "lmstudio" ||
                (this.plugin.settings.providerType === "auto" &&
                  !this.plugin.settings.apiUrl.includes("localhost"))
              ) {
                this.plugin.settings.apiUrl = url;
                this.plugin.settings.providerType = "lmstudio";
              }
              await this.plugin.saveSettings();

              lmStatusEl.setText(
                `Found ${models.length} model(s): ${models.join(", ")}`
              );
              new Notice(`Found ${models.length} model(s) in LM Studio. First model (${models[0]}) set as default.`);

              // Re-render to update the model text fields
              this.display();
            } catch (err) {
              lmStatusEl.setText(
                `Error: ${err instanceof Error ? err.message : "Unknown error"}. Make sure LM Studio is running.`
              );
            }
          })
      );

    // === Model Configuration ===
    containerEl.createEl("h3", { text: "Model Configuration" });

    const models = this.plugin.settings.detectedModels ?? [];
    const hasDetected = models.length > 0;

    // Helper: create a model selector — dropdown if models detected, text input otherwise
    const addModelSetting = (
      label: string,
      desc: string,
      placeholder: string,
      currentValue: string,
      onSet: (value: string) => Promise<void>
    ) => {
      const setting = new Setting(containerEl)
        .setName(label)
        .setDesc(desc);

      if (hasDetected) {
        setting.addDropdown((dropdown) => {
          models.forEach((m) => dropdown.addOption(m, m));
          dropdown.setValue(currentValue ?? models[0]);
          dropdown.onChange(async (value) => {
            await onSet(value);
            // Keep the value even if it doesn't match the dropdown list exactly
          });
        });
      } else {
        setting.addText((text) =>
          text
            .setPlaceholder(placeholder)
            .setValue(currentValue)
            .onChange(async (value) => {
              await onSet(value);
            })
        );
      }
    };

    addModelSetting(
      "Chat Model",
      "Model to use for chat completions",
      "deepseek-v4-flash",
      this.plugin.settings.chatModel,
      async (v) => {
        this.plugin.settings.chatModel = v;
        await this.plugin.saveSettings();
      }
    );

    addModelSetting(
      "Embedding Model",
      `Model for embeddings${this.getCaps().embeddings ? "" : " (⚠️ NOT supported by this provider)"}`,
      "deepseek-embedding",
      this.plugin.settings.embeddingModel,
      async (v) => {
        this.plugin.settings.embeddingModel = v;
        await this.plugin.saveSettings();
      }
    );
    if (!this.getCaps().embeddings) {
      (containerEl.lastChild as HTMLElement).querySelector("input")?.setAttribute("disabled", "true");
      (containerEl.lastChild as HTMLElement).style.opacity = "0.5";
    }

    addModelSetting(
      "Vision Model",
      "Model to use for vision/image tasks",
      "deepseek-vision",
      this.plugin.settings.visionModel,
      async (v) => {
        this.plugin.settings.visionModel = v;
        await this.plugin.saveSettings();
      }
    );

    new Setting(containerEl)
      .setName("Temperature")
      .setDesc("Controls randomness (0.0 = deterministic, 2.0 = very random)")
      .addText((text) =>
        text
          .setPlaceholder("0.7")
          .setValue(String(this.plugin.settings.temperature))
          .onChange(async (value) => {
            const num = parseFloat(value);
            if (!isNaN(num) && num >= 0 && num <= 2) {
              this.plugin.settings.temperature = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Max Tokens")
      .setDesc("Maximum tokens in the response")
      .addText((text) =>
        text
          .setPlaceholder("4096")
          .setValue(String(this.plugin.settings.maxTokens))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num)) {
              this.plugin.settings.maxTokens = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Top P")
      .setDesc("Nucleus sampling (0.0-1.0). Lower = more focused")
      .addText((text) =>
        text
          .setPlaceholder("0.95")
          .setValue(String(this.plugin.settings.topP))
          .onChange(async (value) => {
            const num = parseFloat(value);
            if (!isNaN(num) && num >= 0 && num <= 1) {
              this.plugin.settings.topP = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Top K")
      .setDesc("Limits token selection to top K (0 = disabled)")
      .addText((text) =>
        text
          .setPlaceholder("20")
          .setValue(String(this.plugin.settings.topK))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num >= 0) {
              this.plugin.settings.topK = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Presence Penalty")
      .setDesc("Penalizes repeated tokens (0-2). Higher = less repetition")
      .addText((text) =>
        text
          .setPlaceholder("1.5")
          .setValue(String(this.plugin.settings.presencePenalty))
          .onChange(async (value) => {
            const num = parseFloat(value);
            if (!isNaN(num) && num >= 0 && num <= 2) {
              this.plugin.settings.presencePenalty = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Enable thinking mode")
      .setDesc("Use DeepSeek V4 thinking/reasoning (incompatible with temperature/top_p/presence_penalty)")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableThinking && (this.getCaps().thinking))
          .setDisabled(!this.getCaps().thinking)
          .onChange(async (value) => {
            this.plugin.settings.enableThinking = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Reasoning effort")
      .setDesc("Only applies when thinking mode is enabled (DeepSeek V4)")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("high", "High")
          .addOption("max", "Max")
          .setValue(this.plugin.settings.reasoningEffort)
          .onChange(async (value) => {
            this.plugin.settings.reasoningEffort = value as "high" | "max";
            await this.plugin.saveSettings();
          })
      );

    // === Chat Options ===
    containerEl.createEl("h3", { text: "Chat Options" });

    new Setting(containerEl)
      .setName("Stream responses")
      .setDesc("Show response token by token")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.streamEnabled)
          .onChange(async (value) => {
            this.plugin.settings.streamEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Context turns")
      .setDesc("Number of previous turns to include in context")
      .addText((text) =>
        text
          .setPlaceholder("5")
          .setValue(String(this.plugin.settings.contextTurns))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.contextTurns = num;
              await this.plugin.saveSettings();
            }
          })
      );

    // === Semantic Search ===
    containerEl.createEl("h3", { text: `Semantic Search (RAG)${isPro ? "" : " (🔒 Pro)"}` });

    new Setting(containerEl)
      .setName("Enable semantic search")
      .setDesc(isPro ? "Index your vault for semantic search in chat" : "🔒 Semantic search requires a Pro license")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableSemanticSearch && isPro)
          .setDisabled(!isPro)
          .onChange(async (value) => {
            this.plugin.settings.enableSemanticSearch = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max source chunks")
      .setDesc("Number of chunks to retrieve per query")
      .addText((text) =>
        text
          .setPlaceholder("5")
          .setValue(String(this.plugin.settings.maxSourceChunks))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.maxSourceChunks = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Chunk size (tokens)")
      .setDesc("Approximate token count per chunk")
      .addText((text) =>
        text
          .setPlaceholder("500")
          .setValue(String(this.plugin.settings.chunkSize))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.chunkSize = num;
              await this.plugin.saveSettings();
            }
          })
      );

    // === Web Search ===
    containerEl.createEl("h3", { text: `Web Search (browser-use)${isPro ? "" : " (🔒 Pro)"}` });

    new Setting(containerEl)
      .setName("Enable web search")
      .setDesc(isPro ? "Allow web search via browser-use microservice" : "🔒 Web search requires a Pro license")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.webSearchEnabled && isPro)
          .setDisabled(!isPro)
          .onChange(async (value) => {
            this.plugin.settings.webSearchEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Web search server URL")
      .setDesc("URL of the browser-use Python microservice")
      .addText((text) =>
        text
          .setPlaceholder("http://localhost:8000/search")
          .setValue(this.plugin.settings.webSearchServerUrl)
          .onChange(async (value) => {
            this.plugin.settings.webSearchServerUrl = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max search results")
      .setDesc("How many web results to return")
      .addText((text) =>
        text
          .setPlaceholder("3")
          .setValue(String(this.plugin.settings.webSearchMaxResults))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.webSearchMaxResults = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Web search token")
      .setDesc("Authentication token shared with the Python search server (must match server's COPILOT_WEB_TOKEN)")
      .addText((text) => {
        text.inputEl.type = "password";
        text
          .setPlaceholder("your-secure-token")
          .setValue(this.plugin.settings.webSearchToken)
          .onChange(async (value) => {
            this.plugin.settings.webSearchToken = value;
            await this.plugin.saveSettings();
          });
      });

    // === Vision ===
    containerEl.createEl("h3", { text: `Vision / Images${caps.vision ? (isPro ? "" : " (🔒 Pro)") : " (⚠️ not supported)"}` });

    new Setting(containerEl)
      .setName("Enable vision")
      .setDesc(
        caps.vision
          ? (isPro ? "Use vision model for images" : "🔒 Vision requires a Pro license")
          : "Not available for this provider"
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.visionEnabled && caps.vision && isPro)
          .setDisabled(!caps.vision || !isPro)
          .onChange(async (value) => {
            this.plugin.settings.visionEnabled = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Enable image drop")
      .setDesc("Allow drag & drop of images into chat")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableImageDrop)
          .onChange(async (value) => {
            this.plugin.settings.enableImageDrop = value;
            await this.plugin.saveSettings();
          })
      );

    // === Chat History ===
    containerEl.createEl("h3", { text: "Chat History" });

    new Setting(containerEl)
      .setName("Save chat history")
      .setDesc("Save conversations as markdown files in the vault")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.saveChatHistory)
          .onChange(async (value) => {
            this.plugin.settings.saveChatHistory = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Chat history folder")
      .setDesc("Folder to store chat history files")
      .addText((text) =>
        text
          .setPlaceholder("copilot-chats")
          .setValue(this.plugin.settings.chatHistoryFolder)
          .onChange(async (value) => {
            this.plugin.settings.chatHistoryFolder = value;
            await this.plugin.saveSettings();
          })
      );

    // === Memory ===
    containerEl.createEl("h3", { text: "Memory" });

    new Setting(containerEl)
      .setName("Enable memory")
      .setDesc("Remember key facts between chat sessions")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.memoryEnabled)
          .onChange(async (value) => {
            this.plugin.settings.memoryEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Memory folder")
      .setDesc("Folder to store memory files")
      .addText((text) =>
        text
          .setPlaceholder("copilot/memory")
          .setValue(this.plugin.settings.memoryFolder)
          .onChange(async (value) => {
            this.plugin.settings.memoryFolder = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max memories")
      .setDesc("Number of recent memories to load on new chat")
      .addText((text) =>
        text
          .setPlaceholder("3")
          .setValue(String(this.plugin.settings.maxMemories))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.maxMemories = num;
              await this.plugin.saveSettings();
            }
          })
      );

    // === Agent Mode ===
    containerEl.createEl("h3", { text: `Agent Mode${caps.toolCalling ? (isPro ? "" : " (🔒 Pro)") : " (⚠️ not supported)"}` });

    new Setting(containerEl)
      .setName("Enable agent mode")
      .setDesc(
        caps.toolCalling
          ? (isPro ? "Let the AI use tools and perform multiple actions autonomously" : "🔒 Agent mode requires a Pro license")
          : "Tool calling not available for this provider"
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAgentMode && caps.toolCalling && isPro)
          .setDisabled(!caps.toolCalling || !isPro)
          .onChange(async (value) => {
            this.plugin.settings.enableAgentMode = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max agent iterations")
      .setDesc("Maximum number of tool calls per agent run")
      .addText((text) =>
        text
          .setPlaceholder("5")
          .setValue(String(this.plugin.settings.agentMaxIterations))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.agentMaxIterations = num;
              await this.plugin.saveSettings();
            }
          })
      );

    // === LM Studio (Vision) ===
    containerEl.createEl("h3", { text: "LM Studio (Image Analysis)" });

    new Setting(containerEl)
      .setName("LM Studio URL")
      .setDesc("URL of your LM Studio server")
      .addText((text) =>
        text
          .setPlaceholder("http://localhost:1234/v1")
          .setValue(this.plugin.settings.lmStudioUrl)
          .onChange(async (value) => {
            this.plugin.settings.lmStudioUrl = value;
            await this.plugin.saveSettings();
          })
      );

    const lmModelSetting = new Setting(containerEl)
      .setName("LM Studio Model")
      .setDesc("Model name for vision/image tasks");

    if (hasDetected) {
      lmModelSetting.addDropdown((dropdown) => {
        models.forEach((m) => dropdown.addOption(m, m));
        dropdown.setValue(this.plugin.settings.lmStudioModel ?? models[0]);
        dropdown.onChange(async (value) => {
          this.plugin.settings.lmStudioModel = value;
          await this.plugin.saveSettings();
        });
      });
    } else {
      lmModelSetting.addText((text) =>
        text
          .setPlaceholder("qwen2.5-vl-27b-instruct")
          .setValue(this.plugin.settings.lmStudioModel)
          .onChange(async (value) => {
            this.plugin.settings.lmStudioModel = value;
            await this.plugin.saveSettings();
          })
      );
    }

    new Setting(containerEl)
      .setName("LM Studio API Key")
      .setDesc("API key (leave empty if not required)")
      .addText((text) =>
        text
          .setPlaceholder("not-needed")
          .setValue(this.plugin.settings.lmStudioApiKey)
          .onChange(async (value) => {
            this.plugin.settings.lmStudioApiKey = value;
            await this.plugin.saveSettings();
          })
      );

    // === Multi-Provider Fallback (Pro feature) ===
    const activeCaps = this.getCaps();
    const missing: Array<{ key: string; label: string; settingKey: string; modelKey: string; modelPlaceholder: string }> = [];

    if (!activeCaps.embeddings) missing.push({ key: "embeddings", label: "Embeddings", settingKey: "fallbackEmbeddingProvider", modelKey: "fallbackModelEmbedding", modelPlaceholder: "nomic-embed-text" });
    if (!activeCaps.vision) missing.push({ key: "vision", label: "Vision", settingKey: "fallbackVisionProvider", modelKey: "fallbackModelVision", modelPlaceholder: "qwen2.5-vl-27b-instruct" });

    if (missing.length > 0) {
      containerEl.createEl("h3", { text: `🔄 Multi-Provider Fallback${isPro ? "" : " (Pro)"}` });

      if (!isPro) {
        containerEl.createEl("div", { text: "🔒 Multi-provider fallback requires a Pro license. With Pro, you can use a second provider for capabilities your primary provider lacks.", cls: "copilot-setting-hint" }).style.cssText = "font-size:12px;color:var(--text-muted);margin-bottom:12px;";
      }

      for (const cap of missing) {
        containerEl.createEl("h4", { text: `⚠️ ${this.plugin.settings.providerType} does not support ${cap.label}` });

        new Setting(containerEl)
          .setName(`Fallback for ${cap.label}`)
          .setDesc(isPro ? `Select a provider that DOES support ${cap.label}` : "🔒 Requires Pro license")
          .addDropdown((dropdown) => {
            const allTypes: ProviderType[] = ["deepseek", "openai", "anthropic", "openrouter", "lmstudio", "gemini", "mistral", "groq", "perplexity", "xai"];
            for (const pt of allTypes) {
              const pc = PROVIDER_CAPABILITIES[pt];
              if (pc[cap.key as "embeddings" | "vision"]) dropdown.addOption(pt, pc.label);
            }
            dropdown.setValue((this.plugin.settings as any)[cap.settingKey] || "");
            if (!isPro) dropdown.selectEl.disabled = true;
            dropdown.onChange(async (v) => { (this.plugin.settings as any)[cap.settingKey] = v; await this.plugin.saveSettings(); });
          });

        new Setting(containerEl)
          .setName(`Model ${cap.label} (fallback)`)
          .setDesc(`Model name for ${cap.label} in fallback provider`)
          .addText((text) => {
            text.setPlaceholder(cap.modelPlaceholder).setValue((this.plugin.settings as any)[cap.modelKey] || "").onChange(async (v) => { (this.plugin.settings as any)[cap.modelKey] = v; await this.plugin.saveSettings(); });
            if (!isPro) text.inputEl.disabled = true;
          });
      }
    }
  }
}
