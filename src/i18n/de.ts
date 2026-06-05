export const de: Record<string, string> = {
  "settings.title": "Copilot Personal - Einstellungen",
  "settings.language": "Sprache / Language",
  "settings.languageDesc": "Wählen Sie die UI-Sprache. Änderungen werden sofort übernommen.",
  "settings.apiKey": "API-Schlüssel",
  "settings.apiKeyDesc": "Ihr API-Schlüssel für {provider}",
  "settings.licenseKey": "Lizenzschlüssel",
  "settings.licenseKeyDesc": "Pro-Lizenzschlüssel von Lemon Squeezy. Für Free-Tier leer lassen.",
  "settings.provider": "Anbieter",
  "settings.providerDesc": "Wählen Sie den LLM-Anbieter",
  "settings.chatModel": "Chat-Modell",
  "settings.embeddingModel": "Embedding-Modell",
  "settings.visionModel": "Vision-Modell",
  "settings.temperature": "Temperatur",
  "settings.maxTokens": "Max. Tokens",
  "settings.streamResponses": "Antworten streamen",
  "settings.contextTurns": "Kontextrunden",
  "settings.semanticSearch": "Semantische Suche aktivieren",
  "settings.semanticSearchProLocked": "🔒 Semantische Suche erfordert Pro-Lizenz",
  "settings.webSearch": "Websuche aktivieren",
  "settings.webSearchProLocked": "🔒 Websuche erfordert Pro-Lizenz",
  "settings.vision": "Vision aktivieren",
  "settings.visionProLocked": "🔒 Vision erfordert Pro-Lizenz",
  "settings.agentMode": "Agentenmodus aktivieren",
  "settings.agentModeDesc": "KI kann Werkzeuge autonom nutzen",
  "settings.agentModeProLocked": "🔒 Agentenmodus erfordert Pro-Lizenz",
  "settings.saveChatHistory": "Chat-Verlauf speichern",
  "settings.enableMemory": "Speicher aktivieren",
  "settings.enableMemoryDesc": "Wichtige Fakten zwischen Sitzungen merken",
  "settings.maxMemories": "Max. Erinnerungen",
  "settings.maxAgentIterations": "Max. Agenteniterationen",
  "settings.multiProviderFallback": "🔄 Multi-Anbieter-Fallback",
  "settings.budgetTitle": "Budget-KI (Pro)",
  "settings.budgetEnable": "Copilot Budget-KI nutzen",
  "settings.budgetEnableDesc": "Verwaltete API über Mistral Nemo. Kein API-Schlüssel nötig. Tägliche Limits.",
  "settings.detectModels": "Modelle erkennen",
  "settings.detectModelsDesc": "LM Studio /v1/models abfragen",
  "settings.chatHistory": "Chat-Verlauf",
  "settings.memory": "Speicher",
  "settings.imageDrop": "Bild-Drop aktivieren",
  "settings.imageDropDesc": "Drag & Drop von Bildern in den Chat erlauben",
  "settings.chatHistoryFolder": "Verlauf-Ordner",
  "settings.memoryFolder": "Speicher-Ordner",

  "chat.btnNew": "Neu",
  "chat.btnSave": "Speichern",
  "chat.btnHistory": "Verlauf",
  "chat.btnSend": "Senden",
  "chat.btnStop": "Stopp",
  "chat.btnAgent": "Agent",
  "chat.btnThink": "Denken",
  "chat.headerPrivacyLocal": "🔒 Lokal",
  "chat.headerPrivacyCloud": "☁️ Cloud",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "Bereit",
  "chat.statusThinking": "Denke...",
  "chat.statusError": "Fehler",
  "chat.greeting": "Hallo! Ich bin Ihr persönlicher KI-Copilot.",
  "chat.licenseAgentRequired": "🔒 Agentenmodus erfordert Pro-Lizenz. Settings → License Key.",
  "chat.rateLimitReached": "⚠️ Tageslimit erreicht ({used}/{limit}). Upgrade auf Pro für unbegrenzte Nachrichten.",
  "chat.crashRecovery": "📝 Vorherige Sitzung wiederhergestellt.",

  "commands.openChat": "Copilot-Chat öffnen",
  "commands.newChat": "Copilot: Neuer Chat",
  "commands.saveChat": "Copilot: Chat speichern",
  "commands.quickAsk": "Copilot: Schnellfrage",
  "commands.exportMd": "Copilot: Chat als Markdown exportieren",
  "commands.exportJson": "Copilot: Chat als JSON exportieren",

  "license.proActivated": "✅ Pro-Lizenz erfolgreich aktiviert.",
  "license.freeActivated": "🆓 Free-Modus aktiviert.",
  "license.dailyLimitReached": "⚠️ Tageslimit erreicht. Upgrade auf Pro für unbegrenzte Nachrichten.",

  // API Configuration
  "settings.apiConfiguration": "API-Konfiguration",
  "settings.licenseClearTooltip": "Lizenz löschen (zu Free zurückkehren)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "API-URL",
  "settings.apiUrlDesc": "Basis-URL für den API-Endpunkt",
  "settings.lmStatusQuerying": "LM Studio wird abgefragt...",
  "settings.lmStatusNoModels": "Keine Modelle gefunden. Laden Sie zuerst ein Modell in LM Studio.",
  "settings.lmStatusFound": "{count} Modell(e) gefunden: {models}",
  "settings.lmStatusError": "Fehler: {error}. Stellen Sie sicher, dass LM Studio läuft.",
  "settings.fallbackModelName": "Modell {cap} (Fallback)",

  // Provider names
  "provider.name.auto": "Auto-Erkennung (von URL)",
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

  // Budget
  "settings.budgetProRequired": "🔒 Copilot AI erfordert eine Pro-Lizenz. Upgrade auf Pro, um die verwaltete Budget-API zu nutzen.",

  // Model Configuration
  "settings.modelConfig": "Modellkonfiguration",
  "settings.temperatureDesc": "Steuert die Zufälligkeit (0,0 = deterministisch, 2,0 = sehr zufällig)",
  "settings.maxTokensDesc": "Maximale Tokens in der Antwort",
  "settings.topP": "Top P",
  "settings.topPDesc": "Nucleus-Sampling (0,0–1,0). Niedriger = fokussierter",
  "settings.topK": "Top K",
  "settings.topKDesc": "Begrenzt die Token-Auswahl auf die besten K (0 = deaktiviert)",
  "settings.presencePenalty": "Präsenzstrafe",
  "settings.presencePenaltyDesc": "Bestraft wiederholte Token (0–2). Höher = weniger Wiederholungen",
  "settings.enableThinking": "Denkmodus aktivieren",
  "settings.enableThinkingDesc": "DeepSeek V4 Thinking/Reasoning verwenden (nicht kompatibel mit Temperature/Top_P/Presence_Penalty)",
  "settings.reasoningEffort": "Reasoning-Aufwand",
  "settings.reasoningEffortDesc": "Gilt nur, wenn der Denkmodus aktiviert ist (DeepSeek V4)",
  "settings.streamResponsesDesc": "Antwort Token für Token anzeigen",
  "settings.contextTurnsDesc": "Anzahl der vorherigen Runden, die in den Kontext einbezogen werden",
  "settings.semanticSearchDesc": "Ihren Vault für semantische Suche im Chat indizieren",
  "settings.maxSourceChunks": "Max. Quell-Chunks",
  "settings.maxSourceChunksDesc": "Anzahl der abzurufenden Chunks pro Abfrage",
  "settings.chunkSize": "Chunk-Größe (Tokens)",
  "settings.chunkSizeDesc": "Ungefähre Token-Anzahl pro Chunk",

  // Web Search
  "settings.webSearchDesc": "Websuche über den Browser-Use-Microservice erlauben",
  "settings.webSearchServerUrl": "Websuch-Server-URL",
  "settings.webSearchServerUrlDesc": "URL des Browser-Use-Python-Microservice",
  "settings.webSearchMaxResults": "Max. Suchergebnisse",
  "settings.webSearchMaxResultsDesc": "Wie viele Webergebnisse zurückgegeben werden sollen",
  "settings.webSearchToken": "Websuch-Token",
  "settings.webSearchTokenDesc": "Authentifizierungs-Token, das mit dem Python-Suchserver geteilt wird (muss mit COPILOT_WEB_TOKEN des Servers übereinstimmen)",
  "settings.webSearchTokenPlaceholder": "ihr-sicheres-Token",

  // Vision
  "settings.visionDesc": "Vision-Modell für Bilder verwenden",
  "settings.visionNotSupported": "Nicht verfügbar für diesen Anbieter",

  // Chat History
  "settings.saveChatHistoryDesc": "Konversationen als Markdown-Dateien im Vault speichern",
  "settings.chatHistoryFolderDesc": "Ordner zum Speichern der Chat-Verlaufsdateien",

  // Memory
  "settings.memoryFolderDesc": "Ordner zum Speichern der Speicherdateien",
  "settings.maxMemoriesDesc": "Anzahl der letzten Erinnerungen, die bei einem neuen Chat geladen werden",

  // Agent Mode
  "settings.agentModeToolCallingNA": "Tool-Aufruf nicht verfügbar für diesen Anbieter",
  "settings.maxAgentIterationsDesc": "Maximale Anzahl von Tool-Aufrufen pro Agenten-Durchlauf",

  // LM Studio Detect
  "settings.lmDetectTitle": "LM Studio – Modelle erkennen",
  "settings.lmStatusDefault": "Klicken Sie auf „Erkennen“, um verfügbare Modelle von LM Studio abzurufen.",
  "settings.lmDetectButton": "Erkennen",
  "settings.lmStatusFoundNotice": "{count} Modell(e) in LM Studio gefunden. Erstes Modell ({model}) als Standard festgelegt.",

  // Model names
  "settings.chatModelDesc": "Modell für Chat-Abschlüsse",
  "settings.embeddingModelDesc": "Modell für Embeddings{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ NICHT von diesem Anbieter unterstützt)",
  "settings.visionModelDesc": "Modell für Vision-/Bildaufgaben",

  // Section headers
  "settings.chatOptions": "Chat-Optionen",
  "settings.lmVisionTitle": "LM Studio (Bildanalyse)",
  "settings.sectionSemanticSearch": "Semantische Suche (RAG)",
  "settings.sectionWebSearch": "Websuche (browser-use)",
  "settings.sectionVision": "Vision / Bilder",
  "settings.sectionAgentMode": "Agentenmodus",

  // Reasoning
  "settings.reasoningHigh": "Hoch",
  "settings.reasoningMax": "Maximal",

  // Multi-Provider Fallback
  "settings.fallbackFor": "Fallback für {cap}",
  "settings.fallbackSelect": "Wählen Sie einen Anbieter, der {cap} UNTERSTÜTZT",
  "settings.fallbackProLocked": "🔒 Erfordert Pro-Lizenz",
  "settings.fallbackModelDesc": "Modellname für {cap} beim Fallback-Anbieter",
  "settings.multiProviderProNotice": "Multi-Anbieter-Fallback erfordert eine Pro-Lizenz. Mit Pro können Sie einen zweiten Anbieter für Fähigkeiten nutzen, die Ihrem primären Anbieter fehlen.",
  "settings.providerNoSupport": "{provider} unterstützt {cap} nicht",
  "settings.providerSelectSupporting": "Wählen Sie einen Anbieter, der {cap} UNTERSTÜTZT",

  // Chat — Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "Neuen Chat starten",
  "chat.saveChatTooltip": "Chat in Datei speichern",
  "chat.browseHistoryTooltip": "Gespeicherte Chats durchsuchen",
  "chat.agentToggleTooltip": "Agentenmodus umschalten (autonome Werkzeugnutzung)",
  "chat.thinkToggleTooltip": "Denkmodus aktivieren (Modell denkt nach, bevor es antwortet)",
  "chat.sendPlaceholder": "Geben Sie Ihre Nachricht ein… (Enter zum Senden, Shift+Enter für neue Zeile)",
  "chat.headerPrivacyLocalTooltip": "Daten werden lokal verarbeitet. Verlassen niemals Ihr Gerät.",
  "chat.headerPrivacyCloudTooltip": "Daten werden an einen externen Server gesendet. Prüfen Sie Einstellungen > API-Konfiguration.",
  "chat.headerTierProTooltip": "Pro-Lizenz aktiv – alle Funktionen freigeschaltet",
  "chat.headerTierFreeTooltip": "Free-Tier – 50 Nachrichten/Tag, eingeschränkte Funktionen",

  // Chat — Status
  "chat.statusAgentModeOn": "Agentenmodus EIN",
  "chat.statusAgentThinking": "Agent denkt...",
  "chat.statusStopped": "Gestoppt",
  "chat.statusNewChat": "Neuer Chat gestartet",
  "chat.statusThinkingOn": "Denken EIN",
  "chat.statusSearching": "Durchsuche das Web: „{query}“…",
  "chat.statusSearchError": "Suchfehler",
  "chat.statusSaved": "Gespeichert unter {path}",
  "chat.statusSaveFailed": "Speichern fehlgeschlagen: {error}",
  "chat.statusParsing": "{name} wird analysiert...",
  "chat.statusPdfParsed": "PDF analysiert: {name}",
  "chat.statusImageReady": "Bild bereit: {name}",
  "chat.statusAgentError": "Agentenfehler",
  "chat.statusExported": "Chat exportiert nach {fileName}",
  "chat.statusExportFailed": "Export fehlgeschlagen: {error}",

  // Chat — License
  "chat.licenseWebSearchRequired": "🔒 Websuche erfordert eine Pro-Lizenz. Einstellungen → Lizenzschlüssel.",

  // Chat — Memories
  "chat.memoriesLoaded": "📝 {count} vorherige Zusammenfassungen geladen.",

  // Chat — Agent messages
  "chat.agentStepProgress": "⏳ Schritt {step}: {tool}…",
  "chat.agentWriteCountWarn": "⚠️ Modell behauptet Vollständigkeit, aber nur {written} von {expected} Notizen wurden gespeichert. {missing} fehlen.",
  "chat.agentFallback": "⚠️ Agentenmodus fehlgeschlagen – Fallback-Antwort:\n\n{response}",
  "chat.agentError": "Agentenfehler: {message}",
  "chat.agentWarnNotSaved": "⚠️ **HINWEIS: Das Modell behauptete, eine Notiz gespeichert/geändert zu haben, aber es wurde KEIN Schreibwerkzeug (update_note, create_note) oder <!--save:-->-Marker verwendet. Die Behauptung ist eine Halluzination.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 Der Agentenmodus ist mit Copilot AI noch nicht verfügbar. Wechseln Sie in den Einstellungen unter „Anbieter“ zu einem anderen Anbieter (DeepSeek, OpenAI usw.), um den Agentenmodus zu nutzen.",

  // Chat — Auto-save
  "chat.autoSaveResult": "📝 Auto-gespeichert {saved}/{total} Notizen:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 {path} aktualisiert ({changed} Zeilen geändert)",

  // Chat — Messages
  "chat.noSavedChats": "Keine gespeicherten Chats gefunden.",
  "chat.noMessagesToSave": "Keine Nachrichten zum Speichern.",
  "chat.chatSaved": "Chat gespeichert unter {path}",
  "chat.chatSaveFailed": "Fehler beim Speichern des Chats: {error}",
  "chat.savedChatsFound": "📂 {count} gespeicherte Chats:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "Bitte geben Sie eine Suchanfrage nach `!search` ein.",
  "chat.searching": "Suche: {query}",
  "chat.webSearchFailed": "Websuche fehlgeschlagen: {error}",
  "chat.imageDroppedInfo": "Bild abgelegt: {name} (aktivieren Sie Vision in den Einstellungen, um Bilder zu analysieren)",
  "chat.fileDroppedUnsupported": "Datei abgelegt: {name} (nicht unterstütztes Format)",
  "chat.fileDroppedError": "Fehler bei der Verarbeitung von {name}: {error}",

  // Chat — Delete
  "chat.deleteMessageTooltip": "Diese Nachricht löschen",

  // Chat — Loading states
  "chat.statusReading": "📕 Datei wird gelesen...",
  "chat.statusSearchingVault": "🔍 Vault wird durchsucht...",
  "chat.statusAnalyzingImage": "🖼️ Bild wird analysiert...",
  "chat.statusGeneratingEmbeddings": "🧮 Embeddings werden generiert...",
  "chat.statusCompacting": "📦 Kontext wird komprimiert...",
  "chat.statusDeepThinking": "💭 Denke...",

  // Chat — Save/Export role labels
  "chat.saveRoleYou": "**Sie**",
  "chat.saveRoleAssistant": "**Assistent**",
  "chat.saveRoleSystem": "**System**",
  "chat.exportRoleUser": "👤 Benutzer",
  "chat.exportRoleAssistant": "🤖 Assistent",
  "chat.exportRoleSystem": "🔧 System",

  // Chat — Avatars
  "chat.roleUser": "Sie",
  "chat.roleAssistant": "Assistent",
  "chat.roleSystem": "System",

  // Slash commands
  "chat.slashSummarize": "Fassen Sie den folgenden Inhalt prägnant zusammen und heben Sie die wichtigsten Punkte hervor:\n\n",
  "chat.slashTranslate": "Übersetzen Sie den folgenden Inhalt ins Englische, wobei Sie Formatierung und Fachbegriffe beibehalten:\n\n",
  "chat.slashExplain": "Erklären Sie das folgende Konzept detailliert, mit Beispielen und praktischen Anwendungen:\n\n",
  "chat.slashToc": "Erstellen Sie ein strukturiertes Inhaltsverzeichnis für den folgenden Inhalt:\n\n",
  "chat.slashFlashcards": "Erstellen Sie 10 Q&A-Karteikarten im Format F: ... A: ...:\n\n",
  "chat.slashRewrite": "Schreiben Sie den folgenden Inhalt um und verbessern Sie Klarheit, Struktur und Stil:\n\n",
  "chat.slashExpand": "Erweitern Sie den folgenden Inhalt um weitere Details, Kontext und Beispiele:\n\n",

  // Commands
  "commands.sendSelection": "Auswahl an Copilot senden",
  "commands.indexVault": "Copilot: Vault für semantische Suche indizieren",
  "commands.clearIndex": "Copilot: Semantischen Suchindex löschen",

  // Notices
  "notices.noTextSelected": "Kein Text ausgewählt.",
  "notices.indexingVault": "Vault wird indiziert...",
  "notices.indexingProgress": "Indizierung: {current}/{total} Dateien",
  "notices.indexCorrupted": "Indexdatei scheint beschädigt zu sein oder konnte nicht geladen werden. Versuchen Sie, sie zu löschen und neu zu indizieren.",
  "notices.indexEmpty": "Vault-Indizierung abgeschlossen, aber es wurden keine Dateien indiziert. Überprüfen Sie die ausgeschlossenen Ordner oder versuchen Sie es erneut.",
  "notices.indexEmptyVectors": "Vault-Indizierung hat LEERE Vektoren erzeugt. Ihr Embedding-Modell generiert keine Embeddings. Laden Sie ein dediziertes Embedding-Modell (nomic-embed-text, all-MiniLM-L6-v2) in LM Studio und setzen Sie es in den Einstellungen unter „Embedding-Modell“, dann löschen Sie den Index und indizieren Sie neu.",
  "notices.indexComplete": "Vault-Indizierung abgeschlossen! {chunks} Chunks indiziert.",
  "notices.indexFailed": "Indizierung fehlgeschlagen: {error}",
  "notices.indexCleared": "Index gelöscht.",

  // Quick Ask
  "quickAsk.title": "Schnellfrage",
  "quickAsk.placeholder": "Alles fragen...",
  "quickAsk.btnAsk": "Fragen",
  "quickAsk.btnThinking": "Denke...",
  "quickAsk.error": "Fehler: {error}",

  // License
  "license.rejected": "Lizenz abgelehnt: {reason}",
  "license.serverError": "Serverfehler ({status}). Überprüfen Sie Ihren Schlüssel in Lemon Squeezy.",
  "license.offlineError": "Lizenzserver nicht erreichbar. Überprüfen Sie Ihre Internetverbindung.",
  "license.demoKeyDenied": "Demo-Schlüssel erfordert den Debug-Modus (COPILOT_DEBUG=1)",

  // Provider & Services
  "provider.unsupportedTask": "Kein Anbieter für diese Aufgabe verfügbar ({task}). Konfigurieren Sie einen Anbieter in den Einstellungen.",
  "provider.emptyEmbeddingResponse": "Kein Embedding vom Anbieter zurückgegeben. Überprüfen Sie, ob das ausgewählte Modell Embeddings unterstützt.",
  "provider.zeroVectorEmbedding": "Modell hat ein Nullvektor-Embedding zurückgegeben. Überprüfen Sie, ob das ausgewählte Modell ein echtes Embedding-Modell ist (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "Alle Modelle sind ausgelastet oder nicht verfügbar. Versuchen Sie es später erneut.",
  "provider.anthropicNoEmbeddings": "Anthropic unterstützt keine Embeddings. Konfigurieren Sie einen anderen Anbieter (DeepSeek, OpenAI oder LM Studio) für Embeddings in den Einstellungen.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic unterstützt keine Embeddings.",

  // Circuit Breaker
  "circuit.rateLimited": "Ratenlimit erreicht. Wiederholung in {seconds}s...",
  "circuit.open": "API nach {failures} Fehlern nicht verfügbar. Circuit für {cooldown}s geöffnet.",
  "circuit.retrying": "API-Fehler (Versuch {attempt}/3). Wiederholung in 2s...",
  "circuit.statusOpen": "API für {remaining}s deaktiviert",
  "circuit.statusDegraded": "{failures} kürzliche Fehler",
  "circuit.statusClosed": "OK",

  // Web Search Client
  "webSearch.urlNotConfigured": "Websuch-Server-URL nicht konfiguriert.",
  "webSearch.serverError": "Suchserver hat {status} zurückgegeben: {text}",
  "webSearch.noResults": "Keine Ergebnisse gefunden.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nAuszug: {snippet}",

  // Agent messages
  "agent.maxIterationsReached": "Maximale Anzahl von Tool-Aufrufen erreicht.",
  "agent.fallbackResponse": "Ich habe die Analyse abgeschlossen, konnte aber keine endgültige Antwort generieren.",
  "agent.fallbackTruncated": "Ich habe die maximale Anzahl von Tool-Aufrufen erreicht. Basierend auf dem, was ich gefunden habe, enthält der Vault möglicherweise nicht genügend Informationen. Versuchen Sie, spezifischer zu sein oder zusätzliche Notizen zu indizieren.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // TOOL: read_note
  "tools.readNote.description": "Liest den vollständigen Inhalt einer Notiz aus dem Vault. Akzeptiert Notiznamen mit oder ohne .md-Erweiterung und mit oder ohne Pfad. Z. B. „01_02_Qualitaet_als_Erfolgsfaktor“, „Ordner/MeineNotiz.md“. Ideal zum Nachschlagen zuvor gespeicherter Notizen.",
  "tools.readNote.paramPath": "Notizname oder -pfad (mit oder ohne .md, mit oder ohne Ordner). Z. B. „01_02_Qualitaet_als_Erfolgsfaktor“ oder „10_Mundo/ReinosDeAcanthia.md“.",
  "tools.readNote.error.noPath": "Fehler: kein Pfad angegeben.",
  "tools.readNote.error.invalidPath": "Fehler: ungültiger Pfad.",
  "tools.readNote.autoFound": "[Auto-gefunden: {path}]",
  "tools.readNote.foundMultiple": "{count} Notizen mit dem Namen „{name}“ gefunden. Geben Sie den vollständigen Pfad an:\n{paths}",
  "tools.readNote.exactMatchNotFound": "Keine exakte Übereinstimmung für „{name}“ gefunden. Ähnliche Notizen:\n{paths}",
  "tools.readNote.error.notFound": "Fehler: Die Notiz „{path}“ existiert nicht im Vault.",
  "tools.readNote.error.readError": "Fehler beim Lesen von „{path}“: {error}",

  // TOOL: read_pdf
  "tools.readPdf.description": "Extrahiert Text aus einem PDF. Erfordert pagesOnly für große PDFs (>20 Seiten). Verwenden Sie pagesOnly: '116-138' für bestimmte Seiten. Verwenden Sie tocOnly: true für das Inhaltsverzeichnis. Ohne Parameter funktioniert es nur bei PDFs mit ≤20 Seiten.",
  "tools.readPdf.customInstructions": "Für read_pdf: Verwenden Sie IMMER zuerst find_files, um das PDF zu lokalisieren. Verwenden Sie pagesOnly, um bestimmte Seiten anzufordern. Rufen Sie NIEMALS read_pdf auf, ohne zuerst den richtigen Pfad zu finden.",
  "tools.readPdf.paramPath": "Pfad zum PDF im Vault.",
  "tools.readPdf.paramTocOnly": "Gibt nur das PDF-Inhaltsverzeichnis / TOC zurück.",
  "tools.readPdf.paramPagesOnly": "Bestimmter Seitenbereich (z. B. '10-20' oder '5,8,12').",
  "tools.readPdf.error.noPath": "Fehler: kein Pfad angegeben.",
  "tools.readPdf.multiplePdfs": "Mehrere PDFs stimmen mit „{path}“ überein:\n{paths}\nGeben Sie den genauen Pfad an.",
  "tools.readPdf.error.notFound": "Fehler: „{path}“ existiert nicht.",
  "tools.readPdf.tooLarge": "Das PDF hat {pages} Seiten. Verwenden Sie pagesOnly, um bestimmte Seiten zu lesen (z. B. pagesOnly: „116-138“) oder tocOnly: true für das Inhaltsverzeichnis.",
  "tools.readPdf.noText": "Kein Text gefunden.",
  "tools.readPdf.tocHeader": "[PDF-Inhaltsverzeichnis – {pages} Seiten insgesamt]",
  "tools.readPdf.pageHeader": "[Seiten {spec} von {total} insgesamt]",
  "tools.readPdf.pageLabel": "[Seite {num}]",
  "tools.readPdf.totalPages": "[{total} Seiten insgesamt]",
  "tools.readPdf.tocSeparator": "═══ INHALTSVERZEICHNIS / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ INHALT ═══",
  "tools.readPdf.truncationNotice": "[Hinweis: Das PDF hat {pages} Seiten. Nur die ersten 500 werden angezeigt.]",
  "tools.readPdf.error.generic": "Fehler: {error}",

  // TOOL: create_note
  "tools.createNote.description": "Erstellt eine neue Notiz im Vault mit dem angegebenen Titel und Inhalt (Markdown-Format).",
  "tools.createNote.paramTitle": "Notiztitel (ohne Erweiterung).",
  "tools.createNote.paramContent": "Notizinhalt im Markdown-Format.",
  "tools.createNote.error.noTitle": "Fehler: kein Titel angegeben.",
  "tools.createNote.error.noContent": "Fehler: kein Inhalt angegeben.",
  "tools.createNote.error.alreadyExists": "Fehler: Es existiert bereits eine Notiz mit dem Namen „{name}“.",
  "tools.createNote.success": "Notiz erfolgreich erstellt: „{name}“ ({length} Zeichen).",
  "tools.createNote.error.createError": "Fehler beim Erstellen der Notiz: {error}",

  // TOOL: update_note
  "tools.updateNote.description": "Überschreibt den Inhalt einer vorhandenen Notiz im Vault. Verwenden Sie den vollständigen Pfad. Wenn die Notiz nicht existiert, wird ein Fehler zurückgegeben (verwenden Sie create_note für neue Notizen).",
  "tools.updateNote.paramPath": "Vollständiger Pfad der zu ändernden Notiz (z. B. „10_Mundo/Reinos.md“).",
  "tools.updateNote.paramContent": "Neuer vollständiger Inhalt der Notiz im Markdown-Format.",
  "tools.updateNote.error.noPath": "Fehler: kein Pfad angegeben.",
  "tools.updateNote.error.noContent": "Fehler: kein Inhalt angegeben.",
  "tools.updateNote.error.notFound": "Fehler: Die Notiz „{path}“ existiert nicht. Verwenden Sie create_note, um eine neue zu erstellen.",
  "tools.updateNote.error.mismatch": "Fehler: Die Notiz „{path}“ wurde als aktualisiert gemeldet, aber der Inhalt stimmt nicht überein ({expected} Zeichen erwartet, {actual} Zeichen gelesen).",
  "tools.updateNote.success": "Notiz „{path}“ erfolgreich aktualisiert ({length} Zeichen).",
  "tools.updateNote.error.updateError": "Fehler beim Aktualisieren von „{path}“: {error}",

  // TOOL: find_files
  "tools.findFiles.description": "Durchsucht Dateien im Vault nach Namensmuster. Gibt Pfade übereinstimmender Dateien zurück. Nützlich zum Auffinden von Bildern, PDFs oder Notizen, wenn Sie den genauen Pfad nicht kennen.",
  "tools.findFiles.paramNameQuery": "Teil des Dateinamens, nach dem gesucht werden soll (z. B. „MapaPolitico“, „diagram“, „photo.png“). Groß-/Kleinschreibung wird ignoriert.",
  "tools.findFiles.paramExtension": "Nach Erweiterung filtern (z. B. „png“, „pdf“, „md“). Optional.",
  "tools.findFiles.error.emptyQuery": "Fehler: leerer Suchbegriff.",
  "tools.findFiles.noResults": "Keine Dateien gefunden, die auf „{query}“{extension} zutreffen.",
  "tools.findFiles.results": "{results}\n... und {more} weitere.",
  "tools.findFiles.error.searchError": "Fehler bei der Dateisuche: {error}",

  // TOOL: list_notes
  "tools.listNotes.description": "Listet Notizen in einem Vault-Ordner auf (oder im Stammverzeichnis, wenn nicht angegeben).",
  "tools.listNotes.paramFolder": "Aufzulistender Ordner (optional). Wenn nicht angegeben, wird das Stammverzeichnis aufgelistet.",
  "tools.listNotes.noNotes": "Keine Notizen gefunden.",

  // TOOL: search_vault_fulltext
  "tools.searchVaultFulltext.description": "Durchsucht den genauen Text in allen Vault-Notizen (schneller als semantische Suche).",
  "tools.searchVaultFulltext.paramQuery": "Zu suchender Text.",
  "tools.searchVaultFulltext.error.emptyQuery": "Fehler: leere Abfrage.",
  "tools.searchVaultFulltext.notFound": "„{query}“ wurde in keiner Notiz gefunden.",

  // TOOL: search_vault_semantic
  "tools.searchVaultSemantic.description": "Durchsucht Vault-Notizen mit semantischer Suche (RAG). Gibt relevante Fragmente basierend auf der Abfrage zurück.",
  "tools.searchVaultSemantic.paramQuery": "Die Suchabfrage.",
  "tools.searchVaultSemantic.paramStartDate": "Optionaler Filter: ISO-Startdatum.",
  "tools.searchVaultSemantic.paramEndDate": "Optionaler Filter: ISO-Enddatum.",
  "tools.searchVaultSemantic.error.emptyQuery": "Fehler: leere Abfrage.",
  "tools.searchVaultSemantic.error.notEnabled": "Fehler: Semantische Suche ist nicht aktiviert. Aktivieren Sie 'enableSemanticSearch' in den Einstellungen und indizieren Sie den Vault.",
  "tools.searchVaultSemantic.noResults": "Keine relevanten Fragmente für die Abfrage gefunden.",
  "tools.searchVaultSemantic.fragment": "[Fragment {index}] ({path}, Relevanz: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "Fehler bei der semantischen Suche: {error}",

  // TOOL: search_vault_by_timeframe
  "tools.searchVaultByTimeframe.description": "Durchsucht Vault-Notizen, die zwischen zwei Daten im ISO-8601-Format geändert wurden (JJJJ-MM-TTTHH:mm:ss). Nützlich, um zu sehen, was der Benutzer in einem Zeitraum getan hat.",
  "tools.searchVaultByTimeframe.paramStartDate": "Startdatum im ISO-8601-Format, z. B. 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "Enddatum im ISO-8601-Format, z. B. 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "Fehler: ungültige Daten. Verwenden Sie das ISO-8601-Format (JJJJ-MM-TTTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "Keine Notizen gefunden, die zwischen {start} und {end} geändert wurden.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nGeändert: {mtime}\nInhalt: {snippet}...",

  // TOOL: search_web
  "tools.searchWeb.description": "Führt eine Websuche mit einem automatisierten Browser durch und gibt die relevantesten Ergebnisse zurück (Titel, URL, Auszug).",
  "tools.searchWeb.paramQuery": "Die Websuchabfrage.",
  "tools.searchWeb.error.emptyQuery": "Fehler: leere Abfrage.",
  "tools.searchWeb.noResults": "Keine Ergebnisse gefunden für: „{query}“.",
  "tools.searchWeb.error.generic": "Fehler bei der Websuche: {error}",

  // TOOL: analyze_image
  "tools.analyzeImage.description": "Analysiert ein Bild aus dem Vault und liefert eine detaillierte Beschreibung. Verwenden Sie den Bildpfad (z. B. „Ordner/diagram.png“). Unterstützt png, jpg, jpeg, gif, webp.",
  "tools.analyzeImage.paramImagePath": "Pfad zur Bilddatei innerhalb des Vaults.",
  "tools.analyzeImage.error.noPath": "Fehler: kein Bildpfad angegeben.",
  "tools.analyzeImage.error.configError": "Fehler: {error}",
  "tools.analyzeImage.noResponse": "Keine Antwort vom Vision-Modell erhalten.",
  "tools.analyzeImage.error.apiError": "API-Fehler: {message}",
  "tools.analyzeImage.error.connectionRefused": "Fehler: Verbindung zum Vision-Server konnte nicht hergestellt werden. Stellen Sie sicher, dass Ihr lokales Vision-Modell mit einem kompatiblen Modell läuft.",
  "tools.analyzeImage.error.generic": "Fehler bei der Bildanalyse: {error}",

  // TOOL: extract_youtube_transcript
  "tools.extractYoutubeTranscript.description": "Ruft das Transkript (Untertitel) eines YouTube-Videos von dessen URL ab.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "YouTube-Video-URL (z. B. https://www.youtube.com/watch?v=... oder https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "Fehler: keine Video-URL angegeben.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "Fehler: Konnte Video-ID nicht aus URL extrahieren: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "Kein Transkript für dieses Video gefunden (Untertitel sind möglicherweise nicht verfügbar).",
  "tools.extractYoutubeTranscript.header": "Transkript des Videos {videoId}:",
  "tools.extractYoutubeTranscript.error.generic": "Fehler beim Abrufen des Transkripts: {error}",

  // TOOL: render_pdf_pages
  "tools.renderPdfPages.description": "Rendert bestimmte PDF-Seiten als PNG-Bilder und speichert sie im Vault. Gibt genaue Pfade zurück (z. B. „Resources/PDF_images/PDF_page_40.png“). WICHTIG: Verwenden Sie die GENAUEN Pfade, die von diesem Tool zurückgegeben werden, für ![[embeds]]. Erfinden Sie KEINE Pfade.",
  "tools.renderPdfPages.paramPath": "Pfad zum PDF im Vault.",
  "tools.renderPdfPages.paramPages": "Zu rendernde Seiten (z. B. '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "Ordner zum Speichern der Bilder (optional, Standard: neben dem PDF).",
  "tools.renderPdfPages.paramScale": "Render-Skalierung (1,0 = 72 DPI, 2,0 = 144 DPI). Standard: 2,0.",
  "tools.renderPdfPages.error.noPath": "Fehler: kein PDF-Pfad angegeben.",
  "tools.renderPdfPages.error.noPages": "Fehler: keine Seiten angegeben.",
  "tools.renderPdfPages.multiplePdfs": "Mehrere PDFs stimmen mit „{path}“ überein. Geben Sie den genauen Pfad an.",
  "tools.renderPdfPages.error.notFound": "Fehler: „{path}“ existiert nicht.",
  "tools.renderPdfPages.error.invalidRange": "Fehler: ungültiger Seitenbereich: „{range}“.",
  "tools.renderPdfPages.error.createFolder": "Fehler: Ausgabeordner „{folder}“ konnte nicht erstellt werden: {error}",
  "tools.renderPdfPages.error.noValidPages": "Fehler: keine gültigen Seiten. Das PDF hat {pages} Seiten.",
  "tools.renderPdfPages.error.canvas": "Fehler: Konnte Canvas-2D-Kontext für Seite {page} nicht erstellen.",
  "tools.renderPdfPages.error.renderError": "Fehler beim Rendern von Seite {page}: {error}",
  "tools.renderPdfPages.result": "{rendered}/{total} Seiten gerendert:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "Fehler beim Rendern der PDF-Seiten: {error}",

  // TOOL: extract_pdf_images
  "tools.extractPdfImages.description": "Extrahiert eingebettete JPG/PNG-Bilder aus PDF-Seiten. Erfordert die Installation von 'unpdf' (npm install unpdf). Wenn keine Rasterbilder (Vektorgrafiken/Diagramme) vorhanden sind, wird die gesamte Seite als PNG gerendert. Verwenden Sie render_pdf_pages, wenn Sie nur vollständige Seiten benötigen.",
  "tools.extractPdfImages.paramPath": "Pfad zum PDF im Vault.",
  "tools.extractPdfImages.paramPages": "Seiten (z. B. '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "Ausgabeordner (optional).",
  "tools.extractPdfImages.error.pathAndPages": "Fehler: Pfad und Seiten erforderlich.",
  "tools.extractPdfImages.multiplePdfs": "Mehrere PDFs stimmen überein. Geben Sie den genauen Pfad an.",
  "tools.extractPdfImages.error.notFound": "Fehler: „{path}“ existiert nicht.",
  "tools.extractPdfImages.error.invalidRange": "Fehler: ungültiger Bereich: „{range}“.",
  "tools.extractPdfImages.error.outOfRange": "Fehler: Seiten außerhalb des Bereichs ({pages} insgesamt).",
  "tools.extractPdfImages.result": "{count} Bilder aus {pages} Seiten extrahiert:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (ganze Seite)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ Seite {page}: Rendern fehlgeschlagen",
  "tools.extractPdfImages.error.canvas": "❌ Seite {page}: Konnte Canvas nicht erstellen",
  "tools.extractPdfImages.error.generic": "Fehler: {error}",

  // TOOL: get_vault_stats
  "tools.getVaultStats.description": "Gibt Vault-Statistiken zurück: Anzahl der Notizen, Gesamtgröße, Ordner.",
  "tools.getVaultStats.stats": "Notizen: {notes}\nGesamtgröße: ~{size}\nOrdner: {folders}",

  // TOOL: get_active_file
  "tools.getActiveFile.description": "Gibt den Inhalt der aktuell im Editor geöffneten Datei zurück.",
  "tools.getActiveFile.noFileOpen": "Derzeit ist keine Datei geöffnet.",
  "tools.getActiveFile.error": "Fehler: {error}",

  // TOOL: get_frontmatter
  "tools.getFrontmatter.description": "Extrahiert die Frontmatter (YAML-Metadaten) aus einer Notiz.",
  "tools.getFrontmatter.paramPath": "Pfad zur Notiz.",
  "tools.getFrontmatter.error.notFound": "Fehler: „{path}“ existiert nicht.",
  "tools.getFrontmatter.noFrontmatter": "Keine Frontmatter.",
  "tools.getFrontmatter.error.generic": "Fehler: {error}",

  // Tool Registry
  "tools.registry.errorExecute": "Fehler bei der Ausführung des Tools „{name}“: {error}",
  "tools.registry.errorNotFound": "Tool „{name}“ nicht registriert",

  // Errors
  "errors.unknown": "Unbekannter Fehler",
  "errors.fetchFailed": "Abruf fehlgeschlagen",

  // Placeholders
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

  // Labels
  "labels.unknown": "Unbekannter Fehler",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ nicht unterstützt)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "Embeddings",
  "labels.vision": "Vision",
  "labels.lmStudio": "LM Studio",
};
