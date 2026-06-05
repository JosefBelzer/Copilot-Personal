export const pt: Record<string, string> = {
  "settings.title": "Copilot Personal - Configurações",
  "settings.language": "Idioma / Language",
  "settings.apiKey": "Chave da API",
  "settings.licenseKey": "Chave de licença",
  "settings.licenseKeyDesc": "Chave Pro do Lemon Squeezy. Deixe vazio para o modo Free.",
  "settings.provider": "Provedor",
  "settings.chatModel": "Modelo de chat",
  "settings.embeddingModel": "Modelo de embedding",
  "settings.visionModel": "Modelo de visão",
  "settings.temperature": "Temperatura",
  "settings.maxTokens": "Máx. tokens",
  "settings.streamResponses": "Transmitir respostas",
  "settings.semanticSearch": "Ativar pesquisa semântica",
  "settings.webSearch": "Ativar pesquisa web",
  "settings.vision": "Ativar visão",
  "settings.agentMode": "Ativar modo agente",
  "settings.budgetTitle": "IA de Orçamento (Pro)",
  "settings.budgetEnable": "Usar IA de orçamento do Copilot",
  "chat.btnNew": "Novo",
  "chat.btnSave": "Salvar",
  "chat.btnHistory": "Histórico",
  "chat.btnSend": "Enviar",
  "chat.btnStop": "Parar",
  "chat.btnAgent": "Agente",
  "chat.btnThink": "Pensar",
  "chat.headerPrivacyLocal": "🔒 Local",
  "chat.headerPrivacyCloud": "☁️ Nuvem",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "Pronto",
  "chat.statusThinking": "Pensando...",
  "chat.statusError": "Erro",
  "chat.greeting": "Olá! Sou seu copiloto de IA pessoal.",
  "chat.rateLimitReached": "⚠️ Limite diário atingido ({used}/{limit}). Atualize para Pro.",
  "chat.crashRecovery": "📝 Sessão anterior restaurada.",
  "commands.openChat": "Abrir chat do Copilot",
  "commands.newChat": "Copilot: Novo chat",
  "commands.quickAsk": "Copilot: Pergunta rápida",
  "commands.exportMd": "Copilot: Exportar como Markdown",
  "license.proActivated": "✅ Licença Pro ativada com sucesso.",
  "license.freeActivated": "🆓 Modo Free ativado.",

  // Settings — Language
  "settings.languageDesc": "Selecione o idioma da interface. As alterações entram em vigor imediatamente.",

  // Settings — API Configuration
  "settings.apiConfiguration": "Configuração da API",
  "settings.apiKeyDesc": "Sua chave de API para {provider} (armazenada em data.json — NÃO criptografada. NÃO faça commit no Git.)",
  "settings.licenseClearTooltip": "Limpar licença (reverter para Free)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "URL da API",
  "settings.apiUrlDesc": "URL base para o endpoint da API",
  "settings.providerDesc": "Selecione o provedor de LLM",
  "settings.detectModels": "Detectar modelos",
  "settings.detectModelsDesc": "Consultar o endpoint /v1/models do LM Studio para descobrir modelos carregados",
  "settings.lmStatusQuerying": "Consultando LM Studio...",
  "settings.lmStatusNoModels": "Nenhum modelo encontrado. Carregue um modelo no LM Studio primeiro.",
  "settings.lmStatusFound": "{count} modelo(s) encontrado(s): {models}",
  "settings.lmStatusError": "Erro: {error}. Verifique se o LM Studio está em execução.",
  "settings.fallbackModelName": "Modelo {cap} (fallback)",

  // Provider names
  "provider.name.auto": "Detecção automática (da URL)",
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
  "settings.budgetEnableDesc": "API gerenciada gratuita via Mistral Nemo. Nenhuma chave de API necessária. Inclui limites de uso diário.",
  "settings.budgetProRequired": "🔒 Copilot AI requer uma licença Pro. Atualize para Pro para usar a API de orçamento gerenciada.",

  // Settings — Model Configuration
  "settings.modelConfig": "Configuração do Modelo",
  "settings.temperatureDesc": "Controla a aleatoriedade (0.0 = determinístico, 2.0 = muito aleatório)",
  "settings.maxTokensDesc": "Máximo de tokens na resposta",
  "settings.topP": "Top P",
  "settings.topPDesc": "Amostragem de núcleo (0.0-1.0). Menor = mais focado",
  "settings.topK": "Top K",
  "settings.topKDesc": "Limita a seleção de tokens aos top K (0 = desativado)",
  "settings.presencePenalty": "Penalidade de presença",
  "settings.presencePenaltyDesc": "Penaliza tokens repetidos (0-2). Maior = menos repetição",
  "settings.enableThinking": "Ativar modo de pensamento",
  "settings.enableThinkingDesc": "Usar pensamento/raciocínio DeepSeek V4 (incompatível com temperatura/top_p/penalidade de presença)",
  "settings.reasoningEffort": "Esforço de raciocínio",
  "settings.reasoningEffortDesc": "Aplica-se apenas quando o modo de pensamento está ativado (DeepSeek V4)",
  "settings.streamResponsesDesc": "Mostrar resposta token por token",
  "settings.contextTurns": "Turnos de contexto",
  "settings.contextTurnsDesc": "Número de turnos anteriores a incluir no contexto",
  "settings.semanticSearchDesc": "Indexar seu vault para pesquisa semântica no chat",
  "settings.semanticSearchProLocked": "🔒 Pesquisa semântica requer uma licença Pro",
  "settings.maxSourceChunks": "Máx. de chunks de origem",
  "settings.maxSourceChunksDesc": "Número de chunks a recuperar por consulta",
  "settings.chunkSize": "Tamanho do chunk (tokens)",
  "settings.chunkSizeDesc": "Contagem aproximada de tokens por chunk",

  // Settings — Web Search
  "settings.webSearchDesc": "Permitir pesquisa web via microsserviço browser-use",
  "settings.webSearchProLocked": "🔒 Pesquisa web requer uma licença Pro",
  "settings.webSearchServerUrl": "URL do servidor de pesquisa web",
  "settings.webSearchServerUrlDesc": "URL do microsserviço Python browser-use",
  "settings.webSearchMaxResults": "Máx. de resultados de pesquisa",
  "settings.webSearchMaxResultsDesc": "Quantos resultados web retornar",
  "settings.webSearchToken": "Token de pesquisa web",
  "settings.webSearchTokenDesc": "Token de autenticação compartilhado com o servidor de pesquisa Python (deve corresponder ao COPILOT_WEB_TOKEN do servidor)",
  "settings.webSearchTokenPlaceholder": "your-secure-token",

  // Settings — Vision
  "settings.visionDesc": "Usar modelo de visão para imagens",
  "settings.visionNotSupported": "Não disponível para este provedor",
  "settings.visionProLocked": "🔒 Visão requer uma licença Pro",
  "settings.imageDrop": "Ativar arrastar imagem",
  "settings.imageDropDesc": "Permitir arrastar e soltar imagens no chat",

  // Settings — Chat History
  "settings.saveChatHistory": "Salvar histórico de chat",
  "settings.saveChatHistoryDesc": "Salvar conversas como arquivos markdown no vault",
  "settings.chatHistoryFolder": "Pasta de histórico de chat",
  "settings.chatHistoryFolderDesc": "Pasta para armazenar arquivos de histórico de chat",

  // Settings — Memory
  "settings.enableMemory": "Ativar memória",
  "settings.enableMemoryDesc": "Lembrar fatos importantes entre sessões de chat",
  "settings.memoryFolder": "Pasta de memória",
  "settings.memoryFolderDesc": "Pasta para armazenar arquivos de memória",
  "settings.maxMemories": "Máx. de memórias",
  "settings.maxMemoriesDesc": "Número de memórias recentes a carregar em novo chat",

  // Settings — Agent Mode
  "settings.agentModeDesc": "Permitir que a IA use ferramentas e execute várias ações autonomamente",
  "settings.agentModeToolCallingNA": "Chamada de ferramenta não disponível para este provedor",
  "settings.agentModeProLocked": "🔒 Modo agente requer uma licença Pro",
  "settings.maxAgentIterations": "Máx. de iterações do agente",
  "settings.maxAgentIterationsDesc": "Número máximo de chamadas de ferramenta por execução do agente",

  // Settings — LM Studio
  "settings.lmDetectTitle": "LM Studio - Detectar Modelos",
  "settings.lmStatusDefault": "Clique em 'Detectar' para buscar modelos disponíveis do LM Studio.",
  "settings.lmDetectButton": "Detectar",
  "settings.lmStatusFoundNotice": "{count} modelo(s) encontrado(s) no LM Studio. Primeiro modelo ({model}) definido como padrão.",

  // Settings — Model names
  "settings.chatModelDesc": "Modelo a usar para conclusões de chat",
  "settings.embeddingModelDesc": "Modelo para embeddings{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ NÃO suportado por este provedor)",
  "settings.visionModelDesc": "Modelo a usar para tarefas de visão/imagem",

  // Settings — Section headers
  "settings.chatOptions": "Opções de Chat",
  "settings.chatHistory": "Histórico de Chat",
  "settings.memory": "Memória",
  "settings.lmVisionTitle": "LM Studio (Análise de Imagem)",
  "settings.sectionSemanticSearch": "Pesquisa Semântica (RAG)",
  "settings.sectionWebSearch": "Pesquisa Web (browser-use)",
  "settings.sectionVision": "Visão / Imagens",
  "settings.sectionAgentMode": "Modo Agente",

  // Settings — Reasoning
  "settings.reasoningHigh": "Alto",
  "settings.reasoningMax": "Máximo",

  // Settings — Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 Fallback Multi-Provedor",
  "settings.fallbackFor": "Fallback para {cap}",
  "settings.fallbackSelect": "Selecione um provedor que SUPORTA {cap}",
  "settings.fallbackProLocked": "🔒 Requer licença Pro",
  "settings.fallbackModelDesc": "Nome do modelo para {cap} no provedor de fallback",
  "settings.multiProviderProNotice": "Fallback multi-provedor requer uma licença Pro. Com Pro, você pode usar um segundo provedor para capacidades que seu provedor principal não possui.",
  "settings.providerNoSupport": "{provider} não suporta {cap}",
  "settings.providerSelectSupporting": "Selecione um provedor que SUPORTA {cap}",

  // Chat — Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "Iniciar um novo chat",
  "chat.saveChatTooltip": "Salvar chat em arquivo",
  "chat.browseHistoryTooltip": "Navegar por chats salvos",
  "chat.agentToggleTooltip": "Alternar modo agente (uso autônomo de ferramentas)",
  "chat.thinkToggleTooltip": "Ativar modo de pensamento (modelo raciocina antes de responder)",
  "chat.sendPlaceholder": "Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)",
  "chat.headerPrivacyLocalTooltip": "Dados processados localmente. Nunca saem do seu dispositivo.",
  "chat.headerPrivacyCloudTooltip": "Dados enviados para servidor externo. Verifique Configurações > Configuração da API.",
  "chat.headerTierProTooltip": "Licença Pro ativa — todos os recursos desbloqueados",
  "chat.headerTierFreeTooltip": "Nível Free — 50 mensagens/dia, recursos limitados",

  // Chat — Status
  "chat.statusAgentModeOn": "Modo agente ATIVO",
  "chat.statusAgentThinking": "Agente pensando...",
  "chat.statusStopped": "Parado",
  "chat.statusNewChat": "Novo chat iniciado",
  "chat.statusThinkingOn": "Pensamento ATIVO",
  "chat.statusSearching": "Pesquisando web: \"{query}\"...",
  "chat.statusSearchError": "Erro de pesquisa",
  "chat.statusSaved": "Salvo em {path}",
  "chat.statusSaveFailed": "Falha ao salvar: {error}",
  "chat.statusParsing": "Analisando {name}...",
  "chat.statusPdfParsed": "PDF analisado: {name}",
  "chat.statusImageReady": "Imagem pronta: {name}",
  "chat.statusAgentError": "Erro do agente",
  "chat.statusExported": "Chat exportado para {fileName}",
  "chat.statusExportFailed": "Falha na exportação: {error}",

  // Chat — Messages / License
  "chat.licenseAgentRequired": "🔒 Modo agente requer uma licença Pro. Configurações → Chave de licença.",
  "chat.licenseWebSearchRequired": "🔒 Pesquisa web requer uma licença Pro. Configurações → Chave de licença.",

  // Chat — Messages / Crash recovery
  "chat.memoriesLoaded": "📝 {count} resumos anteriores carregados.",

  // Chat — Messages / Agent
  "chat.agentStepProgress": "⏳ Etapa {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ Modelo alega conclusão, mas apenas {written} de {expected} notas foram salvas. {missing} ausentes.",
  "chat.agentFallback": "⚠️ Modo agente falhou — resposta de fallback:\n\n{response}",
  "chat.agentError": "Erro do agente: {message}",
  "chat.agentWarnNotSaved": "⚠️ **NOTA: O modelo alegou ter salvo/modificado uma nota, mas NENHUMA ferramenta de escrita (update_note, create_note) ou marcador <!--save:--> foi usada. A alegação é uma alucinação.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 O modo agente ainda não está disponível com Copilot AI. Mude para um provedor diferente (DeepSeek, OpenAI, etc.) em Configurações → Provedor para usar o Modo Agente.",

  // Chat — Auto-save
  "chat.autoSaveResult": "📝 {saved}/{total} notas salvas automaticamente:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 {path} atualizado ({changed} linhas alteradas)",

  // Chat — Messages
  "chat.noSavedChats": "Nenhum chat salvo encontrado.",
  "chat.noMessagesToSave": "Nenhuma mensagem para salvar.",
  "chat.chatSaved": "Chat salvo em {path}",
  "chat.chatSaveFailed": "Falha ao salvar chat: {error}",
  "chat.savedChatsFound": "📂 {count} chats salvos:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "Forneça uma consulta de pesquisa após `!search`.",
  "chat.searching": "Pesquisando: {query}",
  "chat.webSearchFailed": "Pesquisa web falhou: {error}",
  "chat.imageDroppedInfo": "Imagem arrastada: {name} (ative visão nas configurações para analisar imagens)",
  "chat.fileDroppedUnsupported": "Arquivo arrastado: {name} (formato não suportado)",
  "chat.fileDroppedError": "Erro ao processar {name}: {error}",

  // Chat — Delete
  "chat.deleteMessageTooltip": "Excluir esta mensagem",

  // Chat — Loading states
  "chat.statusReading": "📕 Lendo arquivo...",
  "chat.statusSearchingVault": "🔍 Pesquisando vault...",
  "chat.statusAnalyzingImage": "🖼️ Analisando imagem...",
  "chat.statusGeneratingEmbeddings": "🧮 Gerando embeddings...",
  "chat.statusCompacting": "📦 Compactando contexto...",
  "chat.statusDeepThinking": "💭 Pensando...",

  // Chat — Save/Export roles
  "chat.saveRoleYou": "**Você**",
  "chat.saveRoleAssistant": "**Assistente**",
  "chat.saveRoleSystem": "**Sistema**",
  "chat.exportRoleUser": "👤 Usuário",
  "chat.exportRoleAssistant": "🤖 Assistente",
  "chat.exportRoleSystem": "🔧 Sistema",

  // Chat — Avatars
  "chat.roleUser": "Você",
  "chat.roleAssistant": "Assistente",
  "chat.roleSystem": "Sistema",

  // Chat — Slash commands
  "chat.slashSummarize": "Resuma o conteúdo a seguir de forma concisa, destacando os pontos principais:\n\n",
  "chat.slashTranslate": "Traduza o conteúdo a seguir para o português, preservando formatação e termos técnicos:\n\n",
  "chat.slashExplain": "Explique o conceito a seguir em detalhes, com exemplos e aplicações práticas:\n\n",
  "chat.slashToc": "Gere um sumário estruturado para o seguinte conteúdo:\n\n",
  "chat.slashFlashcards": "Crie 10 flashcards de perguntas e respostas no formato P: ... R: ...:\n\n",
  "chat.slashRewrite": "Reescreva o conteúdo a seguir melhorando clareza, estrutura e estilo:\n\n",
  "chat.slashExpand": "Expanda o conteúdo a seguir adicionando mais detalhes, contexto e exemplos:\n\n",

  // Commands
  "commands.sendSelection": "Enviar seleção para o Copilot",
  "commands.indexVault": "Copilot: Indexar vault para pesquisa semântica",
  "commands.clearIndex": "Copilot: Limpar índice de pesquisa semântica",
  "commands.saveChat": "Copilot: Salvar chat em arquivo",
  "commands.exportJson": "Copilot: Exportar chat como JSON",

  // Notices
  "notices.noTextSelected": "Nenhum texto selecionado.",
  "notices.indexingVault": "Indexando vault...",
  "notices.indexingProgress": "Indexando: {current}/{total} arquivos",
  "notices.indexCorrupted": "Arquivo de índice parece corrompido ou falhou ao carregar. Tente limpar e reindexar.",
  "notices.indexEmpty": "Indexação do vault concluída, mas nenhum arquivo foi indexado. Verifique as pastas excluídas ou tente novamente.",
  "notices.indexEmptyVectors": "A indexação do vault produziu vetores VAZIOS. Seu modelo de embedding não gera embeddings. Carregue um modelo de embedding dedicado (nomic-embed-text, all-MiniLM-L6-v2) no LM Studio e defina-o em Configurações → Modelo de Embedding, depois limpe e reindexe.",
  "notices.indexComplete": "Indexação do vault concluída! {chunks} chunks indexados.",
  "notices.indexFailed": "Falha na indexação: {error}",
  "notices.indexCleared": "Índice limpo.",

  // Quick Ask
  "quickAsk.title": "Pergunta Rápida",
  "quickAsk.placeholder": "Pergunte qualquer coisa...",
  "quickAsk.btnAsk": "Perguntar",
  "quickAsk.btnThinking": "Pensando...",
  "quickAsk.error": "Erro: {error}",

  // License
  "license.rejected": "Licença rejeitada: {reason}",
  "license.serverError": "Erro do servidor ({status}). Verifique sua chave no Lemon Squeezy.",
  "license.offlineError": "Não foi possível contactar o servidor de licença. Verifique sua conexão com a internet.",
  "license.demoKeyDenied": "Chave de demonstração requer modo de depuração (COPILOT_DEBUG=1)",
  "license.dailyLimitReached": "⚠️ Limite diário atingido. Atualize para Pro para mensagens ilimitadas.",

  // Provider & Services
  "provider.unsupportedTask": "Nenhum provedor disponível para esta tarefa ({task}). Configure um provedor em Configurações.",
  "provider.emptyEmbeddingResponse": "Nenhum embedding retornado pelo provedor. Verifique se o modelo selecionado suporta embeddings.",
  "provider.zeroVectorEmbedding": "O modelo retornou um embedding de vetor zero. Verifique se o modelo selecionado é um modelo de embedding real (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "Todos os modelos estão ocupados ou indisponíveis. Tente novamente mais tarde.",
  "provider.anthropicNoEmbeddings": "Anthropic não suporta embeddings. Configure um provedor diferente (DeepSeek, OpenAI ou LM Studio) para embeddings em Configurações.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic não suporta embeddings.",

  // Circuit Breaker
  "circuit.rateLimited": "Limitado por taxa. Tentando novamente em {seconds}s...",
  "circuit.open": "API indisponível após {failures} falhas. Circuito aberto por {cooldown}s.",
  "circuit.retrying": "Erro de API (tentativa {attempt}/3). Tentando novamente em 2s...",
  "circuit.statusOpen": "API desabilitada por {remaining}s",
  "circuit.statusDegraded": "{failures} falhas recentes",
  "circuit.statusClosed": "OK",

  // Web Search
  "webSearch.urlNotConfigured": "URL do servidor de pesquisa web não configurada.",
  "webSearch.serverError": "Servidor de pesquisa retornou {status}: {text}",
  "webSearch.noResults": "Nenhum resultado encontrado.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nTrecho: {snippet}",

  // Agent
  "agent.maxIterationsReached": "Número máximo de iterações de chamada de ferramenta atingido.",
  "agent.fallbackResponse": "Completei a análise, mas não consegui gerar uma resposta final.",
  "agent.fallbackTruncated": "Atingi o número máximo de chamadas de ferramenta. Com base no que encontrei, o vault pode não ter informações suficientes. Tente ser mais específico ou indexar notas adicionais.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // Tool: read_note
  "tools.readNote.description": "Lê o conteúdo completo de uma nota do vault. Aceita nome da nota com ou sem extensão .md e com ou sem caminho. Ex: '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. Ideal para consultar notas salvas anteriormente.",
  "tools.readNote.paramPath": "Nome ou caminho da nota (com ou sem .md, com ou sem pasta). Ex: '01_02_Qualitaet_als_Erfolgsfaktor' ou '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "Erro: nenhum caminho fornecido.",
  "tools.readNote.error.invalidPath": "Erro: caminho inválido.",
  "tools.readNote.autoFound": "[Encontrado automaticamente: {path}]",
  "tools.readNote.foundMultiple": "Encontradas {count} notas com nome \"{name}\". Especifique o caminho completo:\n{paths}",
  "tools.readNote.exactMatchNotFound": "Correspondência exata não encontrada para \"{name}\". Notas semelhantes:\n{paths}",
  "tools.readNote.error.notFound": "Erro: a nota \"{path}\" não existe no vault.",
  "tools.readNote.error.readError": "Erro ao ler \"{path}\": {error}",

  // Tool: read_pdf
  "tools.readPdf.description": "Extrai texto de um PDF. REQUER pagesOnly para PDFs grandes (>20 páginas). Use pagesOnly: '116-138' para páginas específicas. Use tocOnly: true para o sumário. Sem parâmetros, funciona apenas em PDFs de ≤20 páginas.",
  "tools.readPdf.customInstructions": "Para read_pdf: SEMPRE use find_files PRIMEIRO para localizar o PDF. Use pagesOnly para solicitar páginas específicas. NUNCA chame read_pdf sem primeiro encontrar o caminho correto.",
  "tools.readPdf.paramPath": "Caminho para o PDF no vault.",
  "tools.readPdf.paramTocOnly": "Retorna apenas o sumário / tabela de conteúdos do PDF.",
  "tools.readPdf.paramPagesOnly": "Intervalo de páginas específico (ex: '10-20' ou '5,8,12').",
  "tools.readPdf.error.noPath": "Erro: nenhum caminho fornecido.",
  "tools.readPdf.multiplePdfs": "Múltiplos PDFs correspondem a \"{path}\":\n{paths}\nEspecifique o caminho exato.",
  "tools.readPdf.error.notFound": "Erro: \"{path}\" não existe.",
  "tools.readPdf.tooLarge": "O PDF tem {pages} páginas. Use pagesOnly para ler páginas específicas (ex: pagesOnly: \"116-138\") ou tocOnly: true para o sumário.",
  "tools.readPdf.noText": "Nenhum texto encontrado.",
  "tools.readPdf.tocHeader": "[Sumário do PDF — {pages} páginas no total]",
  "tools.readPdf.pageHeader": "[Páginas {spec} de {total} total]",
  "tools.readPdf.pageLabel": "[Página {num}]",
  "tools.readPdf.totalPages": "[{total} páginas no total]",
  "tools.readPdf.tocSeparator": "═══ SUMÁRIO / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ CONTEÚDO ═══",
  "tools.readPdf.truncationNotice": "[Nota: O PDF tem {pages} páginas. Apenas as primeiras 500 são exibidas.]",
  "tools.readPdf.error.generic": "Erro: {error}",

  // Tool: create_note
  "tools.createNote.description": "Cria uma nova nota no vault com o título e conteúdo fornecidos (formato Markdown).",
  "tools.createNote.paramTitle": "Título da nota (sem extensão).",
  "tools.createNote.paramContent": "Conteúdo da nota em formato Markdown.",
  "tools.createNote.error.noTitle": "Erro: nenhum título fornecido.",
  "tools.createNote.error.noContent": "Erro: nenhum conteúdo fornecido.",
  "tools.createNote.error.alreadyExists": "Erro: já existe uma nota com o nome \"{name}\".",
  "tools.createNote.success": "Nota criada com sucesso: \"{name}\" ({length} caracteres).",
  "tools.createNote.error.createError": "Erro ao criar nota: {error}",

  // Tool: update_note
  "tools.updateNote.description": "Sobrescreve o conteúdo de uma nota existente no vault. Use o caminho completo. Se a nota não existir, retorna um erro (use create_note para novas notas).",
  "tools.updateNote.paramPath": "Caminho completo da nota a modificar (ex: '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "Novo conteúdo completo da nota em formato Markdown.",
  "tools.updateNote.error.noPath": "Erro: nenhum caminho fornecido.",
  "tools.updateNote.error.noContent": "Erro: nenhum conteúdo fornecido.",
  "tools.updateNote.error.notFound": "Erro: a nota \"{path}\" não existe. Use create_note para criar uma nova.",
  "tools.updateNote.error.mismatch": "Erro: A nota \"{path}\" foi reportada como atualizada, mas o conteúdo não corresponde (esperado {expected} caracteres, lido {actual} caracteres).",
  "tools.updateNote.success": "Nota \"{path}\" atualizada com sucesso ({length} caracteres).",
  "tools.updateNote.error.updateError": "Erro ao atualizar \"{path}\": {error}",

  // Tool: find_files
  "tools.findFiles.description": "Pesquisa arquivos no vault por padrão de nome. Retorna caminhos dos arquivos correspondentes. Útil para encontrar imagens, PDFs ou notas quando você não sabe o caminho exato.",
  "tools.findFiles.paramNameQuery": "Parte do nome do arquivo a pesquisar (ex: 'MapaPolitico', 'diagram', 'photo.png'). Não diferencia maiúsculas/minúsculas.",
  "tools.findFiles.paramExtension": "Filtrar por extensão (ex: 'png', 'pdf', 'md'). Opcional.",
  "tools.findFiles.error.emptyQuery": "Erro: termo de pesquisa vazio.",
  "tools.findFiles.noResults": "Nenhum arquivo encontrado correspondendo a \"{query}\"{extension}.",
  "tools.findFiles.results": "{results}\n... e mais {more}.",
  "tools.findFiles.error.searchError": "Erro ao pesquisar arquivos: {error}",

  // Tool: list_notes
  "tools.listNotes.description": "Lista notas em uma pasta do vault (ou raiz se não especificada).",
  "tools.listNotes.paramFolder": "Pasta a listar (opcional). Se não especificada, lista a raiz.",
  "tools.listNotes.noNotes": "Nenhuma nota encontrada.",

  // Tool: search_vault_fulltext
  "tools.searchVaultFulltext.description": "Pesquisa texto exato em todas as notas do vault (mais rápido que pesquisa semântica).",
  "tools.searchVaultFulltext.paramQuery": "Texto a pesquisar.",
  "tools.searchVaultFulltext.error.emptyQuery": "Erro: consulta vazia.",
  "tools.searchVaultFulltext.notFound": "Não encontrou \"{query}\" em nenhuma nota.",

  // Tool: search_vault_semantic
  "tools.searchVaultSemantic.description": "Pesquisa notas do vault usando pesquisa semântica (RAG). Retorna fragmentos relevantes com base na consulta.",
  "tools.searchVaultSemantic.paramQuery": "A consulta de pesquisa.",
  "tools.searchVaultSemantic.paramStartDate": "Filtro opcional: data inicial ISO.",
  "tools.searchVaultSemantic.paramEndDate": "Filtro opcional: data final ISO.",
  "tools.searchVaultSemantic.error.emptyQuery": "Erro: consulta vazia.",
  "tools.searchVaultSemantic.error.notEnabled": "Erro: pesquisa semântica não está ativada. Ative 'enableSemanticSearch' nas configurações e indexe o vault.",
  "tools.searchVaultSemantic.noResults": "Nenhum fragmento relevante encontrado para a consulta.",
  "tools.searchVaultSemantic.fragment": "[Fragmento {index}] ({path}, relevância: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "Erro na pesquisa semântica: {error}",

  // Tool: search_vault_by_timeframe
  "tools.searchVaultByTimeframe.description": "Pesquisa notas do vault modificadas entre duas datas no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss). Útil para ver o que o usuário fez em um período.",
  "tools.searchVaultByTimeframe.paramStartDate": "Data inicial no formato ISO 8601, ex: 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "Data final no formato ISO 8601, ex: 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "Erro: datas inválidas. Use o formato ISO 8601 (YYYY-MM-DDTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "Nenhuma nota encontrada modificada entre {start} e {end}.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nModificado: {mtime}\nConteúdo: {snippet}...",

  // Tool: search_web
  "tools.searchWeb.description": "Realiza uma pesquisa web usando um navegador automatizado e retorna os resultados mais relevantes (título, url, trecho).",
  "tools.searchWeb.paramQuery": "A consulta de pesquisa web.",
  "tools.searchWeb.error.emptyQuery": "Erro: consulta vazia.",
  "tools.searchWeb.noResults": "Nenhum resultado encontrado para: \"{query}\".",
  "tools.searchWeb.error.generic": "Erro na pesquisa web: {error}",

  // Tool: analyze_image
  "tools.analyzeImage.description": "Analisa uma imagem do vault e fornece uma descrição detalhada. Use o caminho da imagem (ex: 'folder/diagram.png'). Suporta png, jpg, jpeg, gif, webp.",
  "tools.analyzeImage.paramImagePath": "Caminho para o arquivo de imagem dentro do vault.",
  "tools.analyzeImage.error.noPath": "Erro: nenhum caminho de imagem fornecido.",
  "tools.analyzeImage.error.configError": "Erro: {error}",
  "tools.analyzeImage.noResponse": "Nenhuma resposta recebida do modelo de visão.",
  "tools.analyzeImage.error.apiError": "Erro de API: {message}",
  "tools.analyzeImage.error.connectionRefused": "Erro: Não foi possível conectar ao servidor de visão. Certifique-se de que seu modelo de visão local está em execução com um modelo compatível carregado.",
  "tools.analyzeImage.error.generic": "Erro ao analisar a imagem: {error}",

  // Tool: extract_youtube_transcript
  "tools.extractYoutubeTranscript.description": "Obtém a transcrição (legendas) de um vídeo do YouTube a partir de sua URL.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "URL do vídeo do YouTube (ex: https://www.youtube.com/watch?v=... ou https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "Erro: nenhuma URL de vídeo fornecida.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "Erro: não foi possível extrair o ID do vídeo da URL: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "Nenhuma transcrição encontrada para este vídeo (as legendas podem não estar disponíveis).",
  "tools.extractYoutubeTranscript.header": "Transcrição do vídeo {videoId}:",
  "tools.extractYoutubeTranscript.error.generic": "Erro ao obter transcrição: {error}",

  // Tool: render_pdf_pages
  "tools.renderPdfPages.description": "Renderiza páginas específicas de PDF como imagens PNG e as salva no vault. Retorna caminhos exatos (ex: 'Resources/PDF_images/PDF_page_40.png'). IMPORTANTE: use os caminhos EXATOS retornados por esta ferramenta para ![[embeds]]. NÃO invente caminhos.",
  "tools.renderPdfPages.paramPath": "Caminho para o PDF no vault.",
  "tools.renderPdfPages.paramPages": "Páginas a renderizar (ex: '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "Pasta para salvar as imagens (opcional, padrão: ao lado do PDF).",
  "tools.renderPdfPages.paramScale": "Escala de renderização (1.0 = 72 DPI, 2.0 = 144 DPI). Padrão: 2.0.",
  "tools.renderPdfPages.error.noPath": "Erro: nenhum caminho de PDF fornecido.",
  "tools.renderPdfPages.error.noPages": "Erro: nenhuma página especificada.",
  "tools.renderPdfPages.multiplePdfs": "Múltiplos PDFs correspondem a \"{path}\". Especifique o caminho exato.",
  "tools.renderPdfPages.error.notFound": "Erro: \"{path}\" não existe.",
  "tools.renderPdfPages.error.invalidRange": "Erro: intervalo de páginas inválido: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "Erro: não foi possível criar a pasta de saída \"{folder}\": {error}",
  "tools.renderPdfPages.error.noValidPages": "Erro: nenhuma página válida. O PDF tem {pages} páginas.",
  "tools.renderPdfPages.error.canvas": "Erro: não foi possível criar contexto 2D de canvas para a página {page}.",
  "tools.renderPdfPages.error.renderError": "Erro ao renderizar página {page}: {error}",
  "tools.renderPdfPages.result": "{rendered}/{total} páginas renderizadas:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "Erro ao renderizar páginas PDF: {error}",

  // Tool: extract_pdf_images
  "tools.extractPdfImages.description": "Extrai imagens JPG/PNG incorporadas de páginas PDF. Requer 'unpdf' instalado (npm install unpdf). Se não houver imagens raster (gráficos vetoriais/diagramas), renderiza a página inteira como PNG. Use render_pdf_pages se precisar apenas de páginas inteiras.",
  "tools.extractPdfImages.paramPath": "Caminho para o PDF no vault.",
  "tools.extractPdfImages.paramPages": "Páginas (ex: '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "Pasta de saída (opcional).",
  "tools.extractPdfImages.error.pathAndPages": "Erro: caminho e páginas são obrigatórios.",
  "tools.extractPdfImages.multiplePdfs": "Múltiplos PDFs correspondem. Especifique o caminho exato.",
  "tools.extractPdfImages.error.notFound": "Erro: \"{path}\" não existe.",
  "tools.extractPdfImages.error.invalidRange": "Erro: intervalo inválido: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "Erro: páginas fora do intervalo ({pages} total).",
  "tools.extractPdfImages.result": "{count} imagens extraídas de {pages} páginas:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (página inteira)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ Página {page}: renderização falhou",
  "tools.extractPdfImages.error.canvas": "❌ Página {page}: não foi possível criar canvas",
  "tools.extractPdfImages.error.generic": "Erro: {error}",

  // Tool: get_vault_stats
  "tools.getVaultStats.description": "Retorna estatísticas do vault: número de notas, tamanho total, pastas.",
  "tools.getVaultStats.stats": "Notas: {notes}\nTamanho total: ~{size}\nPastas: {folders}",

  // Tool: get_active_file
  "tools.getActiveFile.description": "Retorna o conteúdo do arquivo atualmente aberto no editor.",
  "tools.getActiveFile.noFileOpen": "Nenhum arquivo está aberto no momento.",
  "tools.getActiveFile.error": "Erro: {error}",

  // Tool: get_frontmatter
  "tools.getFrontmatter.description": "Extrai o frontmatter (metadados YAML) de uma nota.",
  "tools.getFrontmatter.paramPath": "Caminho para a nota.",
  "tools.getFrontmatter.error.notFound": "Erro: \"{path}\" não existe.",
  "tools.getFrontmatter.noFrontmatter": "Sem frontmatter.",
  "tools.getFrontmatter.error.generic": "Erro: {error}",

  // Tool registry
  "tools.registry.errorExecute": "Erro ao executar ferramenta \"{name}\": {error}",
  "tools.registry.errorNotFound": "Ferramenta \"{name}\" não registrada",

  // Errors
  "errors.unknown": "Erro desconhecido",
  "errors.fetchFailed": "Falha na busca",

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
  "labels.unknown": "Erro desconhecido",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ não suportado)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "Embeddings",
  "labels.vision": "Visão",
  "labels.lmStudio": "LM Studio",
};
