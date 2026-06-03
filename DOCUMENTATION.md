# Copilot Personal — Documentation v1.4.4

> AI assistant with advanced agent capabilities for Obsidian. Multimodal chat with real streaming, semantic RAG, autonomous agent (17 tools), 11 LLM providers with native tool calling and multi-provider fallback, PDF rendering with `unpdf`, Free/Pro licensing with cloud validation + grace period, CircuitBreaker on all providers, dual-build (clean store / obfuscated distribution), and intelligent note auto-save. 151 tests.

> 📖 [Spanish documentation](DOCUMENTATION_ES.md)

---

## Table of Contents

1. [Installation](#1-installation)
2. [Free vs Pro Licensing](#2-free-vs-pro-licensing)
3. [Initial Setup](#3-initial-setup)
4. [Chat Usage](#4-chat-usage)
5. [Slash Commands](#5-slash-commands)
6. [Agent Mode](#6-agent-mode)
7. [Agent Tools](#7-agent-tools)
8. [Working with PDFs](#8-working-with-pdfs)
9. [Semantic Search (RAG)](#9-semantic-search-rag)
10. [Exporting Conversations](#10-exporting-conversations)
11. [Obsidian Commands](#11-obsidian-commands)
12. [Privacy & Security](#12-privacy--security)
13. [Troubleshooting](#13-troubleshooting)
14. [Keyboard Shortcuts](#14-keyboard-shortcuts)
15. [Roadmap](#15-roadmap)

---

## 1. Installation

### Requirements
- Obsidian v1.7.0 or higher
- Node.js 18+ (development only)
- For local features: [LM Studio](https://lmstudio.ai/) with a loaded model
- For PDFs: no extra dependencies (pdfjs-dist included)

### Quick Install

```bash
# 1. Navigate to your vault's plugins folder
cd "YourVault/.obsidian/plugins"

# 2. Clone the repository
git clone https://github.com/JosefBelzer/Copilot-Personal.git

# 3. Install dependencies and build
cd copilot-personal
npm install
npm run build
```

### Build Modes
```bash
npm run build          # Obfuscated main.js (external distribution: ZIP, Gumroad, BRAT)
npm run build:store    # Clean main.js (PR to Obsidian Community Plugins)
npm run dev            # Dev mode with sourcemaps and watch
```

> ⚠️ **IMPORTANT:** For the Obsidian Community Plugin store, ALWAYS use `npm run build:store`. The obfuscated build (`npm run build`) will be REJECTED by reviewers. Obfuscation is for external distribution only (Gumroad, ZIP, BRAT) to protect intellectual property.

### Manual Install
1. Download the ZIP from [Releases](https://github.com/JosefBelzer/Copilot-Personal/releases)
2. Extract to `YourVault/.obsidian/plugins/copilot-personal/`
3. Enable in Settings → Community plugins → Copilot Personal

### Web Search Server (optional)
```bash
cd web_search_server
pip install -r requirements.txt
# Set the shared token (must match the plugin setting)
set COPILOT_WEB_TOKEN=your-secure-token
uvicorn main:app --host 127.0.0.1 --port 8000
```

> ⚠️ **Important:** Configure a secure token on both the server (`COPILOT_WEB_TOKEN`) and the plugin (Settings → Web Search → Web search token). The default value `copilot-default-token-change-me` is insecure.

---

## 2. Free vs Pro Licensing

### 🆓 Free (default)
- Unlimited basic chat
- 50 messages/day (persistent — survives restarts)
- 3 tools: `read_note`, `read_pdf`, `find_files`
- No agent mode · No web search · No PDF images · No semantic RAG
- Pro options appear **disabled** (🔒) in settings UI

### ⭐ Pro ($4.99/mo via Lemon Squeezy)

- **Unlimited messages** · **Agent mode** (17 tools)
- **Web search** · **PDF with images** · **Semantic RAG**
- **Chat export** (MD/JSON) · **Slash commands** · Priority support
- **Multi-provider fallback** · **Per-provider API keys**

### Activating Pro
1. Purchase a Pro subscription at [belzersoftware.lemonsqueezy.com](https://belzersoftware.lemonsqueezy.com/checkout/buy/85655f95-93f7-4649-954a-8bc62472f302)
2. You'll receive your **License Key** via email (Lemon Squeezy UUID format, e.g., `056b9494-...`)
3. Settings → Copilot Personal → License Key → paste the key
4. You'll see `✅ Pro license activated successfully.`
5. The chat badge changes to `⭐ Pro`
6. All Pro options unlock automatically in settings

> **Test key:** `COPIPRO-DEMO-DEMO-DEMO` (debug mode only — `COPILOT_DEBUG=1`).

### License Security

| Mechanism | Description |
|-----------|-------------|
| **Cloud validation** | Each activation is verified against the Cloudflare Worker at `copilot-personal-worker.copilot-personal.workers.dev` |
| **Device binding** | License is tied to your device via fingerprint. Max 3 devices per license |
| **Grace period** | If offline, Pro continues working for 24h before degrading to Free |
| **Persistent state** | Message count and license state are saved in `data.json` |
| **Anti-sharing** | 3-device limit. Frequent device changes trigger protections |
| **Demo restricted** | Only works in development mode (`COPILOT_DEBUG=1`) |

---

## 3. Initial Setup

### Step 1: Choose your provider

| Option | Best for | Setup |
|--------|----------|-------|
| **🔒 LM Studio (local)** | Complete privacy, no API key | Start LM Studio, load a model, URL: `http://localhost:1234/v1` |
| **☁️ DeepSeek (cloud)** | Best performance, affordable | API key from [platform.deepseek.com](https://platform.deepseek.com) |
| **☁️ OpenAI** | GPT-4o, complex tasks | API key from [platform.openai.com](https://platform.openai.com) |
| **☁️ Anthropic** | Claude Sonnet/Opus | API key from [console.anthropic.com](https://console.anthropic.com) |
| **☁️ Gemini** | Google, multi-modal | API key from [aistudio.google.com](https://aistudio.google.com) |

### Supported Providers (11) — Actual Capabilities

| Provider | Chat | Streaming | Embeddings | Vision | Tool Calling | Thinking |
|----------|:----:|:---------:|:----------:|:------:|:------------:|:--------:|
| DeepSeek | ✅ | ✅ Real | ✅ | ✅ | ✅ | ✅ |
| OpenAI | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |
| Anthropic | ✅ | ✅ Real | ❌ | ✅ | ✅ | ❌ |
| Gemini | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |
| Mistral | ✅ | ✅ Real | ✅ | ✅ (Pixtral) | ✅ | ❌ |
| xAI (Grok) | ✅ | ✅ Real | ❌ | ✅ (Grok‑1.5V) | ✅ | ❌ |
| Groq | ✅ | ✅ Real | ❌ | ❌ | ✅ | ❌ |
| Perplexity | ✅ | ✅ Real | ❌ | ❌ | ✅ | ❌ |
| OpenRouter | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |
| LM Studio | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |

> 💡 **Native tool calling:** OpenAI, Anthropic (input_schema), Gemini (functionDeclarations) — each uses their API's specific format.
> 💡 **Real streaming:** fetch + ReadableStream on all providers.
> 💡 **Smart settings:** Fields unsupported by the provider are automatically disabled in Settings.

### 🔄 Multi-Provider Fallback (Pro)

If your primary provider lacks certain capabilities, you can configure a **second provider** to compensate:

| Provider → Missing | Typical Fallback | Configuration |
|---------------------|------------------|---------------|
| **Anthropic** → Embeddings | LM Studio (`nomic-embed-text`) | Settings → Multi-Provider Fallback |
| **Groq** → Embeddings, Vision | LM Studio | Both fallbacks to LM Studio |
| **Perplexity** → Embeddings, Vision | LM Studio | Same as Groq |
| **DeepSeek** → (none, optional) | LM Studio (cost savings) | Configure both fallbacks for local use |

**How it works:** The system automatically detects which capabilities your primary provider lacks and redirects those tasks to the configured fallback provider. Chat always uses the primary provider. *Requires Pro license.*

### Step 2: Configure your API Key
1. Go to Settings → Copilot Personal → API Configuration
2. Paste your API key in the appropriate field
3. Select the provider (Auto-detect works in most cases)

> 💡 **Per-Provider API Keys:** Each provider remembers its own API key. Switching from DeepSeek to Gemini clears the field and shows the key saved for Gemini. This lets you configure multiple providers without mixing keys.

> ⚠️ **Warning:** API keys are stored in `data.json` inside the plugin folder (unencrypted). This file must NOT be committed to Git (it's in `.gitignore`). If you sync your vault, exclude `.obsidian/plugins/copilot-personal/data.json`.

### Step 3: Select your model
- **Chat Model:** `deepseek-v4-flash` (fast) or `deepseek-v4-pro` (powerful)
- **Embedding Model:** `text-embedding-nomic-embed-text-v1.5` (local, free)
- **Vision Model:** `qwen2.5-vl-27b-instruct` (LM Studio) or the same chat model

### Recommended LM Studio Setup
```
API URL:    http://localhost:1234/v1
Provider:   Auto-detect (detects LM Studio automatically)
Chat Model: qwen3.6-35b-a3b (load in LM Studio)
Embedding:  text-embedding-nomic-embed-text-v1.5
Vision:     qwen2.5-vl-27b-instruct (optional)
```

---

## 4. Chat Usage

### Basic Operations
- Type your message and press **Enter** to send
- Use **Shift+Enter** for a new line
- Drag files to chat: `.md` (as context), `.pdf` (extracts text), `.png/.jpg` (preview)
- Click **Agent** to activate autonomous mode
- Click **Think** to activate reasoning mode (DeepSeek models)

### Visual Indicators
| Indicator | Meaning |
|-----------|---------|
| `🆓 Free` | Free tier — 50 messages/day, limited features |
| `⭐ Pro` | Pro license active — all features unlocked |
| `🔒 Local` | Data processed on your machine (LM Studio) |
| `☁️ Cloud` | Data sent to external server (DeepSeek/OpenAI) |
| `⏳ Step N: tool...` | Agent is running a tool |
| `⚠️ NOT SAVED` | Model wrote note content without saving |
| `⚠️ Invented links` | Model suggested links to non-existent notes |

---

## 5. Slash Commands

Type `/` followed by the command and press Enter. The command expands automatically:

| Command | Action |
|---------|--------|
| `/summarize` | Summarize selected content |
| `/translate` | Translate text to English |
| `/explain` | Explain a concept in detail |
| `/toc` | Generate a table of contents |
| `/flashcards` | Create 10 Q&A flashcards |
| `/rewrite` | Rewrite for clarity and style |
| `/expand` | Expand with more details |

**Example:**
```
/summarize drag note or PDF text here
```

---

## 6. Agent Mode

Agent mode allows the LLM to use tools autonomously. This is the plugin's key differentiator.

### How to Activate
1. Click the **Agent** button in the chat
2. Write your instruction (e.g., "create notes for each chapter of the PDF")
3. The agent will execute the necessary tools automatically

### Usage Examples

**Populate notes from a PDF:**
```
read note 01_02 to understand the structure. Then populate notes
[[03_03_Tasks]], [[03_03_01_Planning]], [[03_03_02_Control]] with
information from PDF Fundamentals_of_Quality_Management.pdf, pages 116-138.
Include images and connections between notes.
```

**Create notes from a list:**
```
create a note for each of the following items:
- [[05_01_Goals_and_Dependencies]]
- [[05_01_01_Holistic_Focus_Process_Design]]
- [[05_02_Continuous_Improvement_Process]]
```

**Review note against PDF:**
```
review note 01_03_01_Complaints against PDF
Fundamentals_of_Quality_Management.pdf, page 27
```

### Agent Safety Mechanisms
- **ToolRouter:** Classifies the task before execution and only provides the necessary tools (70-90% token savings)
- **DECIDE NOW:** Forces the model to choose between acting or responding
- **Anti-loop:** Detects repeated planning and forces conclusion
- **Force-write:** If the model re-reads 3+ times, forces switch to writing
- **WriteCount:** Verifies all notes were created before declaring "complete"

---

## 7. Agent Tools

| Tool | Function | When to use |
|------|----------|-------------|
| `read_note` | Read a note from the vault | Need to view note content |
| `read_pdf` | Extract PDF text (requires pagesOnly) | Working with large PDFs |
| `create_note` | Create a new note | Generate new content |
| `update_note` | Modify existing note | Update notes |
| `find_files` | Search files by name | Locate PDFs, images, notes |
| `list_notes` | List notes in a folder | Explore the vault |
| `render_pdf_pages` | Render PDF pages to PNG | Extract figures/diagrams |
| `extract_pdf_images` | Extract individual images from PDF | Get embedded figures |
| `analyze_image` | Describe image with vision model | Analyze diagrams, photos |
| `search_vault_semantic` | Semantic search (RAG) | Find concepts in the vault |
| `search_vault_fulltext` | Exact text search | Find specific words |
| `search_web` | Web search | External information |
| `get_vault_stats` | Vault statistics | Know size, # notes |
| `get_active_file` | Currently open file | Work with active note |
| `get_frontmatter` | YAML metadata of a note | Read tags, date, etc. |
| `extract_youtube_transcript` | Video transcript | Analyze video content |

---

## 8. Working with PDFs

## 9. Semantic Search

## 10. Exporting Conversations

## 11. Obsidian Commands

## 12. Privacy & Security

- **API keys:** Stored locally in `data.json`. Each provider has its own field. Never sent to plugin author's servers.
- **Vault data:** Sent only to the LLM provider you configure (DeepSeek, OpenAI, etc.). No telemetry or analytics.
- **Web search:** Requires a local Python microservice (`web_search_server/`). Authentication token is configurable in settings.
- **License validation:** Pro keys are validated against the Cloudflare Worker at `copilot-personal-worker.copilot-personal.workers.dev`. Free tier requires no internet connection.
- **Path traversal:** Multi-layer protection in `read_note` against directory escapes (`..`, `%2e%2e`, absolute paths).
- **Timing attacks:** The Worker's admin endpoint uses constant-time comparison for tokens.
- **No telemetry, no analytics, no tracking.**

## 13. Troubleshooting

## 14. Keyboard Shortcuts

## 15. Roadmap

### v1.4.4 (Current — June 2026)
- [x] All remaining Spanish UI strings translated to English
- [x] Agent progress indicator: `Paso` → `Step`
- [x] Legacy `apiKey` auto-migrated to per-provider key on load
- [x] `pdf.worker.min.mjs` removed from release (CDN fallback)
- [x] GitHub artifact attestations via release workflow

### v1.4.3
- [x] **Dual-build**: `npm run build:store` (clean, Obsidian review) + `npm run build` (obfuscated, distribution)
- [x] **Cloudflare Worker deployed**: `copilot-personal-worker.copilot-personal.workers.dev` — cloud validation, Lemon Squeezy webhook, device limit
- [x] **Per-Provider API Keys**: each provider remembers its own key (DeepSeek, OpenAI, Gemini, etc.)
- [x] **Lemon Squeezy licensing**: native UUID keys, no COPILOT- format, 100% cloud validation
- [x] **UI gating Free/Pro**: toggles disabled (🔒) in settings when tier=free, error messages on validation
- [x] **Persistent counter**: daily message limit survives Obsidian restarts
- [x] **Web search token** configurable from settings (no longer hardcoded)
- [x] **Path traversal protection** improved in `readNoteTool`
- [x] **Timing-safe auth** on Worker admin endpoint
- [x] **Real-time UI updates**: header badges and model selector refresh instantly on settings change
- [x] **Test suite**: 151 tests in 16 suites
- [x] **CircuitBreaker** on ALL providers (chat + stream + embed)
- [x] **Markdown sanitization**: protection against `<script>` and `on*` handlers
- [x] **MIT License** for open-source compliance
- [x] **Multi-Provider Fallback (Pro)** — automatic capability compensation
- [x] Agent mode with 17 tools
- [x] ToolRouter with LLM classification (70-90% token savings)
- [x] PDF rendering + image extraction with `unpdf`
- [x] 7 Slash commands + Export MD/JSON
- [x] Circuit breaker + timeouts + backoff on all providers
- [x] Session auto-save crash recovery (sessionStorage every 30s)
- [x] Privacy indicator (🔒 Local / ☁️ Cloud) + tier badge (🆓 Free / ⭐ Pro)
- [x] LicenseManager with rate limiting + feature gating + fingerprint binding
- [x] Invented wiki-link validation + multi-note auto-save
- [x] 11 providers with real streaming (fetch + ReadableStream)
- [x] Gemini native provider with tool calling (functionDeclarations)
- [x] Anthropic native provider with tool calling (input_schema)
- [x] Unified BaseOpenAIProvider + centralized buildBody()
- [x] AutoSaveManager — splitNoteSections, validateWikiLinks, findNoteByHeading
- [x] Chat avatars (👤/🤖/🔧) + fade-in animation
- [x] Visual agent progress tracker (⏳ Step N: tool...)
- [x] Landing page + complete documentation
- [x] TypeScript strict mode (0 errors)
- [x] Build obfuscation with javascript-obfuscator
- [x] `fetchWithFallback()` — Obsidian desktop + mobile compatibility
- [x] `normalizeApiUrl()` unified for all providers
- [x] 9 code audits passed

### v1.3 (Upcoming)
- [ ] Voice input (Web Speech API)
- [ ] Customizable prompt templates
- [ ] Custom agent instructions (similar to Custom GPTs)
- [ ] Export PDF with tool results
- [ ] Notifications on long task completion
- [ ] Cross-device settings sync

### v2.0 (Pro — Commercial)
- [x] Free vs Pro licensing system
- [x] Cloud validation server (Cloudflare Worker deployed)
- [x] Unlimited web search (Pro)
- [x] Per-Provider API Keys
- [ ] Multi-vault support
- [ ] Optimized local embeddings (ANN/HNSW)
- [ ] Priority support
- [ ] Premium templates

---

## Support

- **GitHub Issues:** [Report bug or suggest feature](https://github.com/JosefBelzer/Copilot-Personal/issues)
- **Email:** soporte@copilot-personal.dev

---

**Copilot Personal v1.4.4** — Made with ❤️ for the Obsidian community.
