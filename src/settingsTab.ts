import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import CopilotPlugin from "./main";
import { LmStudioService } from "./services/lmStudioService";
import { PROVIDER_CAPABILITIES, ProviderType } from "./LLMProviders/providerTypes";
import { getApiKeyForProvider, setApiKeyForProvider } from "./settings";
import { t, getLanguage, setLanguage, getLanguages } from "./i18n";
import type { Lang } from "./i18n/types";

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
    containerEl.createEl("h2", { text: t("settings.title") });

    // ── Language selector ───────────────────────────────────────────────
    const langs = getLanguages();
    new Setting(containerEl)
      .setName(t("settings.language"))
      .setDesc(t("settings.languageDesc"))
      .addDropdown((dropdown) => {
        for (const lang of langs) {
          dropdown.addOption(lang.code, `${lang.flag} ${lang.name}`);
        }
        dropdown.setValue(getLanguage());
        dropdown.onChange(async (value) => {
          setLanguage(value as Lang);
          this.plugin.settings.language = value;
          await this.plugin.saveSettings();
          // Refresh chat view UI with new language
          const chatView = this.plugin.getChatView();
          if (chatView) chatView.refreshLanguage();
          this.display(); // re-render settings with new language
        });
      });

    // Always enforce license restrictions before rendering
    this.plugin.settings = this.plugin.licenseManager.applyRestrictions(this.plugin.settings);

    // License tier + provider capabilities — determines what UI controls are enabled
    const isPro = this.isPro();
    const caps = this.getCaps();

    // === API Configuration ===
    new Setting(containerEl).setName(t("settings.apiConfiguration")).setHeading();

    const currentProvider = this.plugin.settings.providerType === "auto"
      ? "deepseek" // fallback display
      : this.plugin.settings.providerType;
    const currentApiKey = getApiKeyForProvider(this.plugin.settings, currentProvider);
    const providerDisplayName = currentProvider === "lmstudio" ? t("labels.lmStudio") : this.plugin.settings.providerType;

    new Setting(containerEl)
      .setName(t("settings.apiKey"))
      .setDesc(t("settings.apiKeyDesc", { provider: providerDisplayName }))
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
        new Notice(t("license.proActivated"));
      } else {
        new Notice(t("license.freeActivated"));
      }
      this.display();
    };

    new Setting(containerEl)
      .setName(t("settings.licenseKey"))
      .setDesc(t("settings.licenseKeyDesc"))
      .addText((text) => {
        text
          .setPlaceholder(t("settings.licensePlaceholder"))
          .setValue(this.plugin.settings.licenseKey || "")
          .onChange(async (value) => {
            await activateLicense(value);
          });
      })
      .addExtraButton((btn) => {
        btn
          .setIcon("trash")
          .setTooltip(t("settings.licenseClearTooltip"))
          .onClick(async () => {
            await activateLicense("");
          });
      });

    new Setting(containerEl)
      .setName(t("settings.apiUrl"))
      .setDesc(t("settings.apiUrlDesc"))
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
      .setName(t("settings.provider"))
      .setDesc(t("settings.providerDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("budget", t("provider.name.budget"))
          .addOption("auto", t("provider.name.auto"))
          .addOption("deepseek", t("provider.name.deepseek"))
          .addOption("openai", t("provider.name.openai"))
          .addOption("anthropic", t("provider.name.anthropic"))
          .addOption("openrouter", t("provider.name.openrouter"))
          .addOption("lmstudio", t("provider.name.lmstudio"))
          .addOption("gemini", t("provider.name.gemini"))
          .addOption("mistral", t("provider.name.mistral"))
          .addOption("groq", t("provider.name.groq"))
          .addOption("perplexity", t("provider.name.perplexity"))
          .addOption("xai", t("provider.name.xai"))
          .setValue(this.plugin.settings.providerType)
          .onChange(async (value) => {
            // Block Free users from selecting the budget provider
            if (value === "budget" && !isPro) {
              new Notice(t("settings.budgetProRequired"));
              dropdown.setValue(this.plugin.settings.providerType); // revert
              return;
            }

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
              budget: "mistralai/mistral-nemo",
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
    new Setting(lmSection).setName(t("settings.lmDetectTitle")).setHeading();

    const lmStatusEl = lmSection.createEl("div", {
      text: t("settings.lmStatusDefault"),
      cls: "copilot-setting-hint copilot-setting-hint-sm",
    });

    new Setting(lmSection)
      .setName(t("settings.detectModels"))
      .setDesc(t("settings.detectModelsDesc"))
      .addButton((btn) =>
        btn
          .setButtonText(t("settings.lmDetectButton"))
          .onClick(async () => {
            try {
              // Use dedicated LM Studio URL, NOT the main apiUrl (which could be DeepSeek/etc.)
              const url = this.plugin.settings.lmStudioUrl;
              // Send lmStudioApiKey (or none) — do NOT send the main apiKey
              const apiKey = this.plugin.settings.lmStudioApiKey || undefined;

              lmStatusEl.setText(t("settings.lmStatusQuerying"));
              const models = await LmStudioService.fetchModels(url, apiKey);

              if (models.length === 0) {
                lmStatusEl.setText(t("settings.lmStatusNoModels"));
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
                t("settings.lmStatusFound", { count: models.length, models: models.join(", ") })
              );
              new Notice(t("settings.lmStatusFoundNotice", { count: models.length, model: models[0] }));

              // Re-render to update the model text fields
              this.display();
            } catch (err) {
              lmStatusEl.setText(
                t("settings.lmStatusError", { error: err instanceof Error ? err.message : "Unknown error" })
              );
            }
          })
      );

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
          dropdown.onChange(async (value) => { await onSet(value); });
        });
      } else {
        setting.addText((text) =>
          text.setPlaceholder(placeholder).setValue(currentValue).onChange(async (value) => { await onSet(value); })
        );
      }
    };

    // === Model Configuration ===
    if ((this.plugin.settings.providerType as string) !== "budget") {
      new Setting(containerEl).setName(t("settings.modelConfig")).setHeading();

    addModelSetting(
      t("settings.chatModel"),
      t("settings.chatModelDesc"),
      "deepseek-v4-flash",
      this.plugin.settings.chatModel,
      async (v) => {
        this.plugin.settings.chatModel = v;
        await this.plugin.saveSettings();
      }
    );

    addModelSetting(
      t("settings.embeddingModel"),
      t("settings.embeddingModelDesc", { unsupported: this.getCaps().embeddings ? "" : t("settings.embeddingModelUnsupported") }),
      "deepseek-embedding",
      this.plugin.settings.embeddingModel,
      async (v) => {
        this.plugin.settings.embeddingModel = v;
        await this.plugin.saveSettings();
      }
    );
    if (!this.getCaps().embeddings) {
      (containerEl.lastChild as HTMLElement).querySelector("input")?.setAttribute("disabled", "true");
      (containerEl.lastChild as HTMLElement).classList.add("copilot-setting-disabled");
    }

    addModelSetting(
      t("settings.visionModel"),
      t("settings.visionModelDesc"),
      "deepseek-vision",
      this.plugin.settings.visionModel,
      async (v) => {
        this.plugin.settings.visionModel = v;
        await this.plugin.saveSettings();
      }
    );

    } // end model config (hidden for budget provider)

    new Setting(containerEl)
      .setName(t("settings.temperature"))
      .setDesc(t("settings.temperatureDesc"))
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
      .setName(t("settings.maxTokens"))
      .setDesc(t("settings.maxTokensDesc"))
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
      .setName(t("settings.topP"))
      .setDesc(t("settings.topPDesc"))
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
      .setName(t("settings.topK"))
      .setDesc(t("settings.topKDesc"))
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
      .setName(t("settings.presencePenalty"))
      .setDesc(t("settings.presencePenaltyDesc"))
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
      .setName(t("settings.enableThinking"))
      .setDesc(t("settings.enableThinkingDesc"))
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
      .setName(t("settings.reasoningEffort"))
      .setDesc(t("settings.reasoningEffortDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("high", t("settings.reasoningHigh"))
          .addOption("max", t("settings.reasoningMax"))
          .setValue(this.plugin.settings.reasoningEffort)
          .onChange(async (value) => {
            this.plugin.settings.reasoningEffort = value as "high" | "max";
            await this.plugin.saveSettings();
          })
      );

    // === Chat Options ===
    new Setting(containerEl).setName(t("settings.chatOptions")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.streamResponses"))
      .setDesc(t("settings.streamResponsesDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.streamEnabled)
          .onChange(async (value) => {
            this.plugin.settings.streamEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("settings.contextTurns"))
      .setDesc(t("settings.contextTurnsDesc"))
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
    new Setting(containerEl).setName(`${t("settings.sectionSemanticSearch")}${isPro ? "" : " (🔒 Pro)"}`).setHeading();

    new Setting(containerEl)
      .setName(t("settings.semanticSearch"))
      .setDesc(isPro ? t("settings.semanticSearchDesc") : t("settings.semanticSearchProLocked"))
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
      .setName(t("settings.maxSourceChunks"))
      .setDesc(t("settings.maxSourceChunksDesc"))
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
      .setName(t("settings.chunkSize"))
      .setDesc(t("settings.chunkSizeDesc"))
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
    new Setting(containerEl).setName(`${t("settings.sectionWebSearch")}${isPro ? "" : " (🔒 Pro)"}`).setHeading();

    new Setting(containerEl)
      .setName(t("settings.webSearch"))
      .setDesc(isPro ? t("settings.webSearchDesc") : t("settings.webSearchProLocked"))
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
      .setName(t("settings.webSearchServerUrl"))
      .setDesc(t("settings.webSearchServerUrlDesc"))
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
      .setName(t("settings.webSearchMaxResults"))
      .setDesc(t("settings.webSearchMaxResultsDesc"))
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
      .setName(t("settings.webSearchToken"))
      .setDesc(t("settings.webSearchTokenDesc"))
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
    new Setting(containerEl).setName(`${t("settings.sectionVision")}${caps.vision ? (isPro ? "" : " (🔒 Pro)") : " (⚠️ not supported)"}`).setHeading();

    new Setting(containerEl)
      .setName(t("settings.vision"))
      .setDesc(
        caps.vision
          ? (isPro ? t("settings.visionDesc") : t("settings.visionProLocked"))
          : t("settings.visionNotSupported")
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
      .setName(t("settings.imageDrop"))
      .setDesc(t("settings.imageDropDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableImageDrop)
          .onChange(async (value) => {
            this.plugin.settings.enableImageDrop = value;
            await this.plugin.saveSettings();
          })
      );

    // === Chat History ===
    new Setting(containerEl).setName(t("settings.chatHistory")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.saveChatHistory"))
      .setDesc(t("settings.saveChatHistoryDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.saveChatHistory)
          .onChange(async (value) => {
            this.plugin.settings.saveChatHistory = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("settings.chatHistoryFolder"))
      .setDesc(t("settings.chatHistoryFolderDesc"))
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
    new Setting(containerEl).setName(t("settings.memory")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.enableMemory"))
      .setDesc(t("settings.enableMemoryDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.memoryEnabled)
          .onChange(async (value) => {
            this.plugin.settings.memoryEnabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("settings.memoryFolder"))
      .setDesc(t("settings.memoryFolderDesc"))
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
      .setName(t("settings.maxMemories"))
      .setDesc(t("settings.maxMemoriesDesc"))
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
    new Setting(containerEl).setName(`${t("settings.sectionAgentMode")}${caps.toolCalling ? (isPro ? "" : " (🔒 Pro)") : " (⚠️ not supported)"}`).setHeading();

    new Setting(containerEl)
      .setName(t("settings.agentMode"))
      .setDesc(
        caps.toolCalling
          ? (isPro ? t("settings.agentModeDesc") : t("settings.agentModeProLocked"))
          : t("settings.agentModeToolCallingNA")
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
      .setName(t("settings.maxAgentIterations"))
      .setDesc(t("settings.maxAgentIterationsDesc"))
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
    new Setting(containerEl).setName(t("settings.lmVisionTitle")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.lmStudioUrl"))
      .setDesc(t("settings.lmStudioUrlDesc"))
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
      .setName(t("settings.lmStudioModel"))
      .setDesc(t("settings.lmStudioModelDesc"));

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
      .setName(t("settings.lmStudioApiKey"))
      .setDesc(t("settings.lmStudioApiKeyDesc"))
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
      new Setting(containerEl).setName(`${t("settings.multiProviderFallback")}${isPro ? "" : " (Pro)"}`).setHeading();

      if (!isPro) {
        containerEl.createEl("div", { text: t("settings.multiProviderProNotice"), cls: "copilot-setting-hint copilot-setting-note" });
      }

      for (const cap of missing) {
        new Setting(containerEl).setName(`⚠️ ${t("settings.providerNoSupport", { provider: this.plugin.settings.providerType, cap: cap.label })}`).setHeading();

        new Setting(containerEl)
          .setName(t("settings.fallbackFor", { cap: cap.label }))
          .setDesc(isPro ? t("settings.fallbackSelect", { cap: cap.label }) : t("settings.fallbackProLocked"))
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

    // ── Budget AI (Pro only) ────────────────────────────────────────────
    if (isPro) {
      const budget = this.plugin.budgetManager;
      const licenseKey = this.plugin.settings.licenseKey || "";

      new Setting(containerEl).setName("💰 " + t("settings.budgetTitle")).setHeading();

      // Usage bar — fetched from Worker (server-side tracking)
      const barContainer = containerEl.createDiv("copilot-budget-bar");
      const bar = barContainer.createDiv("copilot-budget-bar-fill");

      const stats = containerEl.createDiv("copilot-budget-stats");
      stats.createEl("span", { text: "📊 Loading..." });
      stats.createEl("span", { text: "💬 Loading..." });
      stats.createEl("span", { text: "💵 Loading..." });
      stats.createEl("span", { text: "⏰ Loading..." });

      // Fetch async from Worker
      budget.fetchUsage(licenseKey).then(usage => {
        const maxPct = Math.max(usage.tokenPercent, usage.queryPercent);
        bar.style.setProperty("--copilot-budget-width", maxPct + "%");
        bar.className = "copilot-budget-bar-fill" +
          (maxPct > 90 ? " copilot-budget-critical" : maxPct > 75 ? " copilot-budget-warn" : "");
        stats.empty();
        stats.createEl("span", { text: `📊 ${usage.dailyTokens.toLocaleString()} / ${usage.limitTokens.toLocaleString()} tokens` });
        stats.createEl("span", { text: `💬 ${usage.dailyQueries} / ${usage.limitQueries} queries` });
        stats.createEl("span", { text: `💵 ~$${usage.dailyCost.toFixed(3)} / $${usage.dailyCostLimit}` });
        stats.createEl("span", { text: `⏰ Resets in ${usage.resetsInHours}h` });
      }).catch(() => {
        stats.empty();
        stats.createEl("span", { text: "⚠️ Could not load budget usage" });
      });

      // Enable/disable toggle
      new Setting(containerEl)
        .setName(t("settings.budgetEnable"))
        .setDesc(t("settings.budgetEnableDesc"))
        .addToggle((toggle) =>
          toggle
            .setValue(budget.isEnabled())
            .onChange(async (value) => {
              budget.setEnabled(value);
              await this.plugin.saveSettings();
              this.display();
            })
        );
    }

    new Setting(containerEl)
          .setName(t("settings.fallbackModelName", { cap: cap.label }))
          .setDesc(t("settings.fallbackModelDesc", { cap: cap.label }))
          .addText((text) => {
            text.setPlaceholder(cap.modelPlaceholder).setValue((this.plugin.settings as any)[cap.modelKey] || "").onChange(async (v) => { (this.plugin.settings as any)[cap.modelKey] = v; await this.plugin.saveSettings(); });
            if (!isPro) text.inputEl.disabled = true;
          });
      }
  }
}
}
