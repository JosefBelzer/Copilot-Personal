/**
 * English translations — master reference file (442 keys).
 * All other languages extend from this base.
 */

export const en: Record<string, string> = {

  // ═══════════════════════════════════════════════════════════════
  //  SETTINGS TAB
  // ═══════════════════════════════════════════════════════════════

  "settings.title": "Copilot Personal - Settings",
  "settings.language": "Language / Idioma",
  "settings.languageDesc": "Select the UI language. Changes apply immediately.",

  // API Configuration
  "settings.apiConfiguration": "API Configuration",
  "settings.apiKey": "API Key",
  "settings.apiKeyDesc": "Your API key for {provider} (stored in data.json — NOT encrypted. Do NOT commit to Git.)",
  "settings.licenseKey": "License Key",
  "settings.licenseKeyDesc": "Pro license key from Lemon Squeezy. Leave empty for Free tier.",
  "settings.licenseClearTooltip": "Clear license (revert to Free)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "API URL",
  "settings.apiUrlDesc": "Base URL for the API endpoint",
  "settings.provider": "Provider",
  "settings.providerDesc": "Select the LLM provider",
  "settings.detectModels": "Detect models",
  "settings.detectModelsDesc": "Query LM Studio's /v1/models endpoint to discover loaded models",
  "settings.lmStatusQuerying": "Querying LM Studio...",
  "settings.lmStatusNoModels": "No models found. Load a model in LM Studio first.",
  "settings.lmStatusFound": "Found {count} model(s): {models}",
  "settings.lmStatusError": "Error: {error}. Make sure LM Studio is running.",
  "settings.fallbackModelName": "Model {cap} (fallback)",

  // Provider dropdown names
  "provider.name.auto": "Auto-detect (from URL)",
  "provider.name.deepseek": "DeepSeek",
  "provider.name.openai": "OpenAI",
  "provider.name.anthropic": "Anthropic",
  "provider.name.openrouter": "OpenRouter",
  "provider.name.lmstudio": "LM Studio",
  "provider.name.gemini": "Google Gemini",
  "provider.name.mistral": "Mistral",
  "provider.name.groq": "Groq",
  "provider.name.perplexity": "Perplexity",
  "provider.name.xai": "xAI Grok",
  "provider.name.budget": "💰 Copilot AI (Pro)",

  "settings.budgetTitle": "💰 Copilot AI (free trial + Pro)",

  "settings.budgetEnableDesc": "Free, managed API via Mistral Nemo. No API key needed. Free: 5 queries/day trial. Pro: 50 queries/day, unlimited if you have your own API key.",

  "settings.budgetFreeTrialNotice": "✨ Copilot AI: 5 free queries/day to try! Upgrade to Pro for unlimited.",

  "settings.budgetProRequired": "🔒 Copilot AI requires a Pro license. Upgrade to Pro to use the managed budget API.",

  // Model Configuration
  "settings.modelConfig": "Model Configuration",
  "settings.temperature": "Temperature",
  "settings.temperatureDesc": "Controls randomness (0.0 = deterministic, 2.0 = very random)",
  "settings.maxTokens": "Max Tokens",
  "settings.maxTokensDesc": "Maximum tokens in the response",
  "settings.topP": "Top P",
  "settings.topPDesc": "Nucleus sampling (0.0-1.0). Lower = more focused",
  "settings.topK": "Top K",
  "settings.topKDesc": "Limits token selection to top K (0 = disabled)",
  "settings.presencePenalty": "Presence Penalty",
  "settings.presencePenaltyDesc": "Penalizes repeated tokens (0-2). Higher = less repetition",
  "settings.enableThinking": "Enable thinking mode",
  "settings.enableThinkingDesc": "Use DeepSeek V4 thinking/reasoning (incompatible with temperature/top_p/presence_penalty)",
  "settings.reasoningEffort": "Reasoning effort",
  "settings.reasoningEffortDesc": "Only applies when thinking mode is enabled (DeepSeek V4)",
  "settings.streamResponses": "Stream responses",
  "settings.streamResponsesDesc": "Show response token by token",
  "settings.contextTurns": "Context turns",
  "settings.contextTurnsDesc": "Number of previous turns to include in context",
  "settings.semanticSearch": "Enable semantic search",
  "settings.semanticSearchDesc": "Index your vault for semantic search in chat",
  "settings.semanticSearchProLocked": "🔒 Semantic search requires a Pro license",
  "settings.maxSourceChunks": "Max source chunks",
  "settings.maxSourceChunksDesc": "Number of chunks to retrieve per query",
  "settings.chunkSize": "Chunk size (tokens)",
  "settings.chunkSizeDesc": "Approximate token count per chunk",

  // Web Search
  "settings.webSearch": "Enable web search",
  "settings.webSearchDesc": "Allow web search via browser-use microservice",
  "settings.webSearchProLocked": "🔒 Web search requires a Pro license",
  "settings.webSearchServerUrl": "Web search server URL",
  "settings.webSearchServerUrlDesc": "URL of the browser-use Python microservice",
  "settings.webSearchMaxResults": "Max search results",
  "settings.webSearchMaxResultsDesc": "How many web results to return",
  "settings.webSearchToken": "Web search token",
  "settings.webSearchTokenDesc": "Authentication token shared with the Python search server (must match server's COPILOT_WEB_TOKEN)",
  "settings.webSearchTokenPlaceholder": "your-secure-token",

  // Vision
  "settings.vision": "Enable vision",
  "settings.visionDesc": "Use vision model for images",
  "settings.visionNotSupported": "Not available for this provider",
  "settings.visionProLocked": "🔒 Vision requires a Pro license",
  "settings.imageDrop": "Enable image drop",
  "settings.imageDropDesc": "Allow drag & drop of images into chat",

  // Chat History
  "settings.saveChatHistory": "Save chat history",
  "settings.saveChatHistoryDesc": "Save conversations as markdown files in the vault",
  "settings.chatHistoryFolder": "Chat history folder",
  "settings.chatHistoryFolderDesc": "Folder to store chat history files",

  // Memory
  "settings.enableMemory": "Enable memory",
  "settings.enableMemoryDesc": "Remember key facts between chat sessions",
  "settings.memoryFolder": "Memory folder",
  "settings.memoryFolderDesc": "Folder to store memory files",
  "settings.maxMemories": "Max memories",
  "settings.maxMemoriesDesc": "Number of recent memories to load on new chat",

  // Agent Mode
  "settings.agentMode": "Enable agent mode",
  "settings.agentModeDesc": "Let the AI use tools and perform multiple actions autonomously",
  "settings.agentModeToolCallingNA": "Tool calling not available for this provider",
  "settings.agentModeProLocked": "🔒 Agent mode requires a Pro license",
  "settings.maxAgentIterations": "Max agent iterations",
  "settings.maxAgentIterationsDesc": "Maximum number of tool calls per agent run",
  "settings.agentInstructions": "Custom agent instructions",
  "settings.agentInstructionsDesc": "System prompt additions for the agent. These instructions are appended to every agent request — use them to set behavior, language, tone, or expertise.",

  "settings.lmDetectTitle": "LM Studio - Detect Models",
  "settings.lmStatusDefault": "Click 'Detect' to fetch available models from LM Studio.",
  "settings.lmDetectButton": "Detect",
  "settings.lmStatusFoundNotice": "Found {count} model(s) in LM Studio. First model ({model}) set as default.",

  // Model names
  "settings.chatModel": "Chat Model",
  "settings.chatModelDesc": "Model to use for chat completions",
  "settings.embeddingModel": "Embedding Model",
  "settings.embeddingModelDesc": "Model for embeddings{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ NOT supported by this provider)",
  "settings.visionModel": "Vision Model",
  "settings.visionModelDesc": "Model to use for vision/image tasks",

  // Section headers
  "settings.chatOptions": "Chat Options",
  "settings.chatHistory": "Chat History",
  "settings.memory": "Memory",
  "settings.lmVisionTitle": "LM Studio (Image Analysis)",
  "settings.sectionSemanticSearch": "Semantic Search (RAG)",
  "settings.sectionWebSearch": "Web Search (browser-use)",
  "settings.sectionVision": "Vision / Images",
  "settings.sectionAgentMode": "Agent Mode",

  // Reasoning
  "settings.reasoningHigh": "High",
  "settings.reasoningMax": "Max",

  // Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 Multi-Provider Fallback",
  "settings.fallbackFor": "Fallback for {cap}",
  "settings.fallbackSelect": "Select a provider that DOES support {cap}",
  "settings.fallbackProLocked": "🔒 Requires Pro license",
  "settings.fallbackModelDesc": "Model name for {cap} in fallback provider",
  "settings.multiProviderProNotice": "Multi-provider fallback requires a Pro license. With Pro, you can use a second provider for capabilities your primary provider lacks.",
  "settings.providerNoSupport": "{provider} does not support {cap}",
  "settings.providerSelectSupporting": "Select a provider that DOES support {cap}",

  // ═══════════════════════════════════════════════════════════════
  //  CHAT VIEW
  // ═══════════════════════════════════════════════════════════════

  // Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "Start a new chat",
  "chat.saveChatTooltip": "Save chat to file",
  "chat.browseHistoryTooltip": "Browse saved chats",
  "chat.agentToggleTooltip": "Toggle agent mode (autonomous tool use)",
  "chat.thinkToggleTooltip": "Enable thinking mode (model reasons before responding)",
  "chat.sendPlaceholder": "Type your message... (Enter to send, Shift+Enter for newline)",
  "chat.headerPrivacyLocal": "🔒 Local",
  "chat.headerPrivacyCloud": "☁️ Cloud",
  "chat.headerPrivacyLocalTooltip": "Data processed locally. Never leaves your device.",
  "chat.headerPrivacyCloudTooltip": "Data sent to external server. Check Settings > API Configuration.",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.headerTierProTooltip": "Pro license active — all features unlocked",
  "chat.headerTierFreeTooltip": "Free tier — 50 messages/day, limited features",

  // Status
  "chat.statusReady": "Ready",
  "chat.statusAgentModeOn": "Agent mode ON",
  "chat.statusThinking": "Thinking...",
  "chat.statusAgentThinking": "Agent thinking...",
  "chat.statusError": "Error",
  "chat.statusStopped": "Stopped",
  "chat.statusNewChat": "New chat started",
  "chat.statusThinkingOn": "Thinking ON",
  "chat.statusSearching": "Searching the web: \"{query}\"...",
  "chat.statusSearchError": "Search error",
  "chat.statusSaved": "Saved to {path}",
  "chat.statusSaveFailed": "Save failed: {error}",
  "chat.statusParsing": "Parsing {name}...",
  "chat.statusPdfParsed": "PDF parsed: {name}",
  "chat.statusImageReady": "Image ready: {name}",
  "chat.statusAgentError": "Agent error",
  "chat.statusExported": "Chat exported to {fileName}",
  "chat.statusExportFailed": "Export failed: {error}",

  // Buttons
  "chat.btnNew": "New",
  "chat.btnSave": "Save",
  "chat.btnHistory": "History",
  "chat.btnSend": "Send",
  "chat.btnStop": "Stop",
  "chat.btnAgent": "Agent",
  "chat.btnThink": "Think",

  // Messages — license
  "chat.licenseAgentRequired": "🔒 Agent mode requires a Pro license. Settings → License Key.",
  "chat.licenseWebSearchRequired": "🔒 Web search requires a Pro license. Settings → License Key.",

  // Messages — rate limit
  "chat.rateLimitReached": "⚠️ Daily limit reached ({used}/{limit}). Upgrade to Pro for unlimited messages.",

  // Messages — crash recovery
  "chat.crashRecovery": "📝 Previous session restored (crash recovery).",
  "chat.memoriesLoaded": "📝 Loaded {count} previous summaries.",

  // Messages — agent
  "chat.agentStepProgress": "⏳ Step {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ Model claims completion but only {written} of {expected} notes were saved. {missing} missing.",
  "chat.agentFallback": "⚠️ Agent mode failed — fallback response:\n\n{response}",
  "chat.agentError": "Agent error: {message}",
  "chat.agentWarnNotSaved": "⚠️ **NOTE: The model claimed to have saved/modified a note, but NO write tool (update_note, create_note) or <!--save:--> marker was used. The claim is a hallucination.**",
  "chat.budgetModelLabel": "💰 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 Agent mode is not yet available with Copilot AI. Switch to a different provider (DeepSeek, OpenAI, etc.) in Settings → Provider to use Agent Mode.",

  // Messages — auto-save
  "chat.autoSaveResult": "📝 Auto-saved {saved}/{total} notes:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 Updated {path} ({changed} lines changed)",

  // Messages — chat
  "chat.greeting": "Hello! I'm your personal AI copilot. Ask me anything, or drag notes and files into the chat.",
  "chat.noSavedChats": "No saved chats found.",
  "chat.noMessagesToSave": "No messages to save.",
  "chat.chatSaved": "Chat saved to {path}",
  "chat.chatSaveFailed": "Failed to save chat: {error}",
  "chat.savedChatsFound": "📂 {count} saved chats:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "Please provide a search query after `!search`.",
  "chat.searching": "Searching: {query}",
  "chat.webSearchFailed": "Web search failed: {error}",
  "chat.imageDroppedInfo": "Image dropped: {name} (enable vision in settings to analyze images)",
  "chat.fileDroppedUnsupported": "File dropped: {name} (unsupported format)",
  "chat.fileDroppedError": "Error processing {name}: {error}",

  // Delete button
  "chat.deleteMessageTooltip": "Delete this message",

  // Loading states
  "chat.statusReading": "📕 Reading file...",
  "chat.statusSearchingVault": "🔍 Searching vault...",
  "chat.statusAnalyzingImage": "🖼️ Analyzing image...",
  "chat.statusGeneratingEmbeddings": "🧮 Generating embeddings...",
  "chat.statusCompacting": "📦 Compacting context...",
  "chat.statusDeepThinking": "💭 Thinking...",

  // Save/Export role labels
  "chat.saveRoleYou": "**You**",
  "chat.saveRoleAssistant": "**Assistant**",
  "chat.saveRoleSystem": "**System**",
  "chat.exportRoleUser": "👤 User",
  "chat.exportRoleAssistant": "🤖 Assistant",
  "chat.exportRoleSystem": "🔧 System",

  // Avatars
  "chat.roleUser": "You",
  "chat.roleAssistant": "Assistant",
  "chat.roleSystem": "System",

  // Slash commands
  "chat.slashSummarize": "Summarize the following content concisely, highlighting key points:\n\n",
  "chat.slashTranslate": "Translate the following content to English, preserving formatting and technical terms:\n\n",
  "chat.slashExplain": "Explain the following concept in detail, with examples and practical applications:\n\n",
  "chat.slashToc": "Generate a structured table of contents for the following content:\n\n",
  "chat.slashFlashcards": "Create 10 Q&A flashcards in Q: ... A: ... format:\n\n",
  "chat.slashRewrite": "Rewrite the following content improving clarity, structure, and style:\n\n",
  "chat.slashExpand": "Expand the following content adding more details, context, and examples:\n\n",

  // ═══════════════════════════════════════════════════════════════
  //  COMMANDS (main.ts)
  // ═══════════════════════════════════════════════════════════════

  "commands.openChat": "Open Copilot Chat",
  "commands.sendSelection": "Send selection to Copilot",
  "commands.indexVault": "Copilot: Index vault for semantic search",
  "commands.clearIndex": "Copilot: Clear semantic search index",
  "commands.newChat": "Copilot: New chat",
  "commands.saveChat": "Copilot: Save chat to file",
  "commands.quickAsk": "Copilot: Quick Ask",
  "commands.exportMd": "Copilot: Export chat as Markdown",
  "commands.exportJson": "Copilot: Export chat as JSON",

  // Notices — main.ts
  "notices.noTextSelected": "No text selected.",
  "notices.indexingVault": "Indexing vault...",
  "notices.indexingProgress": "Indexing: {current}/{total} files",
  "notices.indexCorrupted": "Index file appears corrupted or failed to load. Try clearing and re-indexing.",
  "notices.indexEmpty": "Vault indexing complete, but no files were indexed. Check excluded folders or try again.",
  "notices.indexEmptyVectors": "Vault indexing produced EMPTY vectors. Your embedding model does not generate embeddings. Load a dedicated embedding model (nomic-embed-text, all-MiniLM-L6-v2) in LM Studio and set it in Settings → Embedding Model, then clear & re-index.",
  "notices.indexComplete": "Vault indexing complete! {chunks} chunks indexed.",
  "notices.indexFailed": "Indexing failed: {error}",
  "notices.indexCleared": "Index cleared.",

  // Quick Ask
  "quickAsk.title": "Quick Ask",
  "quickAsk.placeholder": "Ask anything...",
  "quickAsk.btnAsk": "Ask",
  "quickAsk.btnThinking": "Thinking...",
  "quickAsk.error": "Error: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  LICENSE
  // ═══════════════════════════════════════════════════════════════

  "license.proActivated": "✅ Pro license activated successfully.",
  "license.freeActivated": "🆓 Free mode activated.",
  "license.rejected": "License rejected: {reason}",
  "license.serverError": "Server error ({status}). Verify your key in Lemon Squeezy.",
  "license.offlineError": "Could not reach license server. Check your internet connection.",
  "license.demoKeyDenied": "Demo key requires debug mode (COPILOT_DEBUG=1)",
  "license.dailyLimitReached": "⚠️ Daily limit reached. Upgrade to Pro for unlimited messages.",

  // ═══════════════════════════════════════════════════════════════
  //  PROVIDER & SERVICES
  // ═══════════════════════════════════════════════════════════════

  "provider.unsupportedTask": "No provider available for this task ({task}). Configure a provider in Settings.",
  "provider.emptyEmbeddingResponse": "No embedding returned from the provider. Verify that the selected model supports embeddings.",
  "provider.zeroVectorEmbedding": "Model returned a zero-vector embedding. Verify that the selected model is a real embedding model (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "All models are busy or unavailable. Try again later.",
  "provider.anthropicNoEmbeddings": "Anthropic does not support embeddings. Configure a different provider (DeepSeek, OpenAI, or LM Studio) for embeddings in Settings.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic does not support embeddings.",

  // ═══════════════════════════════════════════════════════════════
  //  CIRCUIT BREAKER
  // ═══════════════════════════════════════════════════════════════

  "circuit.rateLimited": "Rate limited. Retrying in {seconds}s...",
  "circuit.open": "API unavailable after {failures} failures. Circuit open for {cooldown}s.",
  "circuit.retrying": "API error (attempt {attempt}/3). Retrying in 2s...",
  "circuit.statusOpen": "API disabled for {remaining}s",
  "circuit.statusDegraded": "{failures} recent failures",
  "circuit.statusClosed": "OK",

  // ═══════════════════════════════════════════════════════════════
  //  WEB SEARCH CLIENT
  // ═══════════════════════════════════════════════════════════════

  "webSearch.urlNotConfigured": "Web search server URL not configured.",
  "webSearch.serverError": "Search server returned {status}: {text}",
  "webSearch.noResults": "No results found.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nSnippet: {snippet}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT
  // ═══════════════════════════════════════════════════════════════

  "agent.maxIterationsReached": "Maximum tool call iterations reached.",
  "agent.fallbackResponse": "I completed the analysis but couldn't generate a final response.",
  "agent.fallbackTruncated": "I reached the maximum number of tool calls. Based on what I found, the vault may not have enough information. Try being more specific or indexing additional notes.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_note
  // ═══════════════════════════════════════════════════════════════

  "tools.readNote.description": "Reads the full content of a note from the vault. Accepts note name with or without .md extension and with or without path. E.g. '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. Ideal for consulting previously saved notes.",
  "tools.readNote.paramPath": "Note name or path (with or without .md, with or without folder). E.g. '01_02_Qualitaet_als_Erfolgsfaktor' or '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "Error: no path provided.",
  "tools.readNote.error.invalidPath": "Error: invalid path.",
  "tools.readNote.autoFound": "[Auto-found: {path}]",
  "tools.readNote.foundMultiple": "Found {count} notes with name \"{name}\". Specify the full path:\n{paths}",
  "tools.readNote.exactMatchNotFound": "Exact match not found for \"{name}\". Similar notes:\n{paths}",
  "tools.readNote.error.notFound": "Error: the note \"{path}\" does not exist in the vault.",
  "tools.readNote.error.readError": "Error reading \"{path}\": {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_pdf
  // ═══════════════════════════════════════════════════════════════

  "tools.readPdf.description": "Extracts text from a PDF. REQUIRES pagesOnly for large PDFs (>20 pages). Use pagesOnly: '116-138' for specific pages. Use tocOnly: true for the table of contents. Without parameters it only works on PDFs of ≤20 pages.",
  "tools.readPdf.customInstructions": "For read_pdf: ALWAYS use find_files FIRST to locate the PDF. Use pagesOnly to request specific pages. NEVER call read_pdf without first finding the correct path.",
  "tools.readPdf.paramPath": "Path to the PDF in the vault.",
  "tools.readPdf.paramTocOnly": "Only returns the PDF table of contents / TOC.",
  "tools.readPdf.paramPagesOnly": "Specific page range (e.g. '10-20' or '5,8,12').",
  "tools.readPdf.error.noPath": "Error: no path provided.",
  "tools.readPdf.multiplePdfs": "Multiple PDFs match \"{path}\":\n{paths}\nSpecify the exact path.",
  "tools.readPdf.error.notFound": "Error: \"{path}\" does not exist.",
  "tools.readPdf.tooLarge": "The PDF has {pages} pages. Use pagesOnly to read specific pages (e.g. pagesOnly: \"116-138\") or tocOnly: true for the table of contents.",
  "tools.readPdf.noText": "No text found.",
  "tools.readPdf.tocHeader": "[PDF Table of Contents — {pages} total pages]",
  "tools.readPdf.pageHeader": "[Pages {spec} of {total} total]",
  "tools.readPdf.pageLabel": "[Page {num}]",
  "tools.readPdf.totalPages": "[{total} total pages]",
  "tools.readPdf.tocSeparator": "═══ TABLE OF CONTENTS / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ CONTENT ═══",
  "tools.readPdf.truncationNotice": "[Note: PDF has {pages} pages. Only the first 500 are shown.]",
  "tools.readPdf.error.generic": "Error: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: create_note
  // ═══════════════════════════════════════════════════════════════

  "tools.createNote.description": "Creates a new note in the vault with the given title and content (Markdown format).",
  "tools.createNote.paramTitle": "Note title (without extension).",
  "tools.createNote.paramContent": "Note content in Markdown format.",
  "tools.createNote.error.noTitle": "Error: no title provided.",
  "tools.createNote.error.noContent": "Error: no content provided.",
  "tools.createNote.error.alreadyExists": "Error: a note already exists with the name \"{name}\".",
  "tools.createNote.success": "Note created successfully: \"{name}\" ({length} characters).",
  "tools.createNote.error.createError": "Error creating note: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: update_note
  // ═══════════════════════════════════════════════════════════════

  "tools.updateNote.description": "Overwrites the content of an existing note in the vault. Use the full path. If the note does not exist, it returns an error (use create_note for new notes).",
  "tools.updateNote.paramPath": "Full path of the note to modify (e.g. '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "New full content of the note in Markdown format.",
  "tools.updateNote.error.noPath": "Error: no path provided.",
  "tools.updateNote.error.noContent": "Error: no content provided.",
  "tools.updateNote.error.notFound": "Error: the note \"{path}\" does not exist. Use create_note to create a new one.",
  "tools.updateNote.error.mismatch": "Error: The note \"{path}\" was reported as updated but the content does not match (expected {expected} chars, read {actual} chars).",
  "tools.updateNote.success": "Note \"{path}\" updated successfully ({length} characters).",
  "tools.updateNote.error.updateError": "Error updating \"{path}\": {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: find_files
  // ═══════════════════════════════════════════════════════════════

  "tools.findFiles.description": "Searches files in the vault by name pattern. Use this to LOCATE files and get their paths (e.g. 'find me the PDF named ISO'). For date-based search use search_vault_by_timeframe instead.",
  "tools.findFiles.paramNameQuery": "Part of the file name to search for (e.g. 'MapaPolitico', 'diagram', 'photo.png'). Case-insensitive.",
  "tools.findFiles.paramExtension": "Filter by extension (e.g. 'png', 'pdf', 'md'). Optional.",
  "tools.findFiles.error.emptyQuery": "Error: empty search term.",
  "tools.findFiles.noResults": "No files found matching \"{query}\"{extension}.",
  "tools.findFiles.results": "{results}\n... and {more} more.",
  "tools.findFiles.error.searchError": "Error searching files: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: list_notes
  // ═══════════════════════════════════════════════════════════════

  "tools.listNotes.description": "Lists notes in a vault folder (or root if not specified).",
  "tools.listNotes.paramFolder": "Folder to list (optional). If not specified, lists root.",
  "tools.listNotes.noNotes": "No notes found.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_fulltext
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultFulltext.description": "Searches for EXACT text matches across all vault notes. Faster than semantic search. Use this when you know the exact words or phrases.",
  "tools.searchVaultFulltext.paramQuery": "Text to search.",
  "tools.searchVaultFulltext.error.emptyQuery": "Error: empty query.",
  "tools.searchVaultFulltext.notFound": "Did not find \"{query}\" in any note.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_semantic
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultSemantic.description": "Searches vault notes by CONCEPT or IDEA (semantic/RAG search using vector embeddings). Returns relevant fragments even if the exact words don't match. Use this for finding content by meaning, NOT for exact text matches (use search_vault_fulltext for exact text).",
  "tools.searchVaultSemantic.paramQuery": "The search query.",
  "tools.searchVaultSemantic.paramStartDate": "Optional filter: ISO start date.",
  "tools.searchVaultSemantic.paramEndDate": "Optional filter: ISO end date.",
  "tools.searchVaultSemantic.error.emptyQuery": "Error: empty query.",
  "tools.searchVaultSemantic.error.notEnabled": "Error: semantic search is not enabled. Enable 'enableSemanticSearch' in settings and index the vault.",
  "tools.searchVaultSemantic.noResults": "No relevant fragments found for the query.",
  "tools.searchVaultSemantic.fragment": "[Fragment {index}] ({path}, relevance: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "Error in semantic search: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_by_timeframe
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultByTimeframe.description": "Searches vault notes by modification DATE RANGE (ISO 8601). ONLY use when the user EXPLICITLY requests notes from a specific time period (e.g. 'show notes from last month'). Do NOT use this when the user mentions a time word in passing (like 'the PDF I downloaded yesterday') — that is a find_files task for locating files by name.",
  "tools.searchVaultByTimeframe.paramStartDate": "Start date in ISO 8601 format, e.g. 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "End date in ISO 8601 format, e.g. 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "Error: invalid dates. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "No notes found modified between {start} and {end}.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nModified: {mtime}\nContent: {snippet}...",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_web
  // ═══════════════════════════════════════════════════════════════

  "tools.searchWeb.description": "Performs a web search using an automated browser and returns the most relevant results (title, url, snippet).",
  "tools.searchWeb.paramQuery": "The web search query.",
  "tools.searchWeb.error.emptyQuery": "Error: empty query.",
  "tools.searchWeb.noResults": "No results found for: \"{query}\".",
  "tools.searchWeb.error.generic": "Error in web search: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: analyze_image
  // ═══════════════════════════════════════════════════════════════

  "tools.analyzeImage.description": "Analyzes an image from the vault and provides a detailed description. Use the image path (e.g. 'folder/diagram.png'). Supports png, jpg, jpeg, gif, webp.",
  "tools.analyzeImage.paramImagePath": "Path to the image file within the vault.",
  "tools.analyzeImage.error.noPath": "Error: no image path provided.",
  "tools.analyzeImage.error.configError": "Error: {error}",
  "tools.analyzeImage.noResponse": "No response received from the vision model.",
  "tools.analyzeImage.error.apiError": "API error: {message}",
  "tools.analyzeImage.error.connectionRefused": "Error: Could not connect to the vision server. Make sure your local vision model is running with a compatible model loaded.",
  "tools.analyzeImage.error.generic": "Error analyzing the image: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_youtube_transcript
  // ═══════════════════════════════════════════════════════════════

  "tools.extractYoutubeTranscript.description": "Gets the transcript (subtitles) of a YouTube video from its URL.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "Error: no video URL provided.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "Error: could not extract video ID from URL: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "No transcript found for this video (subtitles may not be available).",
  "tools.extractYoutubeTranscript.header": "Transcript of video {videoId}:",
  "tools.extractYoutubeTranscript.error.generic": "Error getting transcript: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: render_pdf_pages
  // ═══════════════════════════════════════════════════════════════

  "tools.renderPdfPages.description": "Renders specific PDF pages as PNG images and saves them in the vault. Returns exact paths (e.g. 'Resources/PDF_images/PDF_page_40.png'). IMPORTANT: use the EXACT paths returned by this tool for ![[embeds]]. Do NOT invent paths.",
  "tools.renderPdfPages.paramPath": "Path to the PDF in the vault.",
  "tools.renderPdfPages.paramPages": "Pages to render (e.g. '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "Folder to save the images (optional, default: next to PDF).",
  "tools.renderPdfPages.paramScale": "Render scale (1.0 = 72 DPI, 2.0 = 144 DPI). Default: 2.0.",
  "tools.renderPdfPages.error.noPath": "Error: no PDF path provided.",
  "tools.renderPdfPages.error.noPages": "Error: no pages specified.",
  "tools.renderPdfPages.multiplePdfs": "Multiple PDFs match \"{path}\". Specify the exact path.",
  "tools.renderPdfPages.error.notFound": "Error: \"{path}\" does not exist.",
  "tools.renderPdfPages.error.invalidRange": "Error: invalid page range: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "Error: could not create output folder \"{folder}\": {error}",
  "tools.renderPdfPages.error.noValidPages": "Error: no valid pages. The PDF has {pages} pages.",
  "tools.renderPdfPages.error.canvas": "Error: could not create canvas 2D context for page {page}.",
  "tools.renderPdfPages.error.renderError": "Error rendering page {page}: {error}",
  "tools.renderPdfPages.result": "Rendered {rendered}/{total} pages:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "Error rendering PDF pages: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_pdf_images
  // ═══════════════════════════════════════════════════════════════

  "tools.extractPdfImages.description": "Extracts embedded JPG/PNG images from PDF pages. Requires 'unpdf' installed (npm install unpdf). If no raster images (vector graphics/diagrams), renders the full page as PNG. Use render_pdf_pages if you only need full pages.",
  "tools.extractPdfImages.paramPath": "Path to the PDF in the vault.",
  "tools.extractPdfImages.paramPages": "Pages (e.g. '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "Output folder (optional).",
  "tools.extractPdfImages.error.pathAndPages": "Error: path and pages required.",
  "tools.extractPdfImages.multiplePdfs": "Multiple PDFs match. Specify exact path.",
  "tools.extractPdfImages.error.notFound": "Error: \"{path}\" does not exist.",
  "tools.extractPdfImages.error.invalidRange": "Error: invalid range: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "Error: pages out of range ({pages} total).",
  "tools.extractPdfImages.result": "Extracted {count} images from {pages} pages:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (full page)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ Page {page}: rendering failed",
  "tools.extractPdfImages.error.canvas": "❌ Page {page}: could not create canvas",
  "tools.extractPdfImages.error.generic": "Error: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_vault_stats
  // ═══════════════════════════════════════════════════════════════

  "tools.getVaultStats.description": "Returns vault statistics: number of notes, total size, folders.",
  "tools.getVaultStats.stats": "Notes: {notes}\nTotal size: ~{size}\nFolders: {folders}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_active_file
  // ═══════════════════════════════════════════════════════════════

  "tools.getActiveFile.description": "Returns the content of the file currently open in the editor.",
  "tools.getActiveFile.noFileOpen": "No file is currently open.",
  "tools.getActiveFile.error": "Error: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_frontmatter
  // ═══════════════════════════════════════════════════════════════

  "tools.getFrontmatter.description": "Extracts the YAML frontmatter (metadata) from a note. The frontmatter is the section between --- markers at the top of a note. Use this to read tags, aliases, dates, or any custom YAML fields.",
  "tools.getFrontmatter.paramPath": "Path to the note.",
  "tools.getFrontmatter.error.notFound": "Error: \"{path}\" does not exist.",
  "tools.getFrontmatter.noFrontmatter": "No frontmatter.",
  "tools.getFrontmatter.error.generic": "Error: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT — ToolRegistry
  // ═══════════════════════════════════════════════════════════════

  "tools.registry.errorExecute": "Error executing tool \"{name}\": {error}",
  "tools.registry.errorNotFound": "Tool \"{name}\" not registered",

  // ═══════════════════════════════════════════════════════════════
  //  ERROR — Generic
  // ═══════════════════════════════════════════════════════════════

  "errors.unknown": "Unknown error",
  "errors.fetchFailed": "Fetch failed",

  // ═══════════════════════════════════════════════════════════════
  //  PLACEHOLDERS & LABELS (shared across settings)
  // ═══════════════════════════════════════════════════════════════

  "placeholders.apiKey": "sk-...",
  "placeholders.apiUrl": "https://api.deepseek.com",
  "placeholders.licenseKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "placeholders.temperature": "0.7",
  "placeholders.maxTokens": "4096",
  "placeholders.topP": "0.95",
  "placeholders.topK": "20",
  "placeholders.presencePenalty": "1.5",
  "placeholders.contextTurns": "5",
  "placeholders.maxSourceChunks": "5",
  "placeholders.chunkSize": "500",
  "placeholders.webSearchUrl": "http://localhost:8000/search",
  "placeholders.webSearchMaxResults": "3",
  "placeholders.webSearchToken": "your-secure-token",
  "placeholders.chatHistoryFolder": "copilot-chats",
  "placeholders.memoryFolder": "copilot/memory",
  "placeholders.maxMemories": "3",
  "placeholders.maxAgentIterations": "5",
  "placeholders.lmStudioUrl": "http://localhost:1234/v1",
  "placeholders.lmStudioModel": "qwen2.5-vl-27b-instruct",
  "placeholders.lmStudioApiKey": "not-needed",
  "placeholders.embeddingModel": "nomic-embed-text",
  "placeholders.visionModel": "qwen2.5-vl-27b-instruct",
  "placeholders.chatModel": "deepseek-v4-flash",

  "labels.unknown": "Unknown error",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ not supported)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "Embeddings",
  "labels.vision": "Vision",
  "labels.lmStudio": "LM Studio",
};
