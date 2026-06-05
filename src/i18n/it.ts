export const it: Record<string, string> = {
  "settings.title": "Copilot Personal - Impostazioni",
  "settings.language": "Lingua / Language",
  "settings.apiKey": "Chiave API",
  "settings.licenseKey": "Chiave di licenza",
  "settings.licenseKeyDesc": "Chiave Pro da Lemon Squeezy. Lasciare vuoto per la modalità Free.",
  "settings.provider": "Fornitore",
  "settings.chatModel": "Modello chat",
  "settings.embeddingModel": "Modello embedding",
  "settings.visionModel": "Modello visione",
  "settings.temperature": "Temperatura",
  "settings.maxTokens": "Max token",
  "settings.streamResponses": "Risposte in streaming",
  "settings.semanticSearch": "Attiva ricerca semantica",
  "settings.webSearch": "Attiva ricerca web",
  "settings.vision": "Attiva visione",
  "settings.agentMode": "Attiva modalità agente",
  "settings.budgetTitle": "AI Budget (Pro)",
  "settings.budgetEnable": "Usa AI Budget Copilot",
  "chat.btnNew": "Nuovo",
  "chat.btnSave": "Salva",
  "chat.btnHistory": "Cronologia",
  "chat.btnSend": "Invia",
  "chat.btnStop": "Ferma",
  "chat.btnAgent": "Agente",
  "chat.btnThink": "Pensa",
  "chat.headerPrivacyLocal": "🔒 Locale",
  "chat.headerPrivacyCloud": "☁️ Cloud",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "Pronto",
  "chat.statusThinking": "Pensando...",
  "chat.statusError": "Errore",
  "chat.greeting": "Ciao! Sono il tuo copilota AI personale.",
  "chat.rateLimitReached": "⚠️ Limite giornaliero raggiunto ({used}/{limit}). Passa a Pro.",
  "chat.crashRecovery": "📝 Sessione precedente ripristinata.",
  "commands.openChat": "Apri chat Copilot",
  "commands.newChat": "Copilot: Nuova chat",
  "commands.quickAsk": "Copilot: Domanda rapida",
  "commands.exportMd": "Copilot: Esporta come Markdown",
  "license.proActivated": "✅ Licenza Pro attivata con successo.",
  "license.freeActivated": "🆓 Modalità Free attivata.",

  // Settings — Language
  "settings.languageDesc": "Seleziona la lingua dell'interfaccia. Le modifiche si applicano immediatamente.",

  // Settings — API Configuration
  "settings.apiConfiguration": "Configurazione API",
  "settings.apiKeyDesc": "La tua chiave API per {provider} (salvata in data.json — NON crittografata. NON committare su Git.)",
  "settings.licenseClearTooltip": "Cancella licenza (torna a Free)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "URL API",
  "settings.apiUrlDesc": "URL base per l'endpoint API",
  "settings.providerDesc": "Seleziona il fornitore LLM",
  "settings.detectModels": "Rileva modelli",
  "settings.detectModelsDesc": "Interroga l'endpoint /v1/models di LM Studio per scoprire i modelli caricati",
  "settings.lmStatusQuerying": "Interrogazione LM Studio in corso...",
  "settings.lmStatusNoModels": "Nessun modello trovato. Carica prima un modello in LM Studio.",
  "settings.lmStatusFound": "{count} modello/i trovato/i: {models}",
  "settings.lmStatusError": "Errore: {error}. Assicurati che LM Studio sia in esecuzione.",
  "settings.fallbackModelName": "Modello {cap} (fallback)",

  // Provider names
  "provider.name.auto": "Rilevamento automatico (da URL)",
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

  // Settings — Budget AI
  "settings.budgetEnableDesc": "API gestita gratuita tramite Mistral Nemo. Nessuna chiave API necessaria. Include limiti di utilizzo giornalieri.",
  "settings.budgetProRequired": "🔒 Copilot AI richiede una licenza Pro. Passa a Pro per utilizzare l'API di budget gestita.",

  // Settings — Model Configuration
  "settings.modelConfig": "Configurazione Modello",
  "settings.temperatureDesc": "Controlla la casualità (0.0 = deterministico, 2.0 = molto casuale)",
  "settings.maxTokensDesc": "Massimo numero di token nella risposta",
  "settings.topP": "Top P",
  "settings.topPDesc": "Campionamento nucleo (0.0-1.0). Più basso = più focalizzato",
  "settings.topK": "Top K",
  "settings.topKDesc": "Limita la selezione dei token ai top K (0 = disabilitato)",
  "settings.presencePenalty": "Penalità di presenza",
  "settings.presencePenaltyDesc": "Penalizza i token ripetuti (0-2). Più alto = meno ripetizione",
  "settings.enableThinking": "Attiva modalità pensiero",
  "settings.enableThinkingDesc": "Usa pensiero/ragionamento DeepSeek V4 (incompatibile con temperatura/top_p/penalità di presenza)",
  "settings.reasoningEffort": "Sforzo di ragionamento",
  "settings.reasoningEffortDesc": "Si applica solo quando la modalità pensiero è attiva (DeepSeek V4)",
  "settings.streamResponsesDesc": "Mostra risposta token per token",
  "settings.contextTurns": "Turni di contesto",
  "settings.contextTurnsDesc": "Numero di turni precedenti da includere nel contesto",
  "settings.semanticSearchDesc": "Indicizza il tuo vault per la ricerca semantica nella chat",
  "settings.semanticSearchProLocked": "🔒 La ricerca semantica richiede una licenza Pro",
  "settings.maxSourceChunks": "Max chunk sorgente",
  "settings.maxSourceChunksDesc": "Numero di chunk da recuperare per query",
  "settings.chunkSize": "Dimensione chunk (token)",
  "settings.chunkSizeDesc": "Conteggio approssimativo di token per chunk",

  // Settings — Web Search
  "settings.webSearchDesc": "Consenti ricerca web tramite microservizio browser-use",
  "settings.webSearchProLocked": "🔒 La ricerca web richiede una licenza Pro",
  "settings.webSearchServerUrl": "URL server ricerca web",
  "settings.webSearchServerUrlDesc": "URL del microservizio Python browser-use",
  "settings.webSearchMaxResults": "Max risultati ricerca",
  "settings.webSearchMaxResultsDesc": "Quanti risultati web restituire",
  "settings.webSearchToken": "Token ricerca web",
  "settings.webSearchTokenDesc": "Token di autenticazione condiviso con il server di ricerca Python (deve corrispondere a COPILOT_WEB_TOKEN del server)",
  "settings.webSearchTokenPlaceholder": "your-secure-token",

  // Settings — Vision
  "settings.visionDesc": "Usa modello di visione per le immagini",
  "settings.visionNotSupported": "Non disponibile per questo fornitore",
  "settings.visionProLocked": "🔒 La visione richiede una licenza Pro",
  "settings.imageDrop": "Attiva rilascio immagini",
  "settings.imageDropDesc": "Consenti trascinamento immagini nella chat",

  // Settings — Chat History
  "settings.saveChatHistory": "Salva cronologia chat",
  "settings.saveChatHistoryDesc": "Salva conversazioni come file markdown nel vault",
  "settings.chatHistoryFolder": "Cartella cronologia chat",
  "settings.chatHistoryFolderDesc": "Cartella per salvare i file della cronologia chat",

  // Settings — Memory
  "settings.enableMemory": "Attiva memoria",
  "settings.enableMemoryDesc": "Ricorda fatti importanti tra sessioni di chat",
  "settings.memoryFolder": "Cartella memoria",
  "settings.memoryFolderDesc": "Cartella per salvare i file di memoria",
  "settings.maxMemories": "Max memorie",
  "settings.maxMemoriesDesc": "Numero di memorie recenti da caricare in una nuova chat",

  // Settings — Agent Mode
  "settings.agentModeDesc": "Consenti all'IA di usare strumenti ed eseguire più azioni autonomamente",
  "settings.agentModeToolCallingNA": "Chiamata strumenti non disponibile per questo fornitore",
  "settings.agentModeProLocked": "🔒 La modalità agente richiede una licenza Pro",
  "settings.maxAgentIterations": "Max iterazioni agente",
  "settings.maxAgentIterationsDesc": "Numero massimo di chiamate strumento per esecuzione agente",

  // Settings — LM Studio
  "settings.lmDetectTitle": "LM Studio - Rileva Modelli",
  "settings.lmStatusDefault": "Clicca 'Rileva' per ottenere i modelli disponibili da LM Studio.",
  "settings.lmDetectButton": "Rileva",
  "settings.lmStatusFoundNotice": "{count} modello/i trovato/i in LM Studio. Primo modello ({model}) impostato come predefinito.",

  // Settings — Model names
  "settings.chatModelDesc": "Modello da usare per completamenti chat",
  "settings.embeddingModelDesc": "Modello per embedding{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ NON supportato da questo fornitore)",
  "settings.visionModelDesc": "Modello da usare per attività di visione/immagine",

  // Settings — Section headers
  "settings.chatOptions": "Opzioni Chat",
  "settings.chatHistory": "Cronologia Chat",
  "settings.memory": "Memoria",
  "settings.lmVisionTitle": "LM Studio (Analisi Immagini)",
  "settings.sectionSemanticSearch": "Ricerca Semantica (RAG)",
  "settings.sectionWebSearch": "Ricerca Web (browser-use)",
  "settings.sectionVision": "Visione / Immagini",
  "settings.sectionAgentMode": "Modalità Agente",

  // Settings — Reasoning
  "settings.reasoningHigh": "Alto",
  "settings.reasoningMax": "Massimo",

  // Settings — Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 Fallback Multi-Fornitore",
  "settings.fallbackFor": "Fallback per {cap}",
  "settings.fallbackSelect": "Seleziona un fornitore che SUPPORTA {cap}",
  "settings.fallbackProLocked": "🔒 Richiede licenza Pro",
  "settings.fallbackModelDesc": "Nome modello per {cap} nel fornitore di fallback",
  "settings.multiProviderProNotice": "Il fallback multi-fornitore richiede una licenza Pro. Con Pro, puoi usare un secondo fornitore per capacità che il tuo fornitore principale non ha.",
  "settings.providerNoSupport": "{provider} non supporta {cap}",
  "settings.providerSelectSupporting": "Seleziona un fornitore che SUPPORTA {cap}",

  // Chat — Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "Avvia una nuova chat",
  "chat.saveChatTooltip": "Salva chat su file",
  "chat.browseHistoryTooltip": "Sfoglia chat salvate",
  "chat.agentToggleTooltip": "Attiva/disattiva modalità agente (uso autonomo strumenti)",
  "chat.thinkToggleTooltip": "Attiva modalità pensiero (il modello ragiona prima di rispondere)",
  "chat.sendPlaceholder": "Scrivi il tuo messaggio... (Invio per inviare, Shift+Invio per nuova riga)",
  "chat.headerPrivacyLocalTooltip": "Dati elaborati localmente. Non lasciano mai il tuo dispositivo.",
  "chat.headerPrivacyCloudTooltip": "Dati inviati a server esterno. Controlla Impostazioni > Configurazione API.",
  "chat.headerTierProTooltip": "Licenza Pro attiva — tutte le funzionalità sbloccate",
  "chat.headerTierFreeTooltip": "Livello Free — 50 messaggi/giorno, funzionalità limitate",

  // Chat — Status
  "chat.statusAgentModeOn": "Modalità agente ATTIVA",
  "chat.statusAgentThinking": "Agente sta pensando...",
  "chat.statusStopped": "Fermato",
  "chat.statusNewChat": "Nuova chat avviata",
  "chat.statusThinkingOn": "Pensiero ATTIVO",
  "chat.statusSearching": "Ricerca web in corso: \"{query}\"...",
  "chat.statusSearchError": "Errore di ricerca",
  "chat.statusSaved": "Salvato in {path}",
  "chat.statusSaveFailed": "Salvataggio fallito: {error}",
  "chat.statusParsing": "Analisi {name} in corso...",
  "chat.statusPdfParsed": "PDF analizzato: {name}",
  "chat.statusImageReady": "Immagine pronta: {name}",
  "chat.statusAgentError": "Errore agente",
  "chat.statusExported": "Chat esportata in {fileName}",
  "chat.statusExportFailed": "Esportazione fallita: {error}",

  // Chat — Messages / License
  "chat.licenseAgentRequired": "🔒 La modalità agente richiede una licenza Pro. Impostazioni → Chiave di licenza.",
  "chat.licenseWebSearchRequired": "🔒 La ricerca web richiede una licenza Pro. Impostazioni → Chiave di licenza.",

  // Chat — Messages / Crash recovery
  "chat.memoriesLoaded": "📝 {count} riepiloghi precedenti caricati.",

  // Chat — Messages / Agent
  "chat.agentStepProgress": "⏳ Passo {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ Il modello dichiara completamento ma solo {written} di {expected} note sono state salvate. {missing} mancanti.",
  "chat.agentFallback": "⚠️ Modalità agente fallita — risposta di fallback:\n\n{response}",
  "chat.agentError": "Errore agente: {message}",
  "chat.agentWarnNotSaved": "⚠️ **NOTA: Il modello ha dichiarato di aver salvato/modificato una nota, ma NESSUN strumento di scrittura (update_note, create_note) o marcatore <!--save:--> è stato usato. La dichiarazione è un'allucinazione.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 La modalità agente non è ancora disponibile con Copilot AI. Passa a un fornitore diverso (DeepSeek, OpenAI, ecc.) in Impostazioni → Fornitore per usare la Modalità Agente.",

  // Chat — Auto-save
  "chat.autoSaveResult": "📝 {saved}/{total} note salvate automaticamente:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 {path} aggiornato ({changed} righe modificate)",

  // Chat — Messages
  "chat.noSavedChats": "Nessuna chat salvata trovata.",
  "chat.noMessagesToSave": "Nessun messaggio da salvare.",
  "chat.chatSaved": "Chat salvata in {path}",
  "chat.chatSaveFailed": "Salvataggio chat fallito: {error}",
  "chat.savedChatsFound": "📂 {count} chat salvate:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "Fornisci una query di ricerca dopo `!search`.",
  "chat.searching": "Ricerca in corso: {query}",
  "chat.webSearchFailed": "Ricerca web fallita: {error}",
  "chat.imageDroppedInfo": "Immagine rilasciata: {name} (attiva la visione nelle impostazioni per analizzare immagini)",
  "chat.fileDroppedUnsupported": "File rilasciato: {name} (formato non supportato)",
  "chat.fileDroppedError": "Errore elaborazione {name}: {error}",

  // Chat — Delete
  "chat.deleteMessageTooltip": "Elimina questo messaggio",

  // Chat — Loading states
  "chat.statusReading": "📕 Lettura file in corso...",
  "chat.statusSearchingVault": "🔍 Ricerca vault in corso...",
  "chat.statusAnalyzingImage": "🖼️ Analisi immagine in corso...",
  "chat.statusGeneratingEmbeddings": "🧮 Generazione embedding in corso...",
  "chat.statusCompacting": "📦 Compattazione contesto in corso...",
  "chat.statusDeepThinking": "💭 Pensiero in corso...",

  // Chat — Save/Export roles
  "chat.saveRoleYou": "**Tu**",
  "chat.saveRoleAssistant": "**Assistente**",
  "chat.saveRoleSystem": "**Sistema**",
  "chat.exportRoleUser": "👤 Utente",
  "chat.exportRoleAssistant": "🤖 Assistente",
  "chat.exportRoleSystem": "🔧 Sistema",

  // Chat — Avatars
  "chat.roleUser": "Tu",
  "chat.roleAssistant": "Assistente",
  "chat.roleSystem": "Sistema",

  // Chat — Slash commands
  "chat.slashSummarize": "Riassumi il seguente contenuto in modo conciso, evidenziando i punti chiave:\n\n",
  "chat.slashTranslate": "Traduci il seguente contenuto in italiano, preservando formattazione e termini tecnici:\n\n",
  "chat.slashExplain": "Spiega il seguente concetto in dettaglio, con esempi e applicazioni pratiche:\n\n",
  "chat.slashToc": "Genera un indice strutturato per il seguente contenuto:\n\n",
  "chat.slashFlashcards": "Crea 10 flashcard Q&A in formato D: ... R: ...:\n\n",
  "chat.slashRewrite": "Riscrivi il seguente contenuto migliorando chiarezza, struttura e stile:\n\n",
  "chat.slashExpand": "Espandi il seguente contenuto aggiungendo più dettagli, contesto ed esempi:\n\n",

  // Commands
  "commands.sendSelection": "Invia selezione a Copilot",
  "commands.indexVault": "Copilot: Indicizza vault per ricerca semantica",
  "commands.clearIndex": "Copilot: Cancella indice ricerca semantica",
  "commands.saveChat": "Copilot: Salva chat su file",
  "commands.exportJson": "Copilot: Esporta chat come JSON",

  // Notices
  "notices.noTextSelected": "Nessun testo selezionato.",
  "notices.indexingVault": "Indicizzazione vault in corso...",
  "notices.indexingProgress": "Indicizzazione: {current}/{total} file",
  "notices.indexCorrupted": "Il file indice sembra corrotto o non può essere caricato. Prova a cancellare e reindicizzare.",
  "notices.indexEmpty": "Indicizzazione vault completata, ma nessun file è stato indicizzato. Controlla le cartelle escluse o riprova.",
  "notices.indexEmptyVectors": "L'indicizzazione del vault ha prodotto vettori VUOTI. Il tuo modello di embedding non genera embedding. Carica un modello di embedding dedicato (nomic-embed-text, all-MiniLM-L6-v2) in LM Studio e impostalo in Impostazioni → Modello Embedding, poi cancella e reindicizza.",
  "notices.indexComplete": "Indicizzazione vault completata! {chunks} chunk indicizzati.",
  "notices.indexFailed": "Indicizzazione fallita: {error}",
  "notices.indexCleared": "Indice cancellato.",

  // Quick Ask
  "quickAsk.title": "Domanda Rapida",
  "quickAsk.placeholder": "Chiedi qualsiasi cosa...",
  "quickAsk.btnAsk": "Chiedi",
  "quickAsk.btnThinking": "Pensiero in corso...",
  "quickAsk.error": "Errore: {error}",

  // License
  "license.rejected": "Licenza rifiutata: {reason}",
  "license.serverError": "Errore del server ({status}). Verifica la tua chiave su Lemon Squeezy.",
  "license.offlineError": "Impossibile raggiungere il server di licenza. Controlla la connessione internet.",
  "license.demoKeyDenied": "La chiave demo richiede la modalità debug (COPILOT_DEBUG=1)",
  "license.dailyLimitReached": "⚠️ Limite giornaliero raggiunto. Passa a Pro per messaggi illimitati.",

  // Provider & Services
  "provider.unsupportedTask": "Nessun fornitore disponibile per questa attività ({task}). Configura un fornitore in Impostazioni.",
  "provider.emptyEmbeddingResponse": "Nessun embedding restituito dal fornitore. Verifica che il modello selezionato supporti gli embedding.",
  "provider.zeroVectorEmbedding": "Il modello ha restituito un embedding a vettore zero. Verifica che il modello selezionato sia un vero modello di embedding (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "Tutti i modelli sono occupati o non disponibili. Riprova più tardi.",
  "provider.anthropicNoEmbeddings": "Anthropic non supporta gli embedding. Configura un fornitore diverso (DeepSeek, OpenAI o LM Studio) per gli embedding in Impostazioni.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic non supporta gli embedding.",

  // Circuit Breaker
  "circuit.rateLimited": "Limitazione di velocità. Nuovo tentativo tra {seconds}s...",
  "circuit.open": "API non disponibile dopo {failures} fallimenti. Circuito aperto per {cooldown}s.",
  "circuit.retrying": "Errore API (tentativo {attempt}/3). Nuovo tentativo tra 2s...",
  "circuit.statusOpen": "API disabilitata per {remaining}s",
  "circuit.statusDegraded": "{failures} fallimenti recenti",
  "circuit.statusClosed": "OK",

  // Web Search
  "webSearch.urlNotConfigured": "URL del server di ricerca web non configurato.",
  "webSearch.serverError": "Il server di ricerca ha restituito {status}: {text}",
  "webSearch.noResults": "Nessun risultato trovato.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nEstratto: {snippet}",

  // Agent
  "agent.maxIterationsReached": "Numero massimo di iterazioni di chiamata strumento raggiunto.",
  "agent.fallbackResponse": "Ho completato l'analisi ma non ho potuto generare una risposta finale.",
  "agent.fallbackTruncated": "Ho raggiunto il numero massimo di chiamate strumento. In base a quanto trovato, il vault potrebbe non avere informazioni sufficienti. Prova a essere più specifico o a indicizzare note aggiuntive.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // Tool: read_note
  "tools.readNote.description": "Legge il contenuto completo di una nota dal vault. Accetta nome nota con o senza estensione .md e con o senza percorso. Es: '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. Ideale per consultare note salvate in precedenza.",
  "tools.readNote.paramPath": "Nome o percorso della nota (con o senza .md, con o senza cartella). Es: '01_02_Qualitaet_als_Erfolgsfaktor' o '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "Errore: nessun percorso fornito.",
  "tools.readNote.error.invalidPath": "Errore: percorso non valido.",
  "tools.readNote.autoFound": "[Trovato automaticamente: {path}]",
  "tools.readNote.foundMultiple": "Trovate {count} note con nome \"{name}\". Specifica il percorso completo:\n{paths}",
  "tools.readNote.exactMatchNotFound": "Nessuna corrispondenza esatta trovata per \"{name}\". Note simili:\n{paths}",
  "tools.readNote.error.notFound": "Errore: la nota \"{path}\" non esiste nel vault.",
  "tools.readNote.error.readError": "Errore lettura \"{path}\": {error}",

  // Tool: read_pdf
  "tools.readPdf.description": "Estrae testo da un PDF. RICHIEDE pagesOnly per PDF grandi (>20 pagine). Usa pagesOnly: '116-138' per pagine specifiche. Usa tocOnly: true per l'indice. Senza parametri funziona solo su PDF di ≤20 pagine.",
  "tools.readPdf.customInstructions": "Per read_pdf: usa SEMPRE find_files PRIMA per localizzare il PDF. Usa pagesOnly per richiedere pagine specifiche. NON chiamare mai read_pdf senza prima trovare il percorso corretto.",
  "tools.readPdf.paramPath": "Percorso del PDF nel vault.",
  "tools.readPdf.paramTocOnly": "Restituisce solo l'indice / sommario del PDF.",
  "tools.readPdf.paramPagesOnly": "Intervallo pagine specifico (es: '10-20' o '5,8,12').",
  "tools.readPdf.error.noPath": "Errore: nessun percorso fornito.",
  "tools.readPdf.multiplePdfs": "Più PDF corrispondono a \"{path}\":\n{paths}\nSpecifica il percorso esatto.",
  "tools.readPdf.error.notFound": "Errore: \"{path}\" non esiste.",
  "tools.readPdf.tooLarge": "Il PDF ha {pages} pagine. Usa pagesOnly per leggere pagine specifiche (es: pagesOnly: \"116-138\") o tocOnly: true per l'indice.",
  "tools.readPdf.noText": "Nessun testo trovato.",
  "tools.readPdf.tocHeader": "[Indice PDF — {pages} pagine totali]",
  "tools.readPdf.pageHeader": "[Pagine {spec} di {total} totali]",
  "tools.readPdf.pageLabel": "[Pagina {num}]",
  "tools.readPdf.totalPages": "[{total} pagine totali]",
  "tools.readPdf.tocSeparator": "═══ INDICE / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ CONTENUTO ═══",
  "tools.readPdf.truncationNotice": "[Nota: Il PDF ha {pages} pagine. Solo le prime 500 sono mostrate.]",
  "tools.readPdf.error.generic": "Errore: {error}",

  // Tool: create_note
  "tools.createNote.description": "Crea una nuova nota nel vault con il titolo e il contenuto forniti (formato Markdown).",
  "tools.createNote.paramTitle": "Titolo della nota (senza estensione).",
  "tools.createNote.paramContent": "Contenuto della nota in formato Markdown.",
  "tools.createNote.error.noTitle": "Errore: nessun titolo fornito.",
  "tools.createNote.error.noContent": "Errore: nessun contenuto fornito.",
  "tools.createNote.error.alreadyExists": "Errore: esiste già una nota con il nome \"{name}\".",
  "tools.createNote.success": "Nota creata con successo: \"{name}\" ({length} caratteri).",
  "tools.createNote.error.createError": "Errore creazione nota: {error}",

  // Tool: update_note
  "tools.updateNote.description": "Sovrascrive il contenuto di una nota esistente nel vault. Usa il percorso completo. Se la nota non esiste, restituisce un errore (usa create_note per nuove note).",
  "tools.updateNote.paramPath": "Percorso completo della nota da modificare (es: '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "Nuovo contenuto completo della nota in formato Markdown.",
  "tools.updateNote.error.noPath": "Errore: nessun percorso fornito.",
  "tools.updateNote.error.noContent": "Errore: nessun contenuto fornito.",
  "tools.updateNote.error.notFound": "Errore: la nota \"{path}\" non esiste. Usa create_note per crearne una nuova.",
  "tools.updateNote.error.mismatch": "Errore: La nota \"{path}\" è stata segnalata come aggiornata ma il contenuto non corrisponde (previsti {expected} caratteri, letti {actual} caratteri).",
  "tools.updateNote.success": "Nota \"{path}\" aggiornata con successo ({length} caratteri).",
  "tools.updateNote.error.updateError": "Errore aggiornamento \"{path}\": {error}",

  // Tool: find_files
  "tools.findFiles.description": "Cerca file nel vault per pattern nel nome. Restituisce i percorsi dei file corrispondenti. Utile per trovare immagini, PDF o note quando non conosci il percorso esatto.",
  "tools.findFiles.paramNameQuery": "Parte del nome del file da cercare (es: 'MapaPolitico', 'diagram', 'photo.png'). Senza distinzione maiuscole/minuscole.",
  "tools.findFiles.paramExtension": "Filtra per estensione (es: 'png', 'pdf', 'md'). Opzionale.",
  "tools.findFiles.error.emptyQuery": "Errore: termine di ricerca vuoto.",
  "tools.findFiles.noResults": "Nessun file trovato corrispondente a \"{query}\"{extension}.",
  "tools.findFiles.results": "{results}\n... e altri {more}.",
  "tools.findFiles.error.searchError": "Errore ricerca file: {error}",

  // Tool: list_notes
  "tools.listNotes.description": "Elenca le note in una cartella del vault (o radice se non specificata).",
  "tools.listNotes.paramFolder": "Cartella da elencare (opzionale). Se non specificata, elenca la radice.",
  "tools.listNotes.noNotes": "Nessuna nota trovata.",

  // Tool: search_vault_fulltext
  "tools.searchVaultFulltext.description": "Cerca testo esatto in tutte le note del vault (più veloce della ricerca semantica).",
  "tools.searchVaultFulltext.paramQuery": "Testo da cercare.",
  "tools.searchVaultFulltext.error.emptyQuery": "Errore: query vuota.",
  "tools.searchVaultFulltext.notFound": "\"{query}\" non trovato in nessuna nota.",

  // Tool: search_vault_semantic
  "tools.searchVaultSemantic.description": "Cerca note del vault usando ricerca semantica (RAG). Restituisce frammenti pertinenti in base alla query.",
  "tools.searchVaultSemantic.paramQuery": "La query di ricerca.",
  "tools.searchVaultSemantic.paramStartDate": "Filtro opzionale: data iniziale ISO.",
  "tools.searchVaultSemantic.paramEndDate": "Filtro opzionale: data finale ISO.",
  "tools.searchVaultSemantic.error.emptyQuery": "Errore: query vuota.",
  "tools.searchVaultSemantic.error.notEnabled": "Errore: la ricerca semantica non è attivata. Attiva 'enableSemanticSearch' nelle impostazioni e indicizza il vault.",
  "tools.searchVaultSemantic.noResults": "Nessun frammento pertinente trovato per la query.",
  "tools.searchVaultSemantic.fragment": "[Frammento {index}] ({path}, pertinenza: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "Errore nella ricerca semantica: {error}",

  // Tool: search_vault_by_timeframe
  "tools.searchVaultByTimeframe.description": "Cerca note del vault modificate tra due date in formato ISO 8601 (YYYY-MM-DDTHH:mm:ss). Utile per vedere cosa ha fatto l'utente in un periodo.",
  "tools.searchVaultByTimeframe.paramStartDate": "Data iniziale in formato ISO 8601, es: 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "Data finale in formato ISO 8601, es: 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "Errore: date non valide. Usa il formato ISO 8601 (YYYY-MM-DDTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "Nessuna nota trovata modificata tra {start} e {end}.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nModificato: {mtime}\nContenuto: {snippet}...",

  // Tool: search_web
  "tools.searchWeb.description": "Esegue una ricerca web tramite browser automatizzato e restituisce i risultati più pertinenti (titolo, url, estratto).",
  "tools.searchWeb.paramQuery": "La query di ricerca web.",
  "tools.searchWeb.error.emptyQuery": "Errore: query vuota.",
  "tools.searchWeb.noResults": "Nessun risultato trovato per: \"{query}\".",
  "tools.searchWeb.error.generic": "Errore nella ricerca web: {error}",

  // Tool: analyze_image
  "tools.analyzeImage.description": "Analizza un'immagine dal vault e fornisce una descrizione dettagliata. Usa il percorso dell'immagine (es: 'folder/diagram.png'). Supporta png, jpg, jpeg, gif, webp.",
  "tools.analyzeImage.paramImagePath": "Percorso del file immagine all'interno del vault.",
  "tools.analyzeImage.error.noPath": "Errore: nessun percorso immagine fornito.",
  "tools.analyzeImage.error.configError": "Errore: {error}",
  "tools.analyzeImage.noResponse": "Nessuna risposta ricevuta dal modello di visione.",
  "tools.analyzeImage.error.apiError": "Errore API: {message}",
  "tools.analyzeImage.error.connectionRefused": "Errore: Impossibile connettersi al server di visione. Assicurati che il tuo modello di visione locale sia in esecuzione con un modello compatibile caricato.",
  "tools.analyzeImage.error.generic": "Errore analisi immagine: {error}",

  // Tool: extract_youtube_transcript
  "tools.extractYoutubeTranscript.description": "Ottiene la trascrizione (sottotitoli) di un video YouTube dal suo URL.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "URL del video YouTube (es: https://www.youtube.com/watch?v=... o https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "Errore: nessun URL video fornito.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "Errore: impossibile estrarre l'ID video dall'URL: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "Nessuna trascrizione trovata per questo video (i sottotitoli potrebbero non essere disponibili).",
  "tools.extractYoutubeTranscript.header": "Trascrizione del video {videoId}:",
  "tools.extractYoutubeTranscript.error.generic": "Errore recupero trascrizione: {error}",

  // Tool: render_pdf_pages
  "tools.renderPdfPages.description": "Renderizza pagine PDF specifiche come immagini PNG e le salva nel vault. Restituisce percorsi esatti (es: 'Resources/PDF_images/PDF_page_40.png'). IMPORTANTE: usa i percorsi ESATTI restituiti da questo strumento per ![[embeds]]. NON inventare percorsi.",
  "tools.renderPdfPages.paramPath": "Percorso del PDF nel vault.",
  "tools.renderPdfPages.paramPages": "Pagine da renderizzare (es: '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "Cartella dove salvare le immagini (opzionale, predefinito: accanto al PDF).",
  "tools.renderPdfPages.paramScale": "Scala di renderizzazione (1.0 = 72 DPI, 2.0 = 144 DPI). Predefinito: 2.0.",
  "tools.renderPdfPages.error.noPath": "Errore: nessun percorso PDF fornito.",
  "tools.renderPdfPages.error.noPages": "Errore: nessuna pagina specificata.",
  "tools.renderPdfPages.multiplePdfs": "Più PDF corrispondono a \"{path}\". Specifica il percorso esatto.",
  "tools.renderPdfPages.error.notFound": "Errore: \"{path}\" non esiste.",
  "tools.renderPdfPages.error.invalidRange": "Errore: intervallo pagine non valido: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "Errore: impossibile creare la cartella di output \"{folder}\": {error}",
  "tools.renderPdfPages.error.noValidPages": "Errore: nessuna pagina valida. Il PDF ha {pages} pagine.",
  "tools.renderPdfPages.error.canvas": "Errore: impossibile creare contesto 2D canvas per la pagina {page}.",
  "tools.renderPdfPages.error.renderError": "Errore renderizzazione pagina {page}: {error}",
  "tools.renderPdfPages.result": "{rendered}/{total} pagine renderizzate:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "Errore renderizzazione pagine PDF: {error}",

  // Tool: extract_pdf_images
  "tools.extractPdfImages.description": "Estrae immagini JPG/PNG incorporate da pagine PDF. Richiede 'unpdf' installato (npm install unpdf). Se non ci sono immagini raster (grafica vettoriale/diagrammi), renderizza l'intera pagina come PNG. Usa render_pdf_pages se servono solo pagine intere.",
  "tools.extractPdfImages.paramPath": "Percorso del PDF nel vault.",
  "tools.extractPdfImages.paramPages": "Pagine (es: '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "Cartella di output (opzionale).",
  "tools.extractPdfImages.error.pathAndPages": "Errore: percorso e pagine richiesti.",
  "tools.extractPdfImages.multiplePdfs": "Più PDF corrispondono. Specifica il percorso esatto.",
  "tools.extractPdfImages.error.notFound": "Errore: \"{path}\" non esiste.",
  "tools.extractPdfImages.error.invalidRange": "Errore: intervallo non valido: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "Errore: pagine fuori intervallo ({pages} totali).",
  "tools.extractPdfImages.result": "Estratte {count} immagini da {pages} pagine:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (pagina intera)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ Pagina {page}: renderizzazione fallita",
  "tools.extractPdfImages.error.canvas": "❌ Pagina {page}: impossibile creare canvas",
  "tools.extractPdfImages.error.generic": "Errore: {error}",

  // Tool: get_vault_stats
  "tools.getVaultStats.description": "Restituisce statistiche del vault: numero di note, dimensione totale, cartelle.",
  "tools.getVaultStats.stats": "Note: {notes}\nDimensione totale: ~{size}\nCartelle: {folders}",

  // Tool: get_active_file
  "tools.getActiveFile.description": "Restituisce il contenuto del file attualmente aperto nell'editor.",
  "tools.getActiveFile.noFileOpen": "Nessun file attualmente aperto.",
  "tools.getActiveFile.error": "Errore: {error}",

  // Tool: get_frontmatter
  "tools.getFrontmatter.description": "Estrae il frontmatter (metadati YAML) da una nota.",
  "tools.getFrontmatter.paramPath": "Percorso della nota.",
  "tools.getFrontmatter.error.notFound": "Errore: \"{path}\" non esiste.",
  "tools.getFrontmatter.noFrontmatter": "Nessun frontmatter.",
  "tools.getFrontmatter.error.generic": "Errore: {error}",

  // Tool registry
  "tools.registry.errorExecute": "Errore esecuzione strumento \"{name}\": {error}",
  "tools.registry.errorNotFound": "Strumento \"{name}\" non registrato",

  // Errors
  "errors.unknown": "Errore sconosciuto",
  "errors.fetchFailed": "Fetch fallito",

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
  "labels.unknown": "Errore sconosciuto",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ non supportato)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "Embedding",
  "labels.vision": "Visione",
  "labels.lmStudio": "LM Studio",
};
