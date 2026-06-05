export const ar: Record<string, string> = {
  "settings.title": "Copilot Personal - الإعدادات",
  "settings.language": "اللغة / Language",
  "settings.apiKey": "مفتاح API",
  "settings.licenseKey": "مفتاح الترخيص",
  "settings.licenseKeyDesc": "مفتاح Pro من Lemon Squeezy. اتركه فارغاً للوضع المجاني.",
  "settings.provider": "المزود",
  "settings.chatModel": "نموذج المحادثة",
  "settings.embeddingModel": "نموذج التضمين",
  "settings.visionModel": "نموذج الرؤية",
  "settings.temperature": "درجة الحرارة",
  "settings.maxTokens": "الحد الأقصى للرموز",
  "settings.streamResponses": "تدفق الردود",
  "settings.semanticSearch": "تفعيل البحث الدلالي",
  "settings.webSearch": "تفعيل البحث في الويب",
  "settings.vision": "تفعيل الرؤية",
  "settings.agentMode": "تفعيل وضع الوكيل",
  "settings.budgetTitle": "AI الميزانية (Pro)",
  "settings.budgetEnable": "استخدام AI ميزانية Copilot",
  "chat.btnNew": "جديد",
  "chat.btnSave": "حفظ",
  "chat.btnHistory": "السجل",
  "chat.btnSend": "إرسال",
  "chat.btnStop": "إيقاف",
  "chat.btnAgent": "وكيل",
  "chat.btnThink": "تفكير",
  "chat.headerPrivacyLocal": "🔒 محلي",
  "chat.headerPrivacyCloud": "☁️ سحابي",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "جاهز",
  "chat.statusThinking": "يفكر...",
  "chat.statusError": "خطأ",
  "chat.greeting": "مرحباً! أنا مساعدك الشخصي AI.",
  "chat.rateLimitReached": "⚠️ تم الوصول إلى الحد اليومي ({used}/{limit}). قم بالترقية إلى Pro.",
  "chat.crashRecovery": "📝 تم استعادة الجلسة السابقة.",
  "commands.openChat": "فتح محادثة Copilot",
  "commands.newChat": "Copilot: محادثة جديدة",
  "commands.quickAsk": "Copilot: سؤال سريع",
  "commands.exportMd": "Copilot: تصدير كـ Markdown",
  "license.proActivated": "✅ تم تفعيل ترخيص Pro بنجاح.",
  "license.freeActivated": "🆓 تم تفعيل الوضع المجاني.",
  // ═══════════════════════════════════════════════════════════════
  //  SETTINGS TAB
  // ═══════════════════════════════════════════════════════════════

  "settings.languageDesc": "اختر لغة الواجهة. يتم تطبيق التغييرات فوراً.",

  // API Configuration
  "settings.apiConfiguration": "إعدادات API",
  "settings.apiKeyDesc": "مفتاح API الخاص بك لـ {provider} (مخزن في data.json — غير مشفر. لا ترسله إلى Git.)",
  "settings.licenseClearTooltip": "مسح الترخيص (العودة إلى Free)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "عنوان URL لـ API",
  "settings.apiUrlDesc": "عنوان URL الأساسي لنقطة نهاية API",
  "settings.providerDesc": "اختر مزود LLM",
  "settings.detectModels": "الكشف عن النماذج",
  "settings.detectModelsDesc": "الاستعلام عن نقطة /v1/models في LM Studio لاكتشاف النماذج المحملة",
  "settings.lmStatusQuerying": "جاري الاستعلام من LM Studio...",
  "settings.lmStatusNoModels": "لم يتم العثور على نماذج. قم بتحميل نموذج في LM Studio أولاً.",
  "settings.lmStatusFound": "تم العثور على {count} نموذج: {models}",
  "settings.lmStatusError": "خطأ: {error}. تأكد من أن LM Studio قيد التشغيل.",
  "settings.fallbackModelName": "نموذج {cap} (احتياطي)",

  // Provider dropdown names
  "provider.name.auto": "كشف تلقائي (من URL)",
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
  "settings.budgetEnableDesc": "API مجاني مُدار عبر Mistral Nemo. لا حاجة لمفتاح API. يشمل حدود استخدام يومية.",
  "settings.budgetProRequired": "🔒 Copilot AI يتطلب ترخيص Pro. قم بالترقية إلى Pro لاستخدام API الميزانية.",

  // Model Configuration
  "settings.modelConfig": "إعدادات النموذج",
  "settings.temperatureDesc": "التحكم في العشوائية (0.0 = حتمي، 2.0 = عشوائي جداً)",
  "settings.maxTokensDesc": "الحد الأقصى للرموز في الرد",
  "settings.topP": "Top P",
  "settings.topPDesc": "أخذ العينات النووي (0.0-1.0). الأقل = أكثر تركيزاً",
  "settings.topK": "Top K",
  "settings.topKDesc": "يحدد اختيار الرموز إلى أعلى K (0 = معطل)",
  "settings.presencePenalty": "عقوبة التكرار",
  "settings.presencePenaltyDesc": "يعاقب الرموز المتكررة (0-2). الأعلى = تكرار أقل",
  "settings.enableThinking": "تفعيل وضع التفكير",
  "settings.enableThinkingDesc": "استخدام DeepSeek V4 للتفكير/الاستدلال (غير متوافق مع temperature/top_p/presence_penalty)",
  "settings.reasoningEffort": "جهد الاستدلال",
  "settings.reasoningEffortDesc": "يسري فقط عند تفعيل وضع التفكير (DeepSeek V4)",
  "settings.streamResponsesDesc": "عرض الرد رمزاً رمزاً",
  "settings.contextTurns": "عدد جولات السياق",
  "settings.contextTurnsDesc": "عدد الجولات السابقة المضمنة في السياق",
  "settings.semanticSearchDesc": "فهرسة مخزن الملاحظات للبحث الدلالي في المحادثة",
  "settings.semanticSearchProLocked": "🔒 البحث الدلالي يتطلب ترخيص Pro",
  "settings.maxSourceChunks": "الحد الأقصى لقطع المصدر",
  "settings.maxSourceChunksDesc": "عدد القطع المستردة لكل استعلام",
  "settings.chunkSize": "حجم القطعة (رموز)",
  "settings.chunkSizeDesc": "عدد الرموز التقريبي لكل قطعة",

  // Web Search
  "settings.webSearchDesc": "السماح بالبحث في الويب عبر خدمة browser-use المصغرة",
  "settings.webSearchProLocked": "🔒 البحث في الويب يتطلب ترخيص Pro",
  "settings.webSearchServerUrl": "عنوان URL لخادم البحث في الويب",
  "settings.webSearchServerUrlDesc": "عنوان URL لخدمة browser-use المصغرة بلغة Python",
  "settings.webSearchMaxResults": "الحد الأقصى لنتائج البحث",
  "settings.webSearchMaxResultsDesc": "عدد نتائج الويب المراد إرجاعها",
  "settings.webSearchToken": "رمز البحث في الويب",
  "settings.webSearchTokenDesc": "رمز المصادقة المشترك مع خادم بحث Python (يجب أن يتطابق مع COPILOT_WEB_TOKEN للخادم)",
  "settings.webSearchTokenPlaceholder": "الرمز-الآمن-الخاص-بك",

  // Vision
  "settings.visionDesc": "استخدام نموذج الرؤية للصور",
  "settings.visionNotSupported": "غير متاح لهذا المزود",
  "settings.visionProLocked": "🔒 الرؤية تتطلب ترخيص Pro",
  "settings.imageDrop": "تفعيل إسقاط الصور",
  "settings.imageDropDesc": "السماح بسحب وإفلات الصور في المحادثة",

  // Chat History
  "settings.saveChatHistory": "حفظ سجل المحادثة",
  "settings.saveChatHistoryDesc": "حفظ المحادثات كملفات Markdown في المخزن",
  "settings.chatHistoryFolder": "مجلد سجل المحادثة",
  "settings.chatHistoryFolderDesc": "مجلد تخزين ملفات سجل المحادثة",

  // Memory
  "settings.enableMemory": "تفعيل الذاكرة",
  "settings.enableMemoryDesc": "تذكر الحقائق الرئيسية بين جلسات المحادثة",
  "settings.memoryFolder": "مجلد الذاكرة",
  "settings.memoryFolderDesc": "مجلد تخزين ملفات الذاكرة",
  "settings.maxMemories": "الحد الأقصى للذكريات",
  "settings.maxMemoriesDesc": "عدد الذكريات الحديثة المحملة في المحادثة الجديدة",

  // Agent Mode
  "settings.agentModeDesc": "السماح للـ AI باستخدام الأدوات وتنفيذ إجراءات متعددة بشكل مستقل",
  "settings.agentModeToolCallingNA": "استدعاء الأداة غير متاح لهذا المزود",
  "settings.agentModeProLocked": "🔒 وضع الوكيل يتطلب ترخيص Pro",
  "settings.maxAgentIterations": "أقصى عدد لتكرارات الوكيل",
  "settings.maxAgentIterationsDesc": "الحد الأقصى لعدد استدعاءات الأدوات لكل تشغيل وكيل",

  // LM Studio detect
  "settings.lmDetectTitle": "LM Studio - كشف النماذج",
  "settings.lmStatusDefault": "اضغط 'كشف' لجلب النماذج المتاحة من LM Studio.",
  "settings.lmDetectButton": "كشف",
  "settings.lmStatusFoundNotice": "تم العثور على {count} نموذج في LM Studio. تم تعيين النموذج الأول ({model}) كافتراضي.",

  // Model names
  "settings.chatModelDesc": "النموذج المستخدم لإكمال المحادثة",
  "settings.embeddingModelDesc": "نموذج التضمينات{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ غير مدعوم من هذا المزود)",
  "settings.visionModelDesc": "النموذج المستخدم لمهام الرؤية/الصور",

  // Section headers
  "settings.chatOptions": "خيارات المحادثة",
  "settings.chatHistory": "سجل المحادثة",
  "settings.memory": "الذاكرة",
  "settings.lmVisionTitle": "LM Studio (تحليل الصور)",
  "settings.sectionSemanticSearch": "البحث الدلالي (RAG)",
  "settings.sectionWebSearch": "البحث في الويب (browser-use)",
  "settings.sectionVision": "الرؤية / الصور",
  "settings.sectionAgentMode": "وضع الوكيل",

  // Reasoning
  "settings.reasoningHigh": "عالي",
  "settings.reasoningMax": "أقصى",

  // Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 احتياطي متعدد المزودين",
  "settings.fallbackFor": "احتياطي لـ {cap}",
  "settings.fallbackSelect": "اختر مزوداً يدعم {cap}",
  "settings.fallbackProLocked": "🔒 يتطلب ترخيص Pro",
  "settings.fallbackModelDesc": "اسم النموذج لـ {cap} في المزود الاحتياطي",
  "settings.multiProviderProNotice": "الاحتياطي متعدد المزودين يتطلب ترخيص Pro. مع Pro، يمكنك استخدام مزود ثانٍ للقدرات التي يفتقر إليها مزودك الأساسي.",
  "settings.providerNoSupport": "{provider} لا يدعم {cap}",
  "settings.providerSelectSupporting": "اختر مزوداً يدعم {cap}",

  // ═══════════════════════════════════════════════════════════════
  //  CHAT VIEW
  // ═══════════════════════════════════════════════════════════════

  // Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "بدء محادثة جديدة",
  "chat.saveChatTooltip": "حفظ المحادثة إلى ملف",
  "chat.browseHistoryTooltip": "تصفح المحادثات المحفوظة",
  "chat.agentToggleTooltip": "تبديل وضع الوكيل (استخدام الأدوات بشكل مستقل)",
  "chat.thinkToggleTooltip": "تفعيل وضع التفكير (النموذج يفكر قبل الرد)",
  "chat.sendPlaceholder": "اكتب رسالتك... (Enter للإرسال، Shift+Enter لسطر جديد)",
  "chat.headerPrivacyLocalTooltip": "تتم معالجة البيانات محلياً. لا تغادر جهازك أبداً.",
  "chat.headerPrivacyCloudTooltip": "تُرسل البيانات إلى خادم خارجي. تحقق من الإعدادات > إعدادات API.",
  "chat.headerTierProTooltip": "ترخيص Pro نشط — جميع الميزات مفتوحة",
  "chat.headerTierFreeTooltip": "الطبقة المجانية — 50 رسالة/يوم، ميزات محدودة",

  // Status
  "chat.statusAgentModeOn": "وضع الوكيل مفعل",
  "chat.statusAgentThinking": "الوكيل يفكر...",
  "chat.statusStopped": "متوقف",
  "chat.statusNewChat": "بدأت محادثة جديدة",
  "chat.statusThinkingOn": "التفكير مفعل",
  "chat.statusSearching": "جاري البحث في الويب: \"{query}\"...",
  "chat.statusSearchError": "خطأ في البحث",
  "chat.statusSaved": "تم الحفظ في {path}",
  "chat.statusSaveFailed": "فشل الحفظ: {error}",
  "chat.statusParsing": "جاري تحليل {name}...",
  "chat.statusPdfParsed": "تم تحليل PDF: {name}",
  "chat.statusImageReady": "الصورة جاهزة: {name}",
  "chat.statusAgentError": "خطأ في الوكيل",
  "chat.statusExported": "تم تصدير المحادثة إلى {fileName}",
  "chat.statusExportFailed": "فشل التصدير: {error}",

  // Messages — license
  "chat.licenseAgentRequired": "🔒 وضع الوكيل يتطلب ترخيص Pro. الإعدادات → مفتاح الترخيص.",
  "chat.licenseWebSearchRequired": "🔒 البحث في الويب يتطلب ترخيص Pro. الإعدادات → مفتاح الترخيص.",
  "chat.memoriesLoaded": "📝 تم تحميل {count} ملخص سابق.",

  // Messages — agent
  "chat.agentStepProgress": "⏳ الخطوة {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ يزعم النموذج الإكمال ولكن تم حفظ {written} فقط من أصل {expected} ملاحظة. {missing} مفقودة.",
  "chat.agentFallback": "⚠️ فشل وضع الوكيل — رد احتياطي:\n\n{response}",
  "chat.agentError": "خطأ في الوكيل: {message}",
  "chat.agentWarnNotSaved": "⚠️ **ملاحظة: ادعى النموذج أنه حفظ/عدّل ملاحظة، ولكن لم يتم استخدام أي أداة كتابة (update_note, create_note) أو علامة <!--save:-->. الادعاء هلوسة.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 وضع الوكيل غير متاح بعد مع Copilot AI. انتقل إلى مزود آخر (DeepSeek, OpenAI, إلخ) في الإعدادات > المزود لاستخدام وضع الوكيل.",

  // Messages — auto-save
  "chat.autoSaveResult": "📝 تم الحفظ التلقائي لـ {saved}/{total} ملاحظة:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 تم تحديث {path} (تغيير {changed} سطر)",

  // Messages — chat
  "chat.noSavedChats": "لم يتم العثور على محادثات محفوظة.",
  "chat.noMessagesToSave": "لا توجد رسائل للحفظ.",
  "chat.chatSaved": "تم حفظ المحادثة في {path}",
  "chat.chatSaveFailed": "فشل حفظ المحادثة: {error}",
  "chat.savedChatsFound": "📂 {count} محادثة محفوظة:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "يرجى تقديم استعلام بحث بعد `!search`.",
  "chat.searching": "جاري البحث: {query}",
  "chat.webSearchFailed": "فشل البحث في الويب: {error}",
  "chat.imageDroppedInfo": "تم إسقاط الصورة: {name} (فعّل الرؤية في الإعدادات لتحليل الصور)",
  "chat.fileDroppedUnsupported": "تم إسقاط الملف: {name} (تنسيق غير مدعوم)",
  "chat.fileDroppedError": "خطأ في معالجة {name}: {error}",

  // Delete button
  "chat.deleteMessageTooltip": "حذف هذه الرسالة",

  // Loading states
  "chat.statusReading": "📕 جاري قراءة الملف...",
  "chat.statusSearchingVault": "🔍 جاري البحث في المخزن...",
  "chat.statusAnalyzingImage": "🖼️ جاري تحليل الصورة...",
  "chat.statusGeneratingEmbeddings": "🧮 جاري إنشاء التضمينات...",
  "chat.statusCompacting": "📦 جاري ضغط السياق...",
  "chat.statusDeepThinking": "💭 تفكير عميق...",

  // Save/Export role labels
  "chat.saveRoleYou": "**أنت**",
  "chat.saveRoleAssistant": "**المساعد**",
  "chat.saveRoleSystem": "**النظام**",
  "chat.exportRoleUser": "👤 مستخدم",
  "chat.exportRoleAssistant": "🤖 مساعد",
  "chat.exportRoleSystem": "🔧 نظام",

  // Avatars
  "chat.roleUser": "أنت",
  "chat.roleAssistant": "المساعد",
  "chat.roleSystem": "النظام",

  // Slash commands
  "chat.slashSummarize": "لخص المحتوى التالي بإيجاز، مع إبراز النقاط الرئيسية:\n\n",
  "chat.slashTranslate": "ترجم المحتوى التالي إلى العربية، مع الحفاظ على التنسيق والمصطلحات الفنية:\n\n",
  "chat.slashExplain": "اشرح المفهوم التالي بالتفصيل، مع أمثلة وتطبيقات عملية:\n\n",
  "chat.slashToc": "أنشئ جدول محتويات منظم للمحتوى التالي:\n\n",
  "chat.slashFlashcards": "أنشئ 10 بطاقات أسئلة وأجوبة بتنسيق س: ... ج: ...:\n\n",
  "chat.slashRewrite": "أعد كتابة المحتوى التالي مع تحسين الوضوح والبنية والأسلوب:\n\n",
  "chat.slashExpand": "وسّع المحتوى التالي بإضافة المزيد من التفاصيل والسياق والأمثلة:\n\n",

  // ═══════════════════════════════════════════════════════════════
  //  COMMANDS (main.ts)
  // ═══════════════════════════════════════════════════════════════

  "commands.sendSelection": "إرسال التحديد إلى Copilot",
  "commands.indexVault": "Copilot: فهرسة المخزن للبحث الدلالي",
  "commands.clearIndex": "Copilot: مسح فهرس البحث الدلالي",
  "commands.saveChat": "Copilot: حفظ المحادثة إلى ملف",
  "commands.exportJson": "Copilot: تصدير المحادثة كـ JSON",

  // Notices — main.ts
  "notices.noTextSelected": "لم يتم تحديد نص.",
  "notices.indexingVault": "جاري فهرسة المخزن...",
  "notices.indexingProgress": "الفهرسة: {current}/{total} ملف",
  "notices.indexCorrupted": "ملف الفهرس يبدو تالفاً أو فشل تحميله. حاول مسحه وإعادة الفهرسة.",
  "notices.indexEmpty": "اكتملت فهرسة المخزن، ولكن لم تتم فهرسة أي ملفات. تحقق من المجلدات المستثناة أو حاول مرة أخرى.",
  "notices.indexEmptyVectors": "أنتجت فهرسة المخزن متجهات فارغة. نموذج التضمين الخاص بك لا يُنشئ تضمينات. قم بتحميل نموذج تضمين مخصص (nomic-embed-text, all-MiniLM-L6-v2) في LM Studio واضبطه في الإعدادات → نموذج التضمين، ثم امسح وأعد الفهرسة.",
  "notices.indexComplete": "اكتملت فهرسة المخزن! تمت فهرسة {chunks} قطعة.",
  "notices.indexFailed": "فشلت الفهرسة: {error}",
  "notices.indexCleared": "تم مسح الفهرس.",

  // Quick Ask
  "quickAsk.title": "سؤال سريع",
  "quickAsk.placeholder": "اسأل أي شيء...",
  "quickAsk.btnAsk": "اسأل",
  "quickAsk.btnThinking": "يفكر...",
  "quickAsk.error": "خطأ: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  LICENSE
  // ═══════════════════════════════════════════════════════════════

  "license.rejected": "تم رفض الترخيص: {reason}",
  "license.serverError": "خطأ في الخادم ({status}). تحقق من مفتاحك في Lemon Squeezy.",
  "license.offlineError": "تعذر الوصول إلى خادم الترخيص. تحقق من اتصالك بالإنترنت.",
  "license.demoKeyDenied": "المفتاح التجريبي يتطلب وضع التصحيح (COPILOT_DEBUG=1)",
  "license.dailyLimitReached": "⚠️ تم الوصول إلى الحد اليومي. قم بالترقية إلى Pro للحصول على رسائل غير محدودة.",

  // ═══════════════════════════════════════════════════════════════
  //  PROVIDER & SERVICES
  // ═══════════════════════════════════════════════════════════════

  "provider.unsupportedTask": "لا يوجد مزود متاح لهذه المهمة ({task}). قم بتكوين مزود في الإعدادات.",
  "provider.emptyEmbeddingResponse": "لم يتم إرجاع تضمين من المزود. تحقق من أن النموذج المحدد يدعم التضمينات.",
  "provider.zeroVectorEmbedding": "أرجع النموذج تضميناً صفري المتجه. تحقق من أن النموذج المحدد هو نموذج تضمين حقيقي (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "جميع النماذج مشغولة أو غير متاحة. حاول مرة أخرى لاحقاً.",
  "provider.anthropicNoEmbeddings": "Anthropic لا يدعم التضمينات. قم بتكوين مزود مختلف (DeepSeek, OpenAI أو LM Studio) للتضمينات في الإعدادات.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic لا يدعم التضمينات.",

  // ═══════════════════════════════════════════════════════════════
  //  CIRCUIT BREAKER
  // ═══════════════════════════════════════════════════════════════

  "circuit.rateLimited": "تم تحديد المعدل. إعادة المحاولة بعد {seconds}ث...",
  "circuit.open": "API غير متاح بعد {failures} فشل. الدائرة مفتوحة لمدة {cooldown}ث.",
  "circuit.retrying": "خطأ API (محاولة {attempt}/3). إعادة المحاولة بعد 2ث...",
  "circuit.statusOpen": "API معطل لمدة {remaining}ث",
  "circuit.statusDegraded": "{failures} فشل حديث",
  "circuit.statusClosed": "موافق",

  // ═══════════════════════════════════════════════════════════════
  //  WEB SEARCH CLIENT
  // ═══════════════════════════════════════════════════════════════

  "webSearch.urlNotConfigured": "عنوان URL لخادم البحث في الويب غير مهيأ.",
  "webSearch.serverError": "خادم البحث أرجع {status}: {text}",
  "webSearch.noResults": "لم يتم العثور على نتائج.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nمقتطف: {snippet}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT
  // ═══════════════════════════════════════════════════════════════

  "agent.maxIterationsReached": "تم الوصول إلى الحد الأقصى لاستدعاءات الأدوات.",
  "agent.fallbackResponse": "أكملت التحليل ولكن لم أتمكن من إنشاء رد نهائي.",
  "agent.fallbackTruncated": "وصلت إلى الحد الأقصى لاستدعاءات الأدوات. بناءً على ما وجدته، قد لا يحتوي المخزن على معلومات كافية. حاول أن تكون أكثر تحديداً أو أضف ملاحظات إضافية.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_note
  // ═══════════════════════════════════════════════════════════════

  "tools.readNote.description": "يقرأ المحتوى الكامل لملاحظة من المخزن. يقبل اسم الملاحظة مع أو بدون امتداد .md ومع أو بدون مسار. مثال: '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. مثالي للاطلاع على الملاحظات المحفوظة سابقاً.",
  "tools.readNote.paramPath": "اسم الملاحظة أو المسار (مع أو بدون .md، مع أو بدون مجلد). مثال: '01_02_Qualitaet_als_Erfolgsfaktor' أو '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "خطأ: لم يتم تقديم مسار.",
  "tools.readNote.error.invalidPath": "خطأ: مسار غير صالح.",
  "tools.readNote.autoFound": "[تم العثور تلقائياً: {path}]",
  "tools.readNote.foundMultiple": "تم العثور على {count} ملاحظة بالاسم \"{name}\". حدد المسار الكامل:\n{paths}",
  "tools.readNote.exactMatchNotFound": "لم يتم العثور على تطابق تام لـ \"{name}\". ملاحظات مشابهة:\n{paths}",
  "tools.readNote.error.notFound": "خطأ: الملاحظة \"{path}\" غير موجودة في المخزن.",
  "tools.readNote.error.readError": "خطأ في قراءة \"{path}\": {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_pdf
  // ═══════════════════════════════════════════════════════════════

  "tools.readPdf.description": "يستخرج النص من PDF. يتطلب pagesOnly لملفات PDF الكبيرة (>20 صفحة). استخدم pagesOnly: '116-138' لصفحات محددة. استخدم tocOnly: true لجدول المحتويات. بدون معلمات يعمل فقط على ملفات PDF التي تحتوي على ≤20 صفحة.",
  "tools.readPdf.customInstructions": "لـ read_pdf: استخدم دائماً find_files أولاً لتحديد موقع PDF. استخدم pagesOnly لطلب صفحات محددة. لا تستدعي read_pdf أبداً دون العثور على المسار الصحيح أولاً.",
  "tools.readPdf.paramPath": "المسار إلى PDF في المخزن.",
  "tools.readPdf.paramTocOnly": "يعيد فقط جدول محتويات PDF.",
  "tools.readPdf.paramPagesOnly": "نطاق صفحات محدد (مثال: '10-20' أو '5,8,12').",
  "tools.readPdf.error.noPath": "خطأ: لم يتم تقديم مسار.",
  "tools.readPdf.multiplePdfs": "تتطابق ملفات PDF متعددة مع \"{path}\":\n{paths}\nحدد المسار الدقيق.",
  "tools.readPdf.error.notFound": "خطأ: \"{path}\" غير موجود.",
  "tools.readPdf.tooLarge": "يحتوي PDF على {pages} صفحة. استخدم pagesOnly لقراءة صفحات محددة (مثال: pagesOnly: \"116-138\") أو tocOnly: true لجدول المحتويات.",
  "tools.readPdf.noText": "لم يتم العثور على نص.",
  "tools.readPdf.tocHeader": "[جدول محتويات PDF — إجمالي {pages} صفحة]",
  "tools.readPdf.pageHeader": "[الصفحات {spec} من {total}]",
  "tools.readPdf.pageLabel": "[الصفحة {num}]",
  "tools.readPdf.totalPages": "[إجمالي {total} صفحة]",
  "tools.readPdf.tocSeparator": "═══ جدول المحتويات / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ المحتوى ═══",
  "tools.readPdf.truncationNotice": "[ملاحظة: PDF يحتوي على {pages} صفحة. يتم عرض أول 500 فقط.]",
  "tools.readPdf.error.generic": "خطأ: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: create_note
  // ═══════════════════════════════════════════════════════════════

  "tools.createNote.description": "ينشئ ملاحظة جديدة في المخزن بالعنوان والمحتوى المحددين (بتنسيق Markdown).",
  "tools.createNote.paramTitle": "عنوان الملاحظة (بدون امتداد).",
  "tools.createNote.paramContent": "محتوى الملاحظة بتنسيق Markdown.",
  "tools.createNote.error.noTitle": "خطأ: لم يتم تقديم عنوان.",
  "tools.createNote.error.noContent": "خطأ: لم يتم تقديم محتوى.",
  "tools.createNote.error.alreadyExists": "خطأ: توجد بالفعل ملاحظة بالاسم \"{name}\".",
  "tools.createNote.success": "تم إنشاء الملاحظة بنجاح: \"{name}\" ({length} حرف).",
  "tools.createNote.error.createError": "خطأ في إنشاء الملاحظة: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: update_note
  // ═══════════════════════════════════════════════════════════════

  "tools.updateNote.description": "يكتب فوق محتوى ملاحظة موجودة في المخزن. استخدم المسار الكامل. إذا كانت الملاحظة غير موجودة، يُرجع خطأ (استخدم create_note للملاحظات الجديدة).",
  "tools.updateNote.paramPath": "المسار الكامل للملاحظة المراد تعديلها (مثال: '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "المحتوى الكامل الجديد للملاحظة بتنسيق Markdown.",
  "tools.updateNote.error.noPath": "خطأ: لم يتم تقديم مسار.",
  "tools.updateNote.error.noContent": "خطأ: لم يتم تقديم محتوى.",
  "tools.updateNote.error.notFound": "خطأ: الملاحظة \"{path}\" غير موجودة. استخدم create_note لإنشاء واحدة جديدة.",
  "tools.updateNote.error.mismatch": "خطأ: تم الإبلاغ عن تحديث الملاحظة \"{path}\" لكن المحتوى غير متطابق (متوقع {expected} حرف، تم قراءة {actual} حرف).",
  "tools.updateNote.success": "تم تحديث الملاحظة \"{path}\" بنجاح ({length} حرف).",
  "tools.updateNote.error.updateError": "خطأ في تحديث \"{path}\": {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: find_files
  // ═══════════════════════════════════════════════════════════════

  "tools.findFiles.description": "يبحث عن ملفات في المخزن حسب نمط الاسم. يُرجع مسارات الملفات المتطابقة. مفيد للعثور على الصور أو PDF أو الملاحظات عندما لا تعرف المسار الدقيق.",
  "tools.findFiles.paramNameQuery": "جزء من اسم الملف للبحث عنه (مثال: 'MapaPolitico', 'diagram', 'photo.png'). غير حساس لحالة الأحرف.",
  "tools.findFiles.paramExtension": "تصفية حسب الامتداد (مثال: 'png', 'pdf', 'md'). اختياري.",
  "tools.findFiles.error.emptyQuery": "خطأ: مصطلح بحث فارغ.",
  "tools.findFiles.noResults": "لم يتم العثور على ملفات تطابق \"{query}\"{extension}.",
  "tools.findFiles.results": "{results}\n... و{more} إضافي.",
  "tools.findFiles.error.searchError": "خطأ في البحث عن الملفات: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: list_notes
  // ═══════════════════════════════════════════════════════════════

  "tools.listNotes.description": "يسرد الملاحظات في مجلد المخزن (أو الجذر إذا لم يتم تحديد مجلد).",
  "tools.listNotes.paramFolder": "المجلد المراد عرضه (اختياري). إذا لم يتم تحديده، يعرض الجذر.",
  "tools.listNotes.noNotes": "لم يتم العثور على ملاحظات.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_fulltext
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultFulltext.description": "يبحث عن نص دقيق عبر جميع ملاحظات المخزن (أسرع من البحث الدلالي).",
  "tools.searchVaultFulltext.paramQuery": "النص المراد البحث عنه.",
  "tools.searchVaultFulltext.error.emptyQuery": "خطأ: استعلام فارغ.",
  "tools.searchVaultFulltext.notFound": "لم يتم العثور على \"{query}\" في أي ملاحظة.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_semantic
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultSemantic.description": "يبحث في ملاحظات المخزن باستخدام البحث الدلالي (RAG). يُرجع الأجزاء ذات الصلة بناءً على الاستعلام.",
  "tools.searchVaultSemantic.paramQuery": "استعلام البحث.",
  "tools.searchVaultSemantic.paramStartDate": "فلتر اختياري: تاريخ بداية ISO.",
  "tools.searchVaultSemantic.paramEndDate": "فلتر اختياري: تاريخ نهاية ISO.",
  "tools.searchVaultSemantic.error.emptyQuery": "خطأ: استعلام فارغ.",
  "tools.searchVaultSemantic.error.notEnabled": "خطأ: البحث الدلالي غير مفعل. فعّل 'enableSemanticSearch' في الإعدادات وقم بفهرسة المخزن.",
  "tools.searchVaultSemantic.noResults": "لم يتم العثور على أجزاء ذات صلة بالاستعلام.",
  "tools.searchVaultSemantic.fragment": "[الجزء {index}] ({path}, الصلة: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "خطأ في البحث الدلالي: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_by_timeframe
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultByTimeframe.description": "يبحث عن ملاحظات المخزن المعدلة بين تاريخين بتنسيق ISO 8601 (YYYY-MM-DDTHH:mm:ss). مفيد لمعرفة ما فعله المستخدم في فترة زمنية.",
  "tools.searchVaultByTimeframe.paramStartDate": "تاريخ البداية بتنسيق ISO 8601، مثال: 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "تاريخ النهاية بتنسيق ISO 8601، مثال: 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "خطأ: تواريخ غير صالحة. استخدم تنسيق ISO 8601 (YYYY-MM-DDTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "لم يتم العثور على ملاحظات معدلة بين {start} و{end}.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nآخر تعديل: {mtime}\nالمحتوى: {snippet}...",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_web
  // ═══════════════════════════════════════════════════════════════

  "tools.searchWeb.description": "يجري بحثاً في الويب باستخدام متصفح آلي ويعيد النتائج الأكثر صلة (العنوان، URL، المقتطف).",
  "tools.searchWeb.paramQuery": "استعلام بحث الويب.",
  "tools.searchWeb.error.emptyQuery": "خطأ: استعلام فارغ.",
  "tools.searchWeb.noResults": "لم يتم العثور على نتائج لـ \"{query}\".",
  "tools.searchWeb.error.generic": "خطأ في البحث في الويب: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: analyze_image
  // ═══════════════════════════════════════════════════════════════

  "tools.analyzeImage.description": "يحلل صورة من المخزن ويقدم وصفاً مفصلاً. استخدم مسار الصورة (مثال: 'folder/diagram.png'). يدعم png, jpg, jpeg, gif, webp.",
  "tools.analyzeImage.paramImagePath": "المسار إلى ملف الصورة داخل المخزن.",
  "tools.analyzeImage.error.noPath": "خطأ: لم يتم تقديم مسار الصورة.",
  "tools.analyzeImage.error.configError": "خطأ: {error}",
  "tools.analyzeImage.noResponse": "لم يتم تلقي رد من نموذج الرؤية.",
  "tools.analyzeImage.error.apiError": "خطأ API: {message}",
  "tools.analyzeImage.error.connectionRefused": "خطأ: تعذر الاتصال بخادم الرؤية. تأكد من تشغيل نموذج الرؤية المحلي الخاصك بنموذج متوافق.",
  "tools.analyzeImage.error.generic": "خطأ في تحليل الصورة: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_youtube_transcript
  // ═══════════════════════════════════════════════════════════════

  "tools.extractYoutubeTranscript.description": "يحصل على النص (الترجمة) لفيديو YouTube من عنوان URL الخاص به.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "عنوان URL لفيديو YouTube (مثال: https://www.youtube.com/watch?v=... أو https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "خطأ: لم يتم تقديم عنوان URL للفيديو.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "خطأ: تعذر استخراج معرف الفيديو من URL: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "لم يتم العثور على نص لهذا الفيديو (قد لا تكون الترجمة متاحة).",
  "tools.extractYoutubeTranscript.header": "نص الفيديو {videoId}:",
  "tools.extractYoutubeTranscript.error.generic": "خطأ في الحصول على النص: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: render_pdf_pages
  // ═══════════════════════════════════════════════════════════════

  "tools.renderPdfPages.description": "يعرض صفحات PDF محددة كصور PNG ويحفظها في المخزن. يُرجع المسارات الدقيقة (مثال: 'Resources/PDF_images/PDF_page_40.png'). مهم: استخدم المسارات الدقيقة التي يُرجعها هذا الأداة لـ ![[التضمين]]. لا تخترع مسارات.",
  "tools.renderPdfPages.paramPath": "المسار إلى PDF في المخزن.",
  "tools.renderPdfPages.paramPages": "الصفحات المراد عرضها (مثال: '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "المجلد لحفظ الصور (اختياري، الافتراضي: بجانب PDF).",
  "tools.renderPdfPages.paramScale": "مقياس العرض (1.0 = 72 DPI، 2.0 = 144 DPI). الافتراضي: 2.0.",
  "tools.renderPdfPages.error.noPath": "خطأ: لم يتم تقديم مسار PDF.",
  "tools.renderPdfPages.error.noPages": "خطأ: لم يتم تحديد صفحات.",
  "tools.renderPdfPages.multiplePdfs": "تتطابق ملفات PDF متعددة مع \"{path}\". حدد المسار الدقيق.",
  "tools.renderPdfPages.error.notFound": "خطأ: \"{path}\" غير موجود.",
  "tools.renderPdfPages.error.invalidRange": "خطأ: نطاق صفحات غير صالح: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "خطأ: تعذر إنشاء مجلد الإخراج \"{folder}\": {error}",
  "tools.renderPdfPages.error.noValidPages": "خطأ: لا توجد صفحات صالحة. PDF يحتوي على {pages} صفحة.",
  "tools.renderPdfPages.error.canvas": "خطأ: تعذر إنشاء سياق canvas ثنائي الأبعاد للصفحة {page}.",
  "tools.renderPdfPages.error.renderError": "خطأ في عرض الصفحة {page}: {error}",
  "tools.renderPdfPages.result": "تم عرض {rendered}/{total} صفحة:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "خطأ في عرض صفحات PDF: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_pdf_images
  // ═══════════════════════════════════════════════════════════════

  "tools.extractPdfImages.description": "يستخرج صور JPG/PNG المضمنة من صفحات PDF. يتطلب 'unpdf' (npm install unpdf). إذا لم تكن هناك صور نقطية (رسومات متجهة/مخططات)، يعرض الصفحة بأكملها كـ PNG. استخدم render_pdf_pages إذا كنت تحتاج فقط إلى صفحات كاملة.",
  "tools.extractPdfImages.paramPath": "المسار إلى PDF في المخزن.",
  "tools.extractPdfImages.paramPages": "الصفحات (مثال: '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "مجلد الإخراج (اختياري).",
  "tools.extractPdfImages.error.pathAndPages": "خطأ: المسار والصفحات مطلوبان.",
  "tools.extractPdfImages.multiplePdfs": "تتطابق ملفات PDF متعددة. حدد المسار الدقيق.",
  "tools.extractPdfImages.error.notFound": "خطأ: \"{path}\" غير موجود.",
  "tools.extractPdfImages.error.invalidRange": "خطأ: نطاق غير صالح: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "خطأ: صفحات خارج النطاق (إجمالي {pages}).",
  "tools.extractPdfImages.result": "تم استخراج {count} صورة من {pages} صفحة:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (صفحة كاملة)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ الصفحة {page}: فشل العرض",
  "tools.extractPdfImages.error.canvas": "❌ الصفحة {page}: تعذر إنشاء canvas",
  "tools.extractPdfImages.error.generic": "خطأ: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_vault_stats
  // ═══════════════════════════════════════════════════════════════

  "tools.getVaultStats.description": "يُرجع إحصائيات المخزن: عدد الملاحظات، الحجم الإجمالي، المجلدات.",
  "tools.getVaultStats.stats": "الملاحظات: {notes}\nالحجم الإجمالي: ~{size}\nالمجلدات: {folders}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_active_file
  // ═══════════════════════════════════════════════════════════════

  "tools.getActiveFile.description": "يُرجع محتوى الملف المفتوح حالياً في المحرر.",
  "tools.getActiveFile.noFileOpen": "لا يوجد ملف مفتوح حالياً.",
  "tools.getActiveFile.error": "خطأ: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_frontmatter
  // ═══════════════════════════════════════════════════════════════

  "tools.getFrontmatter.description": "يستخرج frontmatter (بيانات YAML الوصفية) من ملاحظة.",
  "tools.getFrontmatter.paramPath": "المسار إلى الملاحظة.",
  "tools.getFrontmatter.error.notFound": "خطأ: \"{path}\" غير موجود.",
  "tools.getFrontmatter.noFrontmatter": "لا يوجد frontmatter.",
  "tools.getFrontmatter.error.generic": "خطأ: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT — ToolRegistry
  // ═══════════════════════════════════════════════════════════════

  "tools.registry.errorExecute": "خطأ في تنفيذ الأداة \"{name}\": {error}",
  "tools.registry.errorNotFound": "الأداة \"{name}\" غير مسجلة",

  // ═══════════════════════════════════════════════════════════════
  //  ERROR — Generic
  // ═══════════════════════════════════════════════════════════════

  "errors.unknown": "خطأ غير معروف",
  "errors.fetchFailed": "فشل الجلب",

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

  "labels.unknown": "خطأ غير معروف",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ غير مدعوم)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "التضمينات",
  "labels.vision": "الرؤية",
  "labels.lmStudio": "LM Studio",
};
