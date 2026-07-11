# 🚀 Copilot Personal v1.6.2 — Obsidian Review Approved

> **Zero review warnings. All Obsidian community standards met. Production-ready.**

---

## 🎯 The Big Picture

v1.6.1 transforms Copilot Personal from a capable AI assistant into a **truly autonomous agent**. Your AI can now follow custom instructions, search through past conversations, process entire folders of notes, work in a separate window alongside Obsidian, and access the most complete model selection ever.

---

## ✨ What's New

### 🧠 Custom Agent Instructions
Tell your AI *how* to behave — in plain language.

Set instructions like *"Always respond in Spanish"*, *"You are an expert Python developer"*, or *"Be concise and use bullet points"*. The agent follows your instructions across all chat modes: regular, agent, budget, and budget-agent.

> **Settings → Copilot Personal → Modo Agente → Custom agent instructions**

### 📋 Complete Model Lists — Every Provider, Every Model
No more guessing model names. Each provider now ships with its full, official model catalog:

| Provider | Models | Highlights |
|---|---|---|
| **OpenAI** | 27 | GPT-5.3 Codex, GPT-5.2, o3, o3-pro, GPT-4o, GPT-4.1 |
| **Anthropic** | 11 | Claude Opus 4.8, Sonnet 5, Haiku 4.5, Fable 5, Mythos 5 |
| **Gemini** | 16 | Gemini 3.5 Flash/Pro, 3.1 Pro, Omni Flash, Gemini Audio, Veo |
| **Mistral** | 20 | Magistral Medium 1.2, Small 4, Medium 3.5, Codestral, Pixtral |
| **DeepSeek** | 8 | V4 Flash, V4 Pro, V3.2, V4, plus reasoning variants |
| **Groq** | 11 | Llama 3.3 70B, GPT-OSS 120B, Groq Compound, Qwen3 32B |
| **xAI** | 9 | Grok 4.3, Grok Build, Grok Imagine, Grok 3 family |
| **Perplexity** | 5 | Sonar, Sonar Pro, Sonar Reasoning, Sonar Deep Research |
| **OpenRouter** | **~85** | The best 85 models from 400+ available — all in one dropdown |

### 🔍 `/search-history` — Find Any Past Conversation
Type `/search-history <query>` to search through ALL your saved chat history. Shows matching snippets with file names and context — like grep for your conversations.

### 📂 `/list-chats` + `/load-chat` — Conversation Manager
- `/list-chats` — see all saved conversations with dates
- `/load-chat <name>` — load any past conversation instantly

Built on the existing ChatHistoryBrowser, no extra setup needed.

### ⚡ `/batch-process` — Process Entire Folders at Once
```markdown
/batch-process summarize "Projects"
/batch-process translate "Meeting Notes"
/batch-process rewrite "Drafts"
```

Actions: `summarize`, `translate`, `rewrite`, `expand`, `toc` — processes every `.md` file in the folder using the agent.

### 🪟 Popout Chat Window
Click **Popout** in the chat header to open the chat in its own window. Keep Obsidian on one screen and the AI chat on another — perfect for reading PDFs while asking questions.

### 🔄 UI Sync — No More Desync
Agent and Thinking toggles now share one source of truth between Settings and the chat header. When you toggle in either place, the other updates instantly.

---

## 🧹 Obsidian Review — All Warnings Resolved

| Warning | Fix |
|---|---|
| **Gemini streaming URL** | `chatStream()` no longer breaks when model names contain `/` |
| **Perplexity model IDs** | Native API now uses correct format — no more `perplexity/` prefix |
| **Worker budget routes** | `/v1/budget-chat` and `/v1/budget-usage` restored (were missing from router) |
| **Admin reset-devices** | New endpoint to clear device registrations for license support |
| **Popout reset bug** | Popout no longer destroys your chat session |
| **Custom instructions in budget chat** | `handleBudgetChat` now injects agent instructions |
| **Budget chat system prompt** | Custom instructions now injected in ALL 4 chat modes |

---

## ⚙️ Under the Hood

- **Over 20 review warnings resolved**
- **385 tests** across 27 suites — 0 failures (1 pre-existing skip)
- **Worker:** Deployed with budget routes, admin reset-devices, firebase-rate-limit endpoint
- **TypeScript strict mode:** 0 errors

---

## 📦 Installing v1.6.2



---

## 📦 Installing v1.6.2

```bash
cd "YourVault/.obsidian/plugins"
git clone https://github.com/JosefBelzer/Copilot-Personal.git
cd copilot-personal
npm install
npm run build
```

Or download the ZIP from [Releases](https://github.com/JosefBelzer/Copilot-Personal/releases/tag/1.6.2).

---

*Built with ❤️ by Josef — [Sponsor on GitHub](https://github.com/sponsors/JosefBelzer)*
