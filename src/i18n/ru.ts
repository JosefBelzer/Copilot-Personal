export const ru: Record<string, string> = {
  "settings.title": "Copilot Personal - Настройки",
  "settings.language": "Язык / Language",
  "settings.apiKey": "API-ключ",
  "settings.licenseKey": "Лицензионный ключ",
  "settings.licenseKeyDesc": "Pro-ключ от Lemon Squeezy. Оставьте пустым для Free.",
  "settings.provider": "Провайдер",
  "settings.chatModel": "Модель чата",
  "settings.embeddingModel": "Модель эмбеддингов",
  "settings.visionModel": "Модель зрения",
  "settings.temperature": "Температура",
  "settings.maxTokens": "Макс. токенов",
  "settings.streamResponses": "Потоковые ответы",
  "settings.semanticSearch": "Включить семантический поиск",
  "settings.webSearch": "Включить веб-поиск",
  "settings.vision": "Включить зрение",
  "settings.agentMode": "Включить режим агента",
  "settings.budgetTitle": "Бюджетный AI (Pro)",
  "settings.budgetEnable": "Использовать бюджетный AI Copilot",
  "chat.btnNew": "Новый",
  "chat.btnSave": "Сохранить",
  "chat.btnHistory": "История",
  "chat.btnSend": "Отправить",
  "chat.btnStop": "Стоп",
  "chat.btnAgent": "Агент",
  "chat.btnThink": "Думать",
  "chat.headerPrivacyLocal": "🔒 Локально",
  "chat.headerPrivacyCloud": "☁️ Облако",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "Готов",
  "chat.statusThinking": "Думаю...",
  "chat.statusError": "Ошибка",
  "chat.greeting": "Здравствуйте! Я ваш персональный AI-копilot.",
  "chat.rateLimitReached": "⚠️ Дневной лимит достигнут ({used}/{limit}). Обновитесь до Pro.",
  "chat.crashRecovery": "📝 Предыдущая сессия восстановлена.",
  "commands.openChat": "Открыть чат Copilot",
  "commands.newChat": "Copilot: Новый чат",
  "commands.quickAsk": "Copilot: Быстрый вопрос",
  "commands.exportMd": "Copilot: Экспорт в Markdown",
  "license.proActivated": "✅ Pro-лицензия успешно активирована.",
  "license.freeActivated": "🆓 Режим Free активирован.",
  // ═══════════════════════════════════════════════════════════════
  //  SETTINGS TAB
  // ═══════════════════════════════════════════════════════════════

  "settings.languageDesc": "Выберите язык интерфейса. Изменения применяются немедленно.",

  // API Configuration
  "settings.apiConfiguration": "Конфигурация API",
  "settings.apiKeyDesc": "Ваш API-ключ для {provider} (хранится в data.json — НЕ зашифрован. НЕ сохраняйте в Git.)",
  "settings.licenseClearTooltip": "Очистить лицензию (вернуться на Free)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "URL API",
  "settings.apiUrlDesc": "Базовый URL для конечной точки API",
  "settings.providerDesc": "Выберите LLM-провайдера",
  "settings.detectModels": "Обнаружить модели",
  "settings.detectModelsDesc": "Запросить /v1/models у LM Studio для поиска загруженных моделей",
  "settings.lmStatusQuerying": "Запрос к LM Studio...",
  "settings.lmStatusNoModels": "Модели не найдены. Сначала загрузите модель в LM Studio.",
  "settings.lmStatusFound": "Найдено {count} модель(ей): {models}",
  "settings.lmStatusError": "Ошибка: {error}. Убедитесь, что LM Studio запущена.",
  "settings.fallbackModelName": "Модель {cap} (резервная)",

  // Provider dropdown names
  "provider.name.auto": "Автоопределение (из URL)",
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

  // Budget AI
  "settings.budgetEnableDesc": "Бесплатный управляемый API через Mistral Nemo. API-ключ не требуется. Включает дневные лимиты использования.",
  "settings.budgetProRequired": "🔒 Copilot AI требует лицензию Pro. Обновитесь до Pro для использования бюджетного API.",

  // Model Configuration
  "settings.modelConfig": "Конфигурация модели",
  "settings.temperatureDesc": "Контролирует случайность (0.0 = детерминировано, 2.0 = очень случайно)",
  "settings.maxTokensDesc": "Максимальное количество токенов в ответе",
  "settings.topP": "Top P",
  "settings.topPDesc": "Ядерная выборка (0.0-1.0). Ниже = более сфокусировано",
  "settings.topK": "Top K",
  "settings.topKDesc": "Ограничивает выбор токенов до верхних K (0 = отключено)",
  "settings.presencePenalty": "Штраф за повторение",
  "settings.presencePenaltyDesc": "Штрафует повторяющиеся токены (0-2). Выше = меньше повторений",
  "settings.enableThinking": "Включить режим мышления",
  "settings.enableThinkingDesc": "Использовать DeepSeek V4 мышление/рассуждение (несовместимо с temperature/top_p/presence_penalty)",
  "settings.reasoningEffort": "Усилие рассуждения",
  "settings.reasoningEffortDesc": "Применяется только при включённом режиме мышления (DeepSeek V4)",
  "settings.streamResponsesDesc": "Показывать ответ токен за токеном",
  "settings.contextTurns": "Контекстные ходы",
  "settings.contextTurnsDesc": "Количество предыдущих ходов, включаемых в контекст",
  "settings.semanticSearchDesc": "Индексировать хранилище для семантического поиска в чате",
  "settings.semanticSearchProLocked": "🔒 Семантический поиск требует лицензию Pro",
  "settings.maxSourceChunks": "Макс. фрагментов источника",
  "settings.maxSourceChunksDesc": "Количество фрагментов для получения по запросу",
  "settings.chunkSize": "Размер фрагмента (токены)",
  "settings.chunkSizeDesc": "Примерное количество токенов на фрагмент",

  // Web Search
  "settings.webSearchDesc": "Разрешить веб-поиск через микросервис browser-use",
  "settings.webSearchProLocked": "🔒 Веб-поиск требует лицензию Pro",
  "settings.webSearchServerUrl": "URL сервера веб-поиска",
  "settings.webSearchServerUrlDesc": "URL микросервиса browser-use на Python",
  "settings.webSearchMaxResults": "Макс. результатов поиска",
  "settings.webSearchMaxResultsDesc": "Сколько результатов веб-поиска возвращать",
  "settings.webSearchToken": "Токен веб-поиска",
  "settings.webSearchTokenDesc": "Токен аутентификации для Python-сервера поиска (должен совпадать с COPILOT_WEB_TOKEN сервера)",
  "settings.webSearchTokenPlaceholder": "ваш-безопасный-токен",

  // Vision
  "settings.visionDesc": "Использовать модель зрения для изображений",
  "settings.visionNotSupported": "Недоступно для этого провайдера",
  "settings.visionProLocked": "🔒 Зрение требует лицензию Pro",
  "settings.imageDrop": "Включить перетаскивание изображений",
  "settings.imageDropDesc": "Разрешить перетаскивание изображений в чат",

  // Chat History
  "settings.saveChatHistory": "Сохранять историю чата",
  "settings.saveChatHistoryDesc": "Сохранять разговоры как Markdown-файлы в хранилище",
  "settings.chatHistoryFolder": "Папка истории чата",
  "settings.chatHistoryFolderDesc": "Папка для хранения файлов истории чата",

  // Memory
  "settings.enableMemory": "Включить память",
  "settings.enableMemoryDesc": "Запоминать ключевые факты между сессиями чата",
  "settings.memoryFolder": "Папка памяти",
  "settings.memoryFolderDesc": "Папка для хранения файлов памяти",
  "settings.maxMemories": "Макс. воспоминаний",
  "settings.maxMemoriesDesc": "Количество последних воспоминаний для загрузки в новом чате",

  // Agent Mode
  "settings.agentModeDesc": "Позволить AI использовать инструменты и выполнять действия автономно",
  "settings.agentModeToolCallingNA": "Вызов инструментов недоступен для этого провайдера",
  "settings.agentModeProLocked": "🔒 Режим агента требует лицензию Pro",
  "settings.maxAgentIterations": "Макс. итераций агента",
  "settings.maxAgentIterationsDesc": "Максимальное количество вызовов инструментов за запуск агента",

  // LM Studio detect
  "settings.lmDetectTitle": "LM Studio - Обнаружить модели",
  "settings.lmStatusDefault": "Нажмите 'Обнаружить', чтобы получить доступные модели из LM Studio.",
  "settings.lmDetectButton": "Обнаружить",
  "settings.lmStatusFoundNotice": "Найдено {count} модель(ей) в LM Studio. Первая модель ({model}) установлена по умолчанию.",

  // Model names
  "settings.chatModelDesc": "Модель для чат-завершений",
  "settings.embeddingModelDesc": "Модель для эмбеддингов{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ НЕ поддерживается этим провайдером)",
  "settings.visionModelDesc": "Модель для задач зрения/изображений",

  // Section headers
  "settings.chatOptions": "Настройки чата",
  "settings.chatHistory": "История чата",
  "settings.memory": "Память",
  "settings.lmVisionTitle": "LM Studio (Анализ изображений)",
  "settings.sectionSemanticSearch": "Семантический поиск (RAG)",
  "settings.sectionWebSearch": "Веб-поиск (browser-use)",
  "settings.sectionVision": "Зрение / Изображения",
  "settings.sectionAgentMode": "Режим агента",

  // Reasoning
  "settings.reasoningHigh": "Высокий",
  "settings.reasoningMax": "Максимум",

  // Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 Резервный мульти-провайдер",
  "settings.fallbackFor": "Резерв для {cap}",
  "settings.fallbackSelect": "Выберите провайдера, который ПОДДЕРЖИВАЕТ {cap}",
  "settings.fallbackProLocked": "🔒 Требуется лицензия Pro",
  "settings.fallbackModelDesc": "Имя модели для {cap} в резервном провайдере",
  "settings.multiProviderProNotice": "Резервный мульти-провайдер требует лицензию Pro. С Pro вы можете использовать второго провайдера для возможностей, которых не хватает вашему основному провайдеру.",
  "settings.providerNoSupport": "{provider} не поддерживает {cap}",
  "settings.providerSelectSupporting": "Выберите провайдера, который ПОДДЕРЖИВАЕТ {cap}",

  // ═══════════════════════════════════════════════════════════════
  //  CHAT VIEW
  // ═══════════════════════════════════════════════════════════════

  // Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "Начать новый чат",
  "chat.saveChatTooltip": "Сохранить чат в файл",
  "chat.browseHistoryTooltip": "Просмотреть сохранённые чаты",
  "chat.agentToggleTooltip": "Переключить режим агента (автономное использование инструментов)",
  "chat.thinkToggleTooltip": "Включить режим мышления (модель размышляет перед ответом)",
  "chat.sendPlaceholder": "Введите сообщение... (Enter для отправки, Shift+Enter для новой строки)",
  "chat.headerPrivacyLocalTooltip": "Данные обрабатываются локально. Никогда не покидают ваше устройство.",
  "chat.headerPrivacyCloudTooltip": "Данные отправляются на внешний сервер. Проверьте Настройки > Конфигурация API.",
  "chat.headerTierProTooltip": "Pro-лицензия активна — все функции разблокированы",
  "chat.headerTierFreeTooltip": "Free-уровень — 50 сообщений/день, ограниченные функции",

  // Status
  "chat.statusAgentModeOn": "Режим агента ВКЛ",
  "chat.statusAgentThinking": "Агент думает...",
  "chat.statusStopped": "Остановлено",
  "chat.statusNewChat": "Новый чат начат",
  "chat.statusThinkingOn": "Мышление ВКЛ",
  "chat.statusSearching": "Поиск в интернете: \"{query}\"...",
  "chat.statusSearchError": "Ошибка поиска",
  "chat.statusSaved": "Сохранено в {path}",
  "chat.statusSaveFailed": "Ошибка сохранения: {error}",
  "chat.statusParsing": "Разбор {name}...",
  "chat.statusPdfParsed": "PDF разобран: {name}",
  "chat.statusImageReady": "Изображение готово: {name}",
  "chat.statusAgentError": "Ошибка агента",
  "chat.statusExported": "Чат экспортирован в {fileName}",
  "chat.statusExportFailed": "Ошибка экспорта: {error}",

  // Messages — license
  "chat.licenseAgentRequired": "🔒 Режим агента требует лицензию Pro. Настройки → Лицензионный ключ.",
  "chat.licenseWebSearchRequired": "🔒 Веб-поиск требует лицензию Pro. Настройки → Лицензионный ключ.",
  "chat.memoriesLoaded": "📝 Загружено {count} предыдущих сводок.",

  // Messages — agent
  "chat.agentStepProgress": "⏳ Шаг {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ Модель заявляет о завершении, но сохранено только {written} из {expected} заметок. {missing} отсутствуют.",
  "chat.agentFallback": "⚠️ Режим агента не удался — резервный ответ:\n\n{response}",
  "chat.agentError": "Ошибка агента: {message}",
  "chat.agentWarnNotSaved": "⚠️ **ПРИМЕЧАНИЕ: Модель утверждает, что сохранила/изменила заметку, но не было использовано ни write-инструментов (update_note, create_note), ни маркера <!--save:-->. Утверждение является галлюцинацией.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 Режим агента пока недоступен с Copilot AI. Переключитесь на другого провайдера (DeepSeek, OpenAI и др.) в Настройках → Провайдер для использования режима агента.",

  // Messages — auto-save
  "chat.autoSaveResult": "📝 Автосохранено {saved}/{total} заметок:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 Обновлено {path} ({changed} строк изменено)",

  // Messages — chat
  "chat.noSavedChats": "Сохранённых чатов не найдено.",
  "chat.noMessagesToSave": "Нет сообщений для сохранения.",
  "chat.chatSaved": "Чат сохранён в {path}",
  "chat.chatSaveFailed": "Не удалось сохранить чат: {error}",
  "chat.savedChatsFound": "📂 {count} сохранённых чатов:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "Укажите поисковый запрос после `!search`.",
  "chat.searching": "Поиск: {query}",
  "chat.webSearchFailed": "Веб-поиск не удался: {error}",
  "chat.imageDroppedInfo": "Изображение перетащено: {name} (включите зрение в настройках для анализа изображений)",
  "chat.fileDroppedUnsupported": "Файл перетащен: {name} (неподдерживаемый формат)",
  "chat.fileDroppedError": "Ошибка обработки {name}: {error}",

  // Delete button
  "chat.deleteMessageTooltip": "Удалить это сообщение",

  // Loading states
  "chat.statusReading": "📕 Чтение файла...",
  "chat.statusSearchingVault": "🔍 Поиск в хранилище...",
  "chat.statusAnalyzingImage": "🖼️ Анализ изображения...",
  "chat.statusGeneratingEmbeddings": "🧮 Генерация эмбеддингов...",
  "chat.statusCompacting": "📦 Сжатие контекста...",
  "chat.statusDeepThinking": "💭 Размышление...",

  // Save/Export role labels
  "chat.saveRoleYou": "**Вы**",
  "chat.saveRoleAssistant": "**Ассистент**",
  "chat.saveRoleSystem": "**Система**",
  "chat.exportRoleUser": "👤 Пользователь",
  "chat.exportRoleAssistant": "🤖 Ассистент",
  "chat.exportRoleSystem": "🔧 Система",

  // Avatars
  "chat.roleUser": "Вы",
  "chat.roleAssistant": "Ассистент",
  "chat.roleSystem": "Система",

  // Slash commands
  "chat.slashSummarize": "Кратко изложите следующее содержание, выделив ключевые моменты:\n\n",
  "chat.slashTranslate": "Переведите следующее содержание на русский, сохраняя форматирование и технические термины:\n\n",
  "chat.slashExplain": "Объясните следующую концепцию подробно, с примерами и практическими применениями:\n\n",
  "chat.slashToc": "Создайте структурированное оглавление для следующего содержания:\n\n",
  "chat.slashFlashcards": "Создайте 10 карточек вопрос-ответ в формате В: ... О: ...:\n\n",
  "chat.slashRewrite": "Перепишите следующее содержание, улучшив ясность, структуру и стиль:\n\n",
  "chat.slashExpand": "Расширьте следующее содержание, добавив больше деталей, контекста и примеров:\n\n",

  // ═══════════════════════════════════════════════════════════════
  //  COMMANDS (main.ts)
  // ═══════════════════════════════════════════════════════════════

  "commands.sendSelection": "Отправить выделенное в Copilot",
  "commands.indexVault": "Copilot: Индексировать хранилище для семантического поиска",
  "commands.clearIndex": "Copilot: Очистить индекс семантического поиска",
  "commands.saveChat": "Copilot: Сохранить чат в файл",
  "commands.exportJson": "Copilot: Экспорт чата в JSON",

  // Notices — main.ts
  "notices.noTextSelected": "Текст не выбран.",
  "notices.indexingVault": "Индексация хранилища...",
  "notices.indexingProgress": "Индексация: {current}/{total} файлов",
  "notices.indexCorrupted": "Файл индекса повреждён или не загрузился. Попробуйте очистить и переиндексировать.",
  "notices.indexEmpty": "Индексация хранилища завершена, но файлы не проиндексированы. Проверьте исключённые папки или попробуйте снова.",
  "notices.indexEmptyVectors": "Индексация хранилища дала ПУСТЫЕ векторы. Ваша модель эмбеддингов не генерирует эмбеддинги. Загрузите выделенную модель эмбеддингов (nomic-embed-text, all-MiniLM-L6-v2) в LM Studio и укажите её в Настройках → Модель эмбеддингов, затем очистите и переиндексируйте.",
  "notices.indexComplete": "Индексация хранилища завершена! Проиндексировано {chunks} фрагментов.",
  "notices.indexFailed": "Индексация не удалась: {error}",
  "notices.indexCleared": "Индекс очищен.",

  // Quick Ask
  "quickAsk.title": "Быстрый вопрос",
  "quickAsk.placeholder": "Спросите что-нибудь...",
  "quickAsk.btnAsk": "Спросить",
  "quickAsk.btnThinking": "Думаю...",
  "quickAsk.error": "Ошибка: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  LICENSE
  // ═══════════════════════════════════════════════════════════════

  "license.rejected": "Лицензия отклонена: {reason}",
  "license.serverError": "Ошибка сервера ({status}). Проверьте свой ключ в Lemon Squeezy.",
  "license.offlineError": "Не удалось связаться с сервером лицензий. Проверьте подключение к интернету.",
  "license.demoKeyDenied": "Демо-ключ требует режим отладки (COPILOT_DEBUG=1)",
  "license.dailyLimitReached": "⚠️ Дневной лимит достигнут. Обновитесь до Pro для неограниченных сообщений.",

  // ═══════════════════════════════════════════════════════════════
  //  PROVIDER & SERVICES
  // ═══════════════════════════════════════════════════════════════

  "provider.unsupportedTask": "Нет доступного провайдера для этой задачи ({task}). Настройте провайдера в Настройках.",
  "provider.emptyEmbeddingResponse": "Провайдер не вернул эмбеддинг. Убедитесь, что выбранная модель поддерживает эмбеддинги.",
  "provider.zeroVectorEmbedding": "Модель вернула нулевой вектор эмбеддинга. Убедитесь, что выбрана настоящая модель эмбеддингов (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "Все модели заняты или недоступны. Повторите попытку позже.",
  "provider.anthropicNoEmbeddings": "Anthropic не поддерживает эмбеддинги. Настройте другого провайдера (DeepSeek, OpenAI или LM Studio) для эмбеддингов в Настройках.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic не поддерживает эмбеддинги.",

  // ═══════════════════════════════════════════════════════════════
  //  CIRCUIT BREAKER
  // ═══════════════════════════════════════════════════════════════

  "circuit.rateLimited": "Лимит запросов. Повтор через {seconds}с...",
  "circuit.open": "API недоступен после {failures} ошибок. Цепь разомкнута на {cooldown}с.",
  "circuit.retrying": "Ошибка API (попытка {attempt}/3). Повтор через 2с...",
  "circuit.statusOpen": "API отключён на {remaining}с",
  "circuit.statusDegraded": "{failures} последних ошибок",
  "circuit.statusClosed": "ОК",

  // ═══════════════════════════════════════════════════════════════
  //  WEB SEARCH CLIENT
  // ═══════════════════════════════════════════════════════════════

  "webSearch.urlNotConfigured": "URL сервера веб-поиска не настроен.",
  "webSearch.serverError": "Сервер поиска вернул {status}: {text}",
  "webSearch.noResults": "Результатов не найдено.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nФрагмент: {snippet}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT
  // ═══════════════════════════════════════════════════════════════

  "agent.maxIterationsReached": "Достигнуто максимальное количество вызовов инструментов.",
  "agent.fallbackResponse": "Я завершил анализ, но не смог сгенерировать окончательный ответ.",
  "agent.fallbackTruncated": "Я достиг максимального количества вызовов инструментов. Основываясь на найденном, в хранилище может не хватать информации. Попробуйте уточнить запрос или добавить заметки.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_note
  // ═══════════════════════════════════════════════════════════════

  "tools.readNote.description": "Читает полное содержимое заметки из хранилища. Принимает имя заметки с расширением .md или без, с путём или без. Например: '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. Идеально для просмотра ранее сохранённых заметок.",
  "tools.readNote.paramPath": "Имя заметки или путь (с .md или без, с папкой или без). Например: '01_02_Qualitaet_als_Erfolgsfaktor' или '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "Ошибка: путь не указан.",
  "tools.readNote.error.invalidPath": "Ошибка: неверный путь.",
  "tools.readNote.autoFound": "[Автонайдено: {path}]",
  "tools.readNote.foundMultiple": "Найдено {count} заметок с именем \"{name}\". Укажите полный путь:\n{paths}",
  "tools.readNote.exactMatchNotFound": "Точное совпадение для \"{name}\" не найдено. Похожие заметки:\n{paths}",
  "tools.readNote.error.notFound": "Ошибка: заметка \"{path}\" не существует в хранилище.",
  "tools.readNote.error.readError": "Ошибка чтения \"{path}\": {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_pdf
  // ═══════════════════════════════════════════════════════════════

  "tools.readPdf.description": "Извлекает текст из PDF. ТРЕБУЕТСЯ pagesOnly для больших PDF (>20 страниц). Используйте pagesOnly: '116-138' для конкретных страниц. Используйте tocOnly: true для оглавления. Без параметров работает только с PDF до 20 страниц.",
  "tools.readPdf.customInstructions": "Для read_pdf: ВСЕГДА сначала используйте find_files для поиска PDF. Используйте pagesOnly для запроса конкретных страниц. НИКОГДА не вызывайте read_pdf без предварительного поиска правильного пути.",
  "tools.readPdf.paramPath": "Путь к PDF в хранилище.",
  "tools.readPdf.paramTocOnly": "Возвращает только оглавление PDF.",
  "tools.readPdf.paramPagesOnly": "Конкретный диапазон страниц (например: '10-20' или '5,8,12').",
  "tools.readPdf.error.noPath": "Ошибка: путь не указан.",
  "tools.readPdf.multiplePdfs": "Несколько PDF соответствуют \"{path}\":\n{paths}\nУкажите точный путь.",
  "tools.readPdf.error.notFound": "Ошибка: \"{path}\" не существует.",
  "tools.readPdf.tooLarge": "PDF содержит {pages} страниц. Используйте pagesOnly для чтения конкретных страниц (например: pagesOnly: \"116-138\") или tocOnly: true для оглавления.",
  "tools.readPdf.noText": "Текст не найден.",
  "tools.readPdf.tocHeader": "[Оглавление PDF — всего {pages} страниц]",
  "tools.readPdf.pageHeader": "[Страницы {spec} из {total}]",
  "tools.readPdf.pageLabel": "[Страница {num}]",
  "tools.readPdf.totalPages": "[Всего {total} страниц]",
  "tools.readPdf.tocSeparator": "═══ ОГЛАВЛЕНИЕ / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ СОДЕРЖАНИЕ ═══",
  "tools.readPdf.truncationNotice": "[Примечание: PDF содержит {pages} страниц. Показаны только первые 500.]",
  "tools.readPdf.error.generic": "Ошибка: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: create_note
  // ═══════════════════════════════════════════════════════════════

  "tools.createNote.description": "Создаёт новую заметку в хранилище с указанным заголовком и содержимым (в формате Markdown).",
  "tools.createNote.paramTitle": "Заголовок заметки (без расширения).",
  "tools.createNote.paramContent": "Содержимое заметки в формате Markdown.",
  "tools.createNote.error.noTitle": "Ошибка: заголовок не указан.",
  "tools.createNote.error.noContent": "Ошибка: содержимое не указано.",
  "tools.createNote.error.alreadyExists": "Ошибка: заметка с именем \"{name}\" уже существует.",
  "tools.createNote.success": "Заметка успешно создана: \"{name}\" ({length} символов).",
  "tools.createNote.error.createError": "Ошибка создания заметки: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: update_note
  // ═══════════════════════════════════════════════════════════════

  "tools.updateNote.description": "Перезаписывает содержимое существующей заметки в хранилище. Используйте полный путь. Если заметка не существует, возвращает ошибку (используйте create_note для новых заметок).",
  "tools.updateNote.paramPath": "Полный путь к заметке для изменения (например: '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "Новое полное содержимое заметки в формате Markdown.",
  "tools.updateNote.error.noPath": "Ошибка: путь не указан.",
  "tools.updateNote.error.noContent": "Ошибка: содержимое не указано.",
  "tools.updateNote.error.notFound": "Ошибка: заметка \"{path}\" не существует. Используйте create_note для создания новой.",
  "tools.updateNote.error.mismatch": "Ошибка: заметка \"{path}\" была указана как обновлённая, но содержимое не совпадает (ожидалось {expected} символов, прочитано {actual} символов).",
  "tools.updateNote.success": "Заметка \"{path}\" успешно обновлена ({length} символов).",
  "tools.updateNote.error.updateError": "Ошибка обновления \"{path}\": {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: find_files
  // ═══════════════════════════════════════════════════════════════

  "tools.findFiles.description": "Ищет файлы в хранилище по имени. Возвращает пути соответствующих файлов. Полезно для поиска изображений, PDF или заметок, если точный путь неизвестен.",
  "tools.findFiles.paramNameQuery": "Часть имени файла для поиска (например: 'MapaPolitico', 'diagram', 'photo.png'). Регистронезависимо.",
  "tools.findFiles.paramExtension": "Фильтр по расширению (например: 'png', 'pdf', 'md'). Необязательно.",
  "tools.findFiles.error.emptyQuery": "Ошибка: пустой поисковый запрос.",
  "tools.findFiles.noResults": "Файлы, соответствующие \"{query}\"{extension}, не найдены.",
  "tools.findFiles.results": "{results}\n... и ещё {more}.",
  "tools.findFiles.error.searchError": "Ошибка поиска файлов: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: list_notes
  // ═══════════════════════════════════════════════════════════════

  "tools.listNotes.description": "Перечисляет заметки в папке хранилища (или корне, если папка не указана).",
  "tools.listNotes.paramFolder": "Папка для просмотра (необязательно). Если не указана, просматривается корень.",
  "tools.listNotes.noNotes": "Заметки не найдены.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_fulltext
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultFulltext.description": "Ищет точный текст по всем заметкам хранилища (быстрее семантического поиска).",
  "tools.searchVaultFulltext.paramQuery": "Текст для поиска.",
  "tools.searchVaultFulltext.error.emptyQuery": "Ошибка: пустой запрос.",
  "tools.searchVaultFulltext.notFound": "\"{query}\" не найдено ни в одной заметке.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_semantic
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultSemantic.description": "Ищет в заметках хранилища с помощью семантического поиска (RAG). Возвращает релевантные фрагменты на основе запроса.",
  "tools.searchVaultSemantic.paramQuery": "Поисковый запрос.",
  "tools.searchVaultSemantic.paramStartDate": "Необязательный фильтр: ISO дата начала.",
  "tools.searchVaultSemantic.paramEndDate": "Необязательный фильтр: ISO дата окончания.",
  "tools.searchVaultSemantic.error.emptyQuery": "Ошибка: пустой запрос.",
  "tools.searchVaultSemantic.error.notEnabled": "Ошибка: семантический поиск не включён. Включите 'enableSemanticSearch' в настройках и проиндексируйте хранилище.",
  "tools.searchVaultSemantic.noResults": "Релевантных фрагментов по запросу не найдено.",
  "tools.searchVaultSemantic.fragment": "[Фрагмент {index}] ({path}, релевантность: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "Ошибка семантического поиска: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_by_timeframe
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultByTimeframe.description": "Ищет заметки хранилища, изменённые между двумя датами в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss). Полезно для просмотра активности пользователя за период.",
  "tools.searchVaultByTimeframe.paramStartDate": "Дата начала в формате ISO 8601, например: 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "Дата окончания в формате ISO 8601, например: 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "Ошибка: неверные даты. Используйте формат ISO 8601 (YYYY-MM-DDTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "Заметки, изменённые между {start} и {end}, не найдены.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nИзменено: {mtime}\nСодержание: {snippet}...",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_web
  // ═══════════════════════════════════════════════════════════════

  "tools.searchWeb.description": "Выполняет веб-поиск с помощью автоматизированного браузера и возвращает наиболее релевантные результаты (заголовок, URL, фрагмент).",
  "tools.searchWeb.paramQuery": "Поисковый запрос.",
  "tools.searchWeb.error.emptyQuery": "Ошибка: пустой запрос.",
  "tools.searchWeb.noResults": "Результаты для \"{query}\" не найдены.",
  "tools.searchWeb.error.generic": "Ошибка веб-поиска: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: analyze_image
  // ═══════════════════════════════════════════════════════════════

  "tools.analyzeImage.description": "Анализирует изображение из хранилища и предоставляет подробное описание. Используйте путь к изображению (например: 'folder/diagram.png'). Поддерживает png, jpg, jpeg, gif, webp.",
  "tools.analyzeImage.paramImagePath": "Путь к файлу изображения в хранилище.",
  "tools.analyzeImage.error.noPath": "Ошибка: путь к изображению не указан.",
  "tools.analyzeImage.error.configError": "Ошибка: {error}",
  "tools.analyzeImage.noResponse": "Не получен ответ от модели зрения.",
  "tools.analyzeImage.error.apiError": "Ошибка API: {message}",
  "tools.analyzeImage.error.connectionRefused": "Ошибка: не удалось подключиться к серверу зрения. Убедитесь, что ваша локальная модель зрения запущена с подходящей моделью.",
  "tools.analyzeImage.error.generic": "Ошибка анализа изображения: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_youtube_transcript
  // ═══════════════════════════════════════════════════════════════

  "tools.extractYoutubeTranscript.description": "Получает транскрипт (субтитры) видео YouTube по его URL.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "URL видео YouTube (например: https://www.youtube.com/watch?v=... или https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "Ошибка: URL видео не указан.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "Ошибка: не удалось извлечь ID видео из URL: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "Транскрипт для этого видео не найден (субтитры могут быть недоступны).",
  "tools.extractYoutubeTranscript.header": "Транскрипт видео {videoId}:",
  "tools.extractYoutubeTranscript.error.generic": "Ошибка получения транскрипта: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: render_pdf_pages
  // ═══════════════════════════════════════════════════════════════

  "tools.renderPdfPages.description": "Преобразует указанные страницы PDF в PNG-изображения и сохраняет их в хранилище. Возвращает точные пути (например: 'Resources/PDF_images/PDF_page_40.png'). ВАЖНО: используйте ТОЧНЫЕ пути, возвращённые этим инструментом, для ![[встраиваний]]. Не выдумывайте пути.",
  "tools.renderPdfPages.paramPath": "Путь к PDF в хранилище.",
  "tools.renderPdfPages.paramPages": "Страницы для рендеринга (например: '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "Папка для сохранения изображений (необязательно, по умолчанию: рядом с PDF).",
  "tools.renderPdfPages.paramScale": "Масштаб рендеринга (1.0 = 72 DPI, 2.0 = 144 DPI). По умолчанию: 2.0.",
  "tools.renderPdfPages.error.noPath": "Ошибка: путь к PDF не указан.",
  "tools.renderPdfPages.error.noPages": "Ошибка: страницы не указаны.",
  "tools.renderPdfPages.multiplePdfs": "Несколько PDF соответствуют \"{path}\". Укажите точный путь.",
  "tools.renderPdfPages.error.notFound": "Ошибка: \"{path}\" не существует.",
  "tools.renderPdfPages.error.invalidRange": "Ошибка: неверный диапазон страниц: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "Ошибка: не удалось создать выходную папку \"{folder}\": {error}",
  "tools.renderPdfPages.error.noValidPages": "Ошибка: нет действительных страниц. PDF содержит {pages} страниц.",
  "tools.renderPdfPages.error.canvas": "Ошибка: не удалось создать 2D-контекст canvas для страницы {page}.",
  "tools.renderPdfPages.error.renderError": "Ошибка рендеринга страницы {page}: {error}",
  "tools.renderPdfPages.result": "Отрендерено {rendered}/{total} страниц:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "Ошибка рендеринга страниц PDF: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_pdf_images
  // ═══════════════════════════════════════════════════════════════

  "tools.extractPdfImages.description": "Извлекает встроенные JPG/PNG изображения из страниц PDF. Требуется 'unpdf' (npm install unpdf). Если растровых изображений нет (векторная графика/диаграммы), рендерит всю страницу как PNG. Используйте render_pdf_pages, если нужны только полные страницы.",
  "tools.extractPdfImages.paramPath": "Путь к PDF в хранилище.",
  "tools.extractPdfImages.paramPages": "Страницы (например: '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "Выходная папка (необязательно).",
  "tools.extractPdfImages.error.pathAndPages": "Ошибка: требуются путь и страницы.",
  "tools.extractPdfImages.multiplePdfs": "Несколько PDF соответствуют. Укажите точный путь.",
  "tools.extractPdfImages.error.notFound": "Ошибка: \"{path}\" не существует.",
  "tools.extractPdfImages.error.invalidRange": "Ошибка: неверный диапазон: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "Ошибка: страницы вне диапазона (всего {pages}).",
  "tools.extractPdfImages.result": "Извлечено {count} изображений из {pages} страниц:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (полная страница)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ Страница {page}: рендеринг не удался",
  "tools.extractPdfImages.error.canvas": "❌ Страница {page}: не удалось создать canvas",
  "tools.extractPdfImages.error.generic": "Ошибка: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_vault_stats
  // ═══════════════════════════════════════════════════════════════

  "tools.getVaultStats.description": "Возвращает статистику хранилища: количество заметок, общий размер, папки.",
  "tools.getVaultStats.stats": "Заметок: {notes}\nОбщий размер: ~{size}\nПапок: {folders}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_active_file
  // ═══════════════════════════════════════════════════════════════

  "tools.getActiveFile.description": "Возвращает содержимое файла, открытого в редакторе.",
  "tools.getActiveFile.noFileOpen": "Файл не открыт.",
  "tools.getActiveFile.error": "Ошибка: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_frontmatter
  // ═══════════════════════════════════════════════════════════════

  "tools.getFrontmatter.description": "Извлекает frontmatter (YAML-метаданные) из заметки.",
  "tools.getFrontmatter.paramPath": "Путь к заметке.",
  "tools.getFrontmatter.error.notFound": "Ошибка: \"{path}\" не существует.",
  "tools.getFrontmatter.noFrontmatter": "Frontmatter отсутствует.",
  "tools.getFrontmatter.error.generic": "Ошибка: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT — ToolRegistry
  // ═══════════════════════════════════════════════════════════════

  "tools.registry.errorExecute": "Ошибка выполнения инструмента \"{name}\": {error}",
  "tools.registry.errorNotFound": "Инструмент \"{name}\" не зарегистрирован",

  // ═══════════════════════════════════════════════════════════════
  //  ERROR — Generic
  // ═══════════════════════════════════════════════════════════════

  "errors.unknown": "Неизвестная ошибка",
  "errors.fetchFailed": "Ошибка получения данных",

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

  "labels.unknown": "Неизвестная ошибка",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ не поддерживается)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "Эмбеддинги",
  "labels.vision": "Зрение",
  "labels.lmStudio": "LM Studio",
};
