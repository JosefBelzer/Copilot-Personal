export const tr: Record<string, string> = {
  "settings.title": "Copilot Personal - Ayarlar",
  "settings.language": "Dil / Language",
  "settings.apiKey": "API Anahtarı",
  "settings.licenseKey": "Lisans Anahtarı",
  "settings.licenseKeyDesc": "Lemon Squeezy'den Pro lisans anahtarı. Free mod için boş bırakın.",
  "settings.provider": "Sağlayıcı",
  "settings.chatModel": "Sohbet Modeli",
  "settings.embeddingModel": "Embedding Modeli",
  "settings.visionModel": "Görme Modeli",
  "settings.temperature": "Sıcaklık",
  "settings.maxTokens": "Maks. Token",
  "settings.streamResponses": "Akış yanıtları",
  "settings.semanticSearch": "Anlamsal aramayı etkinleştir",
  "settings.webSearch": "Web aramasını etkinleştir",
  "settings.vision": "Görmeyi etkinleştir",
  "settings.agentMode": "Ajan modunu etkinleştir",
  "settings.budgetTitle": "Bütçe AI (Pro)",
  "settings.budgetEnable": "Copilot Bütçe AI'yı kullan",
  "chat.btnNew": "Yeni",
  "chat.btnSave": "Kaydet",
  "chat.btnHistory": "Geçmiş",
  "chat.btnSend": "Gönder",
  "chat.btnStop": "Durdur",
  "chat.btnAgent": "Ajan",
  "chat.btnThink": "Düşün",
  "chat.headerPrivacyLocal": "🔒 Yerel",
  "chat.headerPrivacyCloud": "☁️ Bulut",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "Hazır",
  "chat.statusThinking": "Düşünüyor...",
  "chat.statusError": "Hata",
  "chat.greeting": "Merhaba! Ben sizin kişisel AI yardımcınızım.",
  "chat.rateLimitReached": "⚠️ Günlük limit aşıldı ({used}/{limit}). Pro'ya yükseltin.",
  "chat.crashRecovery": "📝 Önceki oturum geri yüklendi.",
  "commands.openChat": "Copilot sohbetini aç",
  "commands.newChat": "Copilot: Yeni sohbet",
  "commands.quickAsk": "Copilot: Hızlı soru",
  "commands.exportMd": "Copilot: Markdown olarak dışa aktar",
  "license.proActivated": "✅ Pro lisansı başarıyla etkinleştirildi.",
  "license.freeActivated": "🆓 Free modu etkinleştirildi.",
  // ═══════════════════════════════════════════════════════════════
  //  SETTINGS TAB
  // ═══════════════════════════════════════════════════════════════

  "settings.languageDesc": "Arayüz dilini seçin. Değişiklikler hemen uygulanır.",

  // API Configuration
  "settings.apiConfiguration": "API Yapılandırması",
  "settings.apiKeyDesc": "{provider} için API anahtarınız (data.json içinde saklanır — ŞİFRELENMİŞ DEĞİLDİR. Git'e göndermeyin.)",
  "settings.licenseClearTooltip": "Lisansı temizle (Free'e dön)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "API URL'si",
  "settings.apiUrlDesc": "API uç noktası için temel URL",
  "settings.providerDesc": "LLM sağlayıcısını seçin",
  "settings.detectModels": "Modelleri algıla",
  "settings.detectModelsDesc": "Yüklenen modelleri bulmak için LM Studio'nun /v1/models uç noktasını sorgula",
  "settings.lmStatusQuerying": "LM Studio sorgulanıyor...",
  "settings.lmStatusNoModels": "Model bulunamadı. Önce LM Studio'da bir model yükleyin.",
  "settings.lmStatusFound": "{count} model bulundu: {models}",
  "settings.lmStatusError": "Hata: {error}. LM Studio'nun çalıştığından emin olun.",
  "settings.fallbackModelName": "Model {cap} (yedek)",

  // Provider dropdown names
  "provider.name.auto": "Otomatik algıla (URL'den)",
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
  "settings.budgetEnableDesc": "Mistral Nemo üzerinden ücretsiz, yönetilen API. API anahtarı gerekmez. Günlük kullanım limitleri içerir.",
  "settings.budgetProRequired": "🔒 Copilot AI bir Pro lisansı gerektirir. Bütçe API'sini kullanmak için Pro'ya yükseltin.",

  // Model Configuration
  "settings.modelConfig": "Model Yapılandırması",
  "settings.temperatureDesc": "Rastgeleliği kontrol eder (0.0 = deterministik, 2.0 = çok rastgele)",
  "settings.maxTokensDesc": "Yanıttaki maksimum token sayısı",
  "settings.topP": "Top P",
  "settings.topPDesc": "Nükleus örnekleme (0.0-1.0). Düşük = daha odaklı",
  "settings.topK": "Top K",
  "settings.topKDesc": "Token seçimini en iyi K ile sınırlar (0 = devre dışı)",
  "settings.presencePenalty": "Varlık Cezası",
  "settings.presencePenaltyDesc": "Tekrarlanan tokenları cezalandırır (0-2). Yüksek = daha az tekrar",
  "settings.enableThinking": "Düşünme modunu etkinleştir",
  "settings.enableThinkingDesc": "DeepSeek V4 düşünme/akıl yürütme kullan (temperature/top_p/presence_penalty ile uyumlu değil)",
  "settings.reasoningEffort": "Akıl yürütme çabası",
  "settings.reasoningEffortDesc": "Yalnızca düşünme modu etkinken geçerlidir (DeepSeek V4)",
  "settings.streamResponsesDesc": "Yanıtı token token göster",
  "settings.contextTurns": "Bağlam turları",
  "settings.contextTurnsDesc": "Bağlama dahil edilecek önceki tur sayısı",
  "settings.semanticSearchDesc": "Sohbette anlamsal arama için not defterinizi dizine ekleyin",
  "settings.semanticSearchProLocked": "🔒 Anlamsal arama bir Pro lisansı gerektirir",
  "settings.maxSourceChunks": "Maks. kaynak parçası",
  "settings.maxSourceChunksDesc": "Sorgu başına alınacak parça sayısı",
  "settings.chunkSize": "Parça boyutu (token)",
  "settings.chunkSizeDesc": "Parça başına yaklaşık token sayısı",

  // Web Search
  "settings.webSearchDesc": "browser-use mikroservisi aracılığıyla web aramasına izin ver",
  "settings.webSearchProLocked": "🔒 Web araması bir Pro lisansı gerektirir",
  "settings.webSearchServerUrl": "Web arama sunucu URL'si",
  "settings.webSearchServerUrlDesc": "Python browser-use mikroservisinin URL'si",
  "settings.webSearchMaxResults": "Maks. arama sonucu",
  "settings.webSearchMaxResultsDesc": "Kaç web sonucu döndürülecek",
  "settings.webSearchToken": "Web arama token'ı",
  "settings.webSearchTokenDesc": "Python arama sunucusuyla paylaşılan kimlik doğrulama token'ı (sunucunun COPILOT_WEB_TOKEN'iyle eşleşmelidir)",
  "settings.webSearchTokenPlaceholder": "güvenli-tokenınız",

  // Vision
  "settings.visionDesc": "Görüntüler için görme modeli kullan",
  "settings.visionNotSupported": "Bu sağlayıcı için kullanılamaz",
  "settings.visionProLocked": "🔒 Görme bir Pro lisansı gerektirir",
  "settings.imageDrop": "Görüntü bırakmayı etkinleştir",
  "settings.imageDropDesc": "Görüntülerin sürükleyip sohbete bırakılmasına izin ver",

  // Chat History
  "settings.saveChatHistory": "Sohbet geçmişini kaydet",
  "settings.saveChatHistoryDesc": "Konuşmaları not defterinde Markdown dosyaları olarak kaydet",
  "settings.chatHistoryFolder": "Sohbet geçmişi klasörü",
  "settings.chatHistoryFolderDesc": "Sohbet geçmişi dosyalarını saklama klasörü",

  // Memory
  "settings.enableMemory": "Hafızayı etkinleştir",
  "settings.enableMemoryDesc": "Sohbet oturumları arasında önemli bilgileri hatırla",
  "settings.memoryFolder": "Hafıza klasörü",
  "settings.memoryFolderDesc": "Hafıza dosyalarını saklama klasörü",
  "settings.maxMemories": "Maks. hafıza",
  "settings.maxMemoriesDesc": "Yeni sohbette yüklenecek son hafıza sayısı",

  // Agent Mode
  "settings.agentModeDesc": "AI'ın araçları kullanmasına ve birden çok eylemi otonom olarak gerçekleştirmesine izin ver",
  "settings.agentModeToolCallingNA": "Araç çağrısı bu sağlayıcı için kullanılamaz",
  "settings.agentModeProLocked": "🔒 Ajan modu bir Pro lisansı gerektirir",
  "settings.maxAgentIterations": "Maks. ajan yinelemesi",
  "settings.maxAgentIterationsDesc": "Ajan çalıştırması başına maksimum araç çağrısı sayısı",

  // LM Studio detect
  "settings.lmDetectTitle": "LM Studio - Modelleri Algıla",
  "settings.lmStatusDefault": "LM Studio'dan mevcut modelleri almak için 'Algıla'ya tıklayın.",
  "settings.lmDetectButton": "Algıla",
  "settings.lmStatusFoundNotice": "LM Studio'da {count} model bulundu. İlk model ({model}) varsayılan olarak ayarlandı.",

  // Model names
  "settings.chatModelDesc": "Sohbet tamamlamaları için model",
  "settings.embeddingModelDesc": "Embedding'ler için model{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ Bu sağlayıcı tarafından desteklenmiyor)",
  "settings.visionModelDesc": "Görme/görüntü görevleri için model",

  // Section headers
  "settings.chatOptions": "Sohbet Seçenekleri",
  "settings.chatHistory": "Sohbet Geçmişi",
  "settings.memory": "Hafıza",
  "settings.lmVisionTitle": "LM Studio (Görüntü Analizi)",
  "settings.sectionSemanticSearch": "Anlamsal Arama (RAG)",
  "settings.sectionWebSearch": "Web Arama (browser-use)",
  "settings.sectionVision": "Görme / Görüntüler",
  "settings.sectionAgentMode": "Ajan Modu",

  // Reasoning
  "settings.reasoningHigh": "Yüksek",
  "settings.reasoningMax": "Maksimum",

  // Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 Çoklu Sağlayıcı Yedekleme",
  "settings.fallbackFor": "{cap} için yedek",
  "settings.fallbackSelect": "{cap} DESTEKLEYEN bir sağlayıcı seçin",
  "settings.fallbackProLocked": "🔒 Pro lisansı gerektirir",
  "settings.fallbackModelDesc": "Yedek sağlayıcıda {cap} için model adı",
  "settings.multiProviderProNotice": "Çoklu sağlayıcı yedekleme bir Pro lisansı gerektirir. Pro ile, birincil sağlayıcınızın eksik olduğu yetenekler için ikinci bir sağlayıcı kullanabilirsiniz.",
  "settings.providerNoSupport": "{provider} {cap} özelliğini desteklemiyor",
  "settings.providerSelectSupporting": "{cap} DESTEKLEYEN bir sağlayıcı seçin",

  // ═══════════════════════════════════════════════════════════════
  //  CHAT VIEW
  // ═══════════════════════════════════════════════════════════════

  // Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "Yeni bir sohbet başlat",
  "chat.saveChatTooltip": "Sohbeti dosyaya kaydet",
  "chat.browseHistoryTooltip": "Kayıtlı sohbetlere göz at",
  "chat.agentToggleTooltip": "Ajan modunu değiştir (otonom araç kullanımı)",
  "chat.thinkToggleTooltip": "Düşünme modunu etkinleştir (model yanıt vermeden önce akıl yürütür)",
  "chat.sendPlaceholder": "Mesajınızı yazın... (Enter göndermek için, Shift+Enter yeni satır için)",
  "chat.headerPrivacyLocalTooltip": "Veriler yerel olarak işlenir. Cihazınızdan asla ayrılmaz.",
  "chat.headerPrivacyCloudTooltip": "Veriler harici sunucuya gönderilir. Ayarlar > API Yapılandırması'nı kontrol edin.",
  "chat.headerTierProTooltip": "Pro lisansı aktif — tüm özelliklerin kilidi açık",
  "chat.headerTierFreeTooltip": "Free katmanı — günde 50 mesaj, sınırlı özellikler",

  // Status
  "chat.statusAgentModeOn": "Ajan modu AÇIK",
  "chat.statusAgentThinking": "Ajan düşünüyor...",
  "chat.statusStopped": "Durduruldu",
  "chat.statusNewChat": "Yeni sohbet başlatıldı",
  "chat.statusThinkingOn": "Düşünme AÇIK",
  "chat.statusSearching": "Web'de aranıyor: \"{query}\"...",
  "chat.statusSearchError": "Arama hatası",
  "chat.statusSaved": "{path} konumuna kaydedildi",
  "chat.statusSaveFailed": "Kaydetme başarısız: {error}",
  "chat.statusParsing": "{name} ayrıştırılıyor...",
  "chat.statusPdfParsed": "PDF ayrıştırıldı: {name}",
  "chat.statusImageReady": "Görsel hazır: {name}",
  "chat.statusAgentError": "Ajan hatası",
  "chat.statusExported": "Sohbet {fileName} dosyasına aktarıldı",
  "chat.statusExportFailed": "Aktarma başarısız: {error}",

  // Messages — license
  "chat.licenseAgentRequired": "🔒 Ajan modu bir Pro lisansı gerektirir. Ayarlar → Lisans Anahtarı.",
  "chat.licenseWebSearchRequired": "🔒 Web araması bir Pro lisansı gerektirir. Ayarlar → Lisans Anahtarı.",
  "chat.memoriesLoaded": "📝 {count} önceki özet yüklendi.",

  // Messages — agent
  "chat.agentStepProgress": "⏳ Adım {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ Model tamamlandığını bildiriyor ancak {expected} nottan yalnızca {written} tanesi kaydedildi. {missing} eksik.",
  "chat.agentFallback": "⚠️ Ajan modu başarısız — yedek yanıt:\n\n{response}",
  "chat.agentError": "Ajan hatası: {message}",
  "chat.agentWarnNotSaved": "⚠️ **NOT: Model bir notu kaydettiğini/değiştirdiğini iddia etti ancak hiçbir yazma aracı (update_note, create_note) veya <!--save:--> işareti kullanılmadı. İddia bir halüsinasyondur.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 Ajan modu henüz Copilot AI ile kullanılamaz. Ajan Modunu kullanmak için Ayarlar > Sağlayıcı'da farklı bir sağlayıcıya (DeepSeek, OpenAI vb.) geçin.",

  // Messages — auto-save
  "chat.autoSaveResult": "📝 {saved}/{total} not otomatik kaydedildi:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 {path} güncellendi ({changed} satır değişti)",

  // Messages — chat
  "chat.noSavedChats": "Kayıtlı sohbet bulunamadı.",
  "chat.noMessagesToSave": "Kaydedilecek mesaj yok.",
  "chat.chatSaved": "Sohbet {path} konumuna kaydedildi",
  "chat.chatSaveFailed": "Sohbet kaydedilemedi: {error}",
  "chat.savedChatsFound": "📂 {count} kayıtlı sohbet:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "Lütfen `!search` sonrasında bir arama sorgusu belirtin.",
  "chat.searching": "Aranıyor: {query}",
  "chat.webSearchFailed": "Web araması başarısız: {error}",
  "chat.imageDroppedInfo": "Görsel bırakıldı: {name} (görüntüleri analiz etmek için ayarlardan görmeyi etkinleştirin)",
  "chat.fileDroppedUnsupported": "Dosya bırakıldı: {name} (desteklenmeyen format)",
  "chat.fileDroppedError": "{name} işlenirken hata: {error}",

  // Delete button
  "chat.deleteMessageTooltip": "Bu mesajı sil",

  // Loading states
  "chat.statusReading": "📕 Dosya okunuyor...",
  "chat.statusSearchingVault": "🔍 Not defteri taranıyor...",
  "chat.statusAnalyzingImage": "🖼️ Görsel analiz ediliyor...",
  "chat.statusGeneratingEmbeddings": "🧮 Embedding'ler oluşturuluyor...",
  "chat.statusCompacting": "📦 Bağlam sıkıştırılıyor...",
  "chat.statusDeepThinking": "💭 Derin düşünme...",

  // Save/Export role labels
  "chat.saveRoleYou": "**Siz**",
  "chat.saveRoleAssistant": "**Asistan**",
  "chat.saveRoleSystem": "**Sistem**",
  "chat.exportRoleUser": "👤 Kullanıcı",
  "chat.exportRoleAssistant": "🤖 Asistan",
  "chat.exportRoleSystem": "🔧 Sistem",

  // Avatars
  "chat.roleUser": "Siz",
  "chat.roleAssistant": "Asistan",
  "chat.roleSystem": "Sistem",

  // Slash commands
  "chat.slashSummarize": "Aşağıdaki içeriği kısaca özetleyin, anahtar noktaları vurgulayın:\n\n",
  "chat.slashTranslate": "Aşağıdaki içeriği İngilizceye çevirin, biçimlendirmeyi ve teknik terimleri koruyun:\n\n",
  "chat.slashExplain": "Aşağıdaki kavramı ayrıntılı olarak, örnekler ve pratik uygulamalarla açıklayın:\n\n",
  "chat.slashToc": "Aşağıdaki içerik için yapılandırılmış bir içindekiler tablosu oluşturun:\n\n",
  "chat.slashFlashcards": "S: ... C: ... formatında 10 soru-cevap bilgi kartı oluşturun:\n\n",
  "chat.slashRewrite": "Aşağıdaki içeriği netlik, yapı ve stil açısından iyileştirerek yeniden yazın:\n\n",
  "chat.slashExpand": "Aşağıdaki içeriği daha fazla ayrıntı, bağlam ve örnek ekleyerek genişletin:\n\n",

  // ═══════════════════════════════════════════════════════════════
  //  COMMANDS (main.ts)
  // ═══════════════════════════════════════════════════════════════

  "commands.sendSelection": "Seçimi Copilot'a gönder",
  "commands.indexVault": "Copilot: Anlamsal arama için not defterini dizine ekle",
  "commands.clearIndex": "Copilot: Anlamsal arama dizinini temizle",
  "commands.saveChat": "Copilot: Sohbeti dosyaya kaydet",
  "commands.exportJson": "Copilot: Sohbeti JSON olarak dışa aktar",

  // Notices — main.ts
  "notices.noTextSelected": "Hiçbir metin seçilmedi.",
  "notices.indexingVault": "Not defteri dizine ekleniyor...",
  "notices.indexingProgress": "Dizine ekleme: {current}/{total} dosya",
  "notices.indexCorrupted": "Dizin dosyası bozuk veya yüklenemedi. Temizlemeyi ve yeniden dizine eklemeyi deneyin.",
  "notices.indexEmpty": "Not defteri dizine ekleme tamamlandı ancak hiçbir dosya dizine eklenmedi. Hariç tutulan klasörleri kontrol edin veya tekrar deneyin.",
  "notices.indexEmptyVectors": "Not defteri dizine ekleme BOŞ vektörler üretti. Embedding modeliniz embedding üretmiyor. LM Studio'ya özel bir embedding modeli (nomic-embed-text, all-MiniLM-L6-v2) yükleyin ve Ayarlar > Embedding Modeli'nde ayarlayın, ardından temizleyip yeniden dizine ekleyin.",
  "notices.indexComplete": "Not defteri dizine ekleme tamamlandı! {chunks} parça dizine eklendi.",
  "notices.indexFailed": "Dizine ekleme başarısız: {error}",
  "notices.indexCleared": "Dizin temizlendi.",

  // Quick Ask
  "quickAsk.title": "Hızlı Soru",
  "quickAsk.placeholder": "Bir şey sorun...",
  "quickAsk.btnAsk": "Sor",
  "quickAsk.btnThinking": "Düşünüyor...",
  "quickAsk.error": "Hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  LICENSE
  // ═══════════════════════════════════════════════════════════════

  "license.rejected": "Lisans reddedildi: {reason}",
  "license.serverError": "Sunucu hatası ({status}). Anahtarınızı Lemon Squeezy'de doğrulayın.",
  "license.offlineError": "Lisans sunucusuna ulaşılamadı. İnternet bağlantınızı kontrol edin.",
  "license.demoKeyDenied": "Demo anahtarı hata ayıklama modu gerektirir (COPILOT_DEBUG=1)",
  "license.dailyLimitReached": "⚠️ Günlük limite ulaşıldı. Sınırsız mesajlar için Pro'ya yükseltin.",

  // ═══════════════════════════════════════════════════════════════
  //  PROVIDER & SERVICES
  // ═══════════════════════════════════════════════════════════════

  "provider.unsupportedTask": "Bu görev için kullanılabilir sağlayıcı yok ({task}). Ayarlar'da bir sağlayıcı yapılandırın.",
  "provider.emptyEmbeddingResponse": "Sağlayıcıdan embedding döndürülmedi. Seçili modelin embedding'leri desteklediğinden emin olun.",
  "provider.zeroVectorEmbedding": "Model sıfır vektörlü embedding döndürdü. Seçili modelin gerçek bir embedding modeli olduğundan emin olun (text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text).",
  "provider.unavailableRetry": "Tüm modeller meşgul veya kullanılamıyor. Daha sonra tekrar deneyin.",
  "provider.anthropicNoEmbeddings": "Anthropic embedding'leri desteklemez. Ayarlar'da embedding'ler için farklı bir sağlayıcı (DeepSeek, OpenAI veya LM Studio) yapılandırın.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic embedding'leri desteklemez.",

  // ═══════════════════════════════════════════════════════════════
  //  CIRCUIT BREAKER
  // ═══════════════════════════════════════════════════════════════

  "circuit.rateLimited": "Hız sınırlandı. {seconds}s içinde tekrar deneniyor...",
  "circuit.open": "{failures} başarısızlıktan sonra API kullanılamıyor. Devre {cooldown}s süreyle açık.",
  "circuit.retrying": "API hatası (deneme {attempt}/3). 2sn içinde tekrar deneniyor...",
  "circuit.statusOpen": "API {remaining}s süreyle devre dışı",
  "circuit.statusDegraded": "{failures} son başarısızlık",
  "circuit.statusClosed": "Tamam",

  // ═══════════════════════════════════════════════════════════════
  //  WEB SEARCH CLIENT
  // ═══════════════════════════════════════════════════════════════

  "webSearch.urlNotConfigured": "Web arama sunucu URL'si yapılandırılmamış.",
  "webSearch.serverError": "Arama sunucusu {status} döndürdü: {text}",
  "webSearch.noResults": "Sonuç bulunamadı.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\nParçacık: {snippet}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT
  // ═══════════════════════════════════════════════════════════════

  "agent.maxIterationsReached": "Maksimum araç çağrısı sayısına ulaşıldı.",
  "agent.fallbackResponse": "Analizi tamamladım ancak nihai bir yanıt oluşturamadım.",
  "agent.fallbackTruncated": "Maksimum araç çağrısı sayısına ulaştım. Bulduklarıma göre, not defterinde yeterli bilgi olmayabilir. Daha spesifik olmayı deneyin veya ek notlar dizine ekleyin.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_note
  // ═══════════════════════════════════════════════════════════════

  "tools.readNote.description": "Not defterinden bir notun tam içeriğini okur. .md uzantılı veya uzantısız, yollu veya yolsuz not adını kabul eder. Örn: '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. Önceden kaydedilmiş notları görüntülemek için idealdir.",
  "tools.readNote.paramPath": "Not adı veya yolu (.md'li veya .md'siz, klasörlü veya klasörsüz). Örn: '01_02_Qualitaet_als_Erfolgsfaktor' veya '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "Hata: yol belirtilmedi.",
  "tools.readNote.error.invalidPath": "Hata: geçersiz yol.",
  "tools.readNote.autoFound": "[Otomatik bulundu: {path}]",
  "tools.readNote.foundMultiple": "\"{name}\" adında {count} not bulundu. Tam yolu belirtin:\n{paths}",
  "tools.readNote.exactMatchNotFound": "\"{name}\" için tam eşleşme bulunamadı. Benzer notlar:\n{paths}",
  "tools.readNote.error.notFound": "Hata: \"{path}\" notu not defterinde mevcut değil.",
  "tools.readNote.error.readError": "\"{path}\" okunurken hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: read_pdf
  // ═══════════════════════════════════════════════════════════════

  "tools.readPdf.description": "PDF'den metin çıkarır. Büyük PDF'ler (>20 sayfa) için pagesOnly GEREKLİDİR. Belirli sayfalar için pagesOnly: '116-138' kullanın. İçindekiler tablosu için tocOnly: true kullanın. Parametresiz yalnızca ≤20 sayfalık PDF'lerde çalışır.",
  "tools.readPdf.customInstructions": "read_pdf için: PDF'i bulmak için DAİMA önce find_files'ı kullanın. Belirli sayfaları istemek için pagesOnly'yi kullanın. Doğru yolu bulmadan read_pdf'i ASLA çağırmayın.",
  "tools.readPdf.paramPath": "Not defterindeki PDF'in yolu.",
  "tools.readPdf.paramTocOnly": "Yalnızca PDF içindekiler tablosunu döndürür.",
  "tools.readPdf.paramPagesOnly": "Belirli sayfa aralığı (örn: '10-20' veya '5,8,12').",
  "tools.readPdf.error.noPath": "Hata: yol belirtilmedi.",
  "tools.readPdf.multiplePdfs": "Birden çok PDF \"{path}\" ile eşleşiyor:\n{paths}\nTam yolu belirtin.",
  "tools.readPdf.error.notFound": "Hata: \"{path}\" mevcut değil.",
  "tools.readPdf.tooLarge": "PDF {pages} sayfa içeriyor. Belirli sayfaları okumak için pagesOnly (örn: pagesOnly: \"116-138\") veya içindekiler tablosu için tocOnly: true kullanın.",
  "tools.readPdf.noText": "Metin bulunamadı.",
  "tools.readPdf.tocHeader": "[PDF İçindekiler — toplam {pages} sayfa]",
  "tools.readPdf.pageHeader": "[Sayfalar {spec} / {total}]",
  "tools.readPdf.pageLabel": "[Sayfa {num}]",
  "tools.readPdf.totalPages": "[Toplam {total} sayfa]",
  "tools.readPdf.tocSeparator": "═══ İÇİNDEKİLER / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ İÇERİK ═══",
  "tools.readPdf.truncationNotice": "[Not: PDF {pages} sayfa içeriyor. Yalnızca ilk 500 gösteriliyor.]",
  "tools.readPdf.error.generic": "Hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: create_note
  // ═══════════════════════════════════════════════════════════════

  "tools.createNote.description": "Belirtilen başlık ve içerikle (Markdown formatında) not defterinde yeni bir not oluşturur.",
  "tools.createNote.paramTitle": "Not başlığı (uzantısız).",
  "tools.createNote.paramContent": "Markdown formatında not içeriği.",
  "tools.createNote.error.noTitle": "Hata: başlık belirtilmedi.",
  "tools.createNote.error.noContent": "Hata: içerik belirtilmedi.",
  "tools.createNote.error.alreadyExists": "Hata: \"{name}\" adında bir not zaten mevcut.",
  "tools.createNote.success": "Not başarıyla oluşturuldu: \"{name}\" ({length} karakter).",
  "tools.createNote.error.createError": "Not oluşturma hatası: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: update_note
  // ═══════════════════════════════════════════════════════════════

  "tools.updateNote.description": "Not defterindeki mevcut bir notun içeriğinin üzerine yazar. Tam yolu kullanın. Not mevcut değilse hata döndürür (yeni notlar için create_note kullanın).",
  "tools.updateNote.paramPath": "Değiştirilecek notun tam yolu (örn: '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "Markdown formatında notun yeni tam içeriği.",
  "tools.updateNote.error.noPath": "Hata: yol belirtilmedi.",
  "tools.updateNote.error.noContent": "Hata: içerik belirtilmedi.",
  "tools.updateNote.error.notFound": "Hata: \"{path}\" notu mevcut değil. Yeni bir tane oluşturmak için create_note kullanın.",
  "tools.updateNote.error.mismatch": "Hata: \"{path}\" notu güncellenmiş olarak rapor edildi ancak içerik eşleşmiyor ({expected} karakter bekleniyordu, {actual} karakter okundu).",
  "tools.updateNote.success": "\"{path}\" notu başarıyla güncellendi ({length} karakter).",
  "tools.updateNote.error.updateError": "\"{path}\" güncellenirken hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: find_files
  // ═══════════════════════════════════════════════════════════════

  "tools.findFiles.description": "Not defterinde dosyaları ad desenine göre arar. Eşleşen dosyaların yollarını döndürür. Tam yolu bilinmediğinde resim, PDF veya notları bulmak için kullanışlıdır.",
  "tools.findFiles.paramNameQuery": "Arranacak dosya adının bir kısmı (örn: 'MapaPolitico', 'diagram', 'photo.png'). Büyük/küçük harf duyarsız.",
  "tools.findFiles.paramExtension": "Uzantıya göre filtrele (örn: 'png', 'pdf', 'md'). İsteğe bağlı.",
  "tools.findFiles.error.emptyQuery": "Hata: boş arama terimi.",
  "tools.findFiles.noResults": "\"{query}\"{extension} ile eşleşen dosya bulunamadı.",
  "tools.findFiles.results": "{results}\n... ve {more} tane daha.",
  "tools.findFiles.error.searchError": "Dosya arama hatası: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: list_notes
  // ═══════════════════════════════════════════════════════════════

  "tools.listNotes.description": "Bir not defteri klasöründeki (veya belirtilmemişse kök) notları listeler.",
  "tools.listNotes.paramFolder": "Listelenecek klasör (isteğe bağlı). Belirtilmezse kök listelenir.",
  "tools.listNotes.noNotes": "Not bulunamadı.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_fulltext
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultFulltext.description": "Tüm not defteri notlarında tam metin arar (anlamsal aramadan daha hızlı).",
  "tools.searchVaultFulltext.paramQuery": "Arranacak metin.",
  "tools.searchVaultFulltext.error.emptyQuery": "Hata: boş sorgu.",
  "tools.searchVaultFulltext.notFound": "\"{query}\" hiçbir notta bulunamadı.",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_semantic
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultSemantic.description": "Not defteri notlarında anlamsal arama (RAG) kullanarak arama yapar. Sorguya dayalı olarak ilgili parçaları döndürür.",
  "tools.searchVaultSemantic.paramQuery": "Arama sorgusu.",
  "tools.searchVaultSemantic.paramStartDate": "İsteğe bağlı filtre: ISO başlangıç tarihi.",
  "tools.searchVaultSemantic.paramEndDate": "İsteğe bağlı filtre: ISO bitiş tarihi.",
  "tools.searchVaultSemantic.error.emptyQuery": "Hata: boş sorgu.",
  "tools.searchVaultSemantic.error.notEnabled": "Hata: anlamsal arama etkin değil. Ayarlardan 'enableSemanticSearch' seçeneğini etkinleştirin ve not defterini dizine ekleyin.",
  "tools.searchVaultSemantic.noResults": "Sorguyla ilgili parça bulunamadı.",
  "tools.searchVaultSemantic.fragment": "[Parça {index}] ({path}, alaka: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "Anlamsal arama hatası: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_vault_by_timeframe
  // ═══════════════════════════════════════════════════════════════

  "tools.searchVaultByTimeframe.description": "ISO 8601 formatında (YYYY-MM-DDTHH:mm:ss) iki tarih arasında değiştirilmiş not defteri notlarını arar. Kullanıcının bir zaman diliminde ne yaptığını görmek için kullanışlıdır.",
  "tools.searchVaultByTimeframe.paramStartDate": "ISO 8601 formatında başlangıç tarihi, örn: 2026-05-01T00:00:00",
  "tools.searchVaultByTimeframe.paramEndDate": "ISO 8601 formatında bitiş tarihi, örn: 2026-05-10T23:59:59",
  "tools.searchVaultByTimeframe.error.invalidDates": "Hata: geçersiz tarihler. ISO 8601 formatını kullanın (YYYY-MM-DDTHH:mm:ss).",
  "tools.searchVaultByTimeframe.noResults": "{start} ile {end} arasında değiştirilmiş not bulunamadı.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\nDeğiştirilme: {mtime}\nİçerik: {snippet}...",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: search_web
  // ═══════════════════════════════════════════════════════════════

  "tools.searchWeb.description": "Otomatik bir tarayıcı kullanarak web araması yapar ve en alakalı sonuçları (başlık, URL, parçacık) döndürür.",
  "tools.searchWeb.paramQuery": "Web arama sorgusu.",
  "tools.searchWeb.error.emptyQuery": "Hata: boş sorgu.",
  "tools.searchWeb.noResults": "\"{query}\" için sonuç bulunamadı.",
  "tools.searchWeb.error.generic": "Web arama hatası: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: analyze_image
  // ═══════════════════════════════════════════════════════════════

  "tools.analyzeImage.description": "Not defterinden bir görseli analiz eder ve ayrıntılı bir açıklama sağlar. Görsel yolunu kullanın (örn: 'folder/diagram.png'). png, jpg, jpeg, gif, webp destekler.",
  "tools.analyzeImage.paramImagePath": "Not defterindeki görsel dosyasının yolu.",
  "tools.analyzeImage.error.noPath": "Hata: görsel yolu belirtilmedi.",
  "tools.analyzeImage.error.configError": "Hata: {error}",
  "tools.analyzeImage.noResponse": "Görme modelinden yanıt alınamadı.",
  "tools.analyzeImage.error.apiError": "API hatası: {message}",
  "tools.analyzeImage.error.connectionRefused": "Hata: Görme sunucusuna bağlanılamadı. Yerel görme modelinizin uyumlu bir modelle çalıştığından emin olun.",
  "tools.analyzeImage.error.generic": "Görsel analiz edilirken hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_youtube_transcript
  // ═══════════════════════════════════════════════════════════════

  "tools.extractYoutubeTranscript.description": "Bir YouTube videosunun URL'sinden transkriptini (altyazılarını) alır.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "YouTube video URL'si (örn: https://www.youtube.com/watch?v=... veya https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "Hata: video URL'si belirtilmedi.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "Hata: URL'den video ID'si çıkarılamadı: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "Bu video için transkript bulunamadı (altyazılar mevcut olmayabilir).",
  "tools.extractYoutubeTranscript.header": "{videoId} videosunun transkripti:",
  "tools.extractYoutubeTranscript.error.generic": "Transkript alınırken hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: render_pdf_pages
  // ═══════════════════════════════════════════════════════════════

  "tools.renderPdfPages.description": "Belirtilen PDF sayfalarını PNG görüntülerine dönüştürür ve not defterine kaydeder. Tam yolları döndürür (örn: 'Resources/PDF_images/PDF_page_40.png'). ÖNEMLİ: ![[gömme]] için bu aracın döndürdüğü TAM yolları kullanın. Yolları uydurmayın.",
  "tools.renderPdfPages.paramPath": "Not defterindeki PDF'in yolu.",
  "tools.renderPdfPages.paramPages": "Dönüştürülecek sayfalar (örn: '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "Görüntülerin kaydedileceği klasör (isteğe bağlı, varsayılan: PDF'in yanı).",
  "tools.renderPdfPages.paramScale": "Dönüştürme ölçeği (1.0 = 72 DPI, 2.0 = 144 DPI). Varsayılan: 2.0.",
  "tools.renderPdfPages.error.noPath": "Hata: PDF yolu belirtilmedi.",
  "tools.renderPdfPages.error.noPages": "Hata: sayfa belirtilmedi.",
  "tools.renderPdfPages.multiplePdfs": "Birden çok PDF \"{path}\" ile eşleşiyor. Tam yolu belirtin.",
  "tools.renderPdfPages.error.notFound": "Hata: \"{path}\" mevcut değil.",
  "tools.renderPdfPages.error.invalidRange": "Hata: geçersiz sayfa aralığı: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "Hata: çıktı klasörü \"{folder}\" oluşturulamadı: {error}",
  "tools.renderPdfPages.error.noValidPages": "Hata: geçerli sayfa yok. PDF {pages} sayfa içeriyor.",
  "tools.renderPdfPages.error.canvas": "Hata: {page} sayfası için canvas 2D bağlamı oluşturulamadı.",
  "tools.renderPdfPages.error.renderError": "{page} sayfası dönüştürülürken hata: {error}",
  "tools.renderPdfPages.result": "{rendered}/{total} sayfa dönüştürüldü:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "PDF sayfaları dönüştürülürken hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: extract_pdf_images
  // ═══════════════════════════════════════════════════════════════

  "tools.extractPdfImages.description": "PDF sayfalarından gömülü JPG/PNG görüntülerini çıkarır. 'unpdf' gerekli (npm install unpdf). Raster görüntü yoksa (vektör grafik/diyagram), tüm sayfayı PNG olarak dönüştürür. Yalnızca tam sayfalara ihtiyacınız varsa render_pdf_pages kullanın.",
  "tools.extractPdfImages.paramPath": "Not defterindeki PDF'in yolu.",
  "tools.extractPdfImages.paramPages": "Sayfalar (örn: '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "Çıktı klasörü (isteğe bağlı).",
  "tools.extractPdfImages.error.pathAndPages": "Hata: yol ve sayfalar gerekli.",
  "tools.extractPdfImages.multiplePdfs": "Birden çok PDF eşleşiyor. Tam yolu belirtin.",
  "tools.extractPdfImages.error.notFound": "Hata: \"{path}\" mevcut değil.",
  "tools.extractPdfImages.error.invalidRange": "Hata: geçersiz aralık: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "Hata: sayfalar aralık dışı (toplam {pages}).",
  "tools.extractPdfImages.result": "{pages} sayfadan {count} görüntü çıkarıldı:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (tam sayfa)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ Sayfa {page}: dönüştürme başarısız",
  "tools.extractPdfImages.error.canvas": "❌ Sayfa {page}: canvas oluşturulamadı",
  "tools.extractPdfImages.error.generic": "Hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_vault_stats
  // ═══════════════════════════════════════════════════════════════

  "tools.getVaultStats.description": "Not defteri istatistiklerini döndürür: not sayısı, toplam boyut, klasörler.",
  "tools.getVaultStats.stats": "Not: {notes}\nToplam boyut: ~{size}\nKlasör: {folders}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_active_file
  // ═══════════════════════════════════════════════════════════════

  "tools.getActiveFile.description": "Düzenleyicide açık olan dosyanın içeriğini döndürür.",
  "tools.getActiveFile.noFileOpen": "Şu anda açık dosya yok.",
  "tools.getActiveFile.error": "Hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  TOOL: get_frontmatter
  // ═══════════════════════════════════════════════════════════════

  "tools.getFrontmatter.description": "Bir nottan frontmatter'ı (YAML meta verileri) çıkarır.",
  "tools.getFrontmatter.paramPath": "Notun yolu.",
  "tools.getFrontmatter.error.notFound": "Hata: \"{path}\" mevcut değil.",
  "tools.getFrontmatter.noFrontmatter": "Frontmatter yok.",
  "tools.getFrontmatter.error.generic": "Hata: {error}",

  // ═══════════════════════════════════════════════════════════════
  //  AGENT — ToolRegistry
  // ═══════════════════════════════════════════════════════════════

  "tools.registry.errorExecute": "\"{name}\" aracı çalıştırılırken hata: {error}",
  "tools.registry.errorNotFound": "\"{name}\" aracı kayıtlı değil",

  // ═══════════════════════════════════════════════════════════════
  //  ERROR — Generic
  // ═══════════════════════════════════════════════════════════════

  "errors.unknown": "Bilinmeyen hata",
  "errors.fetchFailed": "Getirme başarısız",

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

  "labels.unknown": "Bilinmeyen hata",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ desteklenmiyor)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "Embedding'ler",
  "labels.vision": "Görme",
  "labels.lmStudio": "LM Studio",
};
