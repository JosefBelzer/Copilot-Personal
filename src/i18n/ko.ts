export const ko: Record<string, string> = {
  "settings.title": "Copilot Personal - 설정",
  "settings.language": "언어 / Language",
  "settings.apiKey": "API 키",
  "settings.licenseKey": "라이선스 키",
  "settings.licenseKeyDesc": "Lemon Squeezy Pro 라이선스 키. Free 모드는 비워둠.",
  "settings.provider": "공급자",
  "settings.chatModel": "채팅 모델",
  "settings.embeddingModel": "임베딩 모델",
  "settings.visionModel": "비전 모델",
  "settings.temperature": "온도",
  "settings.maxTokens": "최대 토큰",
  "settings.streamResponses": "스트리밍 응답",
  "settings.semanticSearch": "의미 검색 활성화",
  "settings.webSearch": "웹 검색 활성화",
  "settings.vision": "비전 활성화",
  "settings.agentMode": "에이전트 모드 활성화",
  "settings.budgetTitle": "예산 AI (Pro)",
  "settings.budgetEnable": "Copilot 예산 AI 사용",
  "chat.btnNew": "새로 만들기",
  "chat.btnSave": "저장",
  "chat.btnHistory": "기록",
  "chat.btnSend": "보내기",
  "chat.btnStop": "중지",
  "chat.btnAgent": "에이전트",
  "chat.btnThink": "생각",
  "chat.headerPrivacyLocal": "🔒 로컬",
  "chat.headerPrivacyCloud": "☁️ 클라우드",
  "chat.headerTierPro": "⭐ Pro",
  "chat.headerTierFree": "🆓 Free",
  "chat.statusReady": "준비 완료",
  "chat.statusThinking": "생각 중...",
  "chat.statusError": "오류",
  "chat.greeting": "안녕하세요! 저는 당신의 개인 AI 코파일럿입니다.",
  "chat.rateLimitReached": "⚠️ 일일 한도에 도달했습니다 ({used}/{limit}). Pro로 업그레이드하세요.",
  "chat.crashRecovery": "📝 이전 세션이 복원되었습니다.",
  "commands.openChat": "Copilot 채팅 열기",
  "commands.newChat": "Copilot: 새 채팅",
  "commands.quickAsk": "Copilot: 빠른 질문",
  "commands.exportMd": "Copilot: Markdown으로 내보내기",
  "license.proActivated": "✅ Pro 라이선스가 활성화되었습니다.",
  "license.freeActivated": "🆓 Free 모드가 활성화되었습니다.",

  // Settings — Language
  "settings.languageDesc": "UI 언어를 선택합니다. 변경 사항이 즉시 적용됩니다.",

  // Settings — API Configuration
  "settings.apiConfiguration": "API 설정",
  "settings.apiKeyDesc": "{provider}의 API 키 (data.json에 저장 — 암호화되지 않음. Git에 커밋하지 마십시오.)",
  "settings.licenseClearTooltip": "라이선스 지우기 (Free로 되돌리기)",
  "settings.licensePlaceholder": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "settings.apiUrl": "API URL",
  "settings.apiUrlDesc": "API 엔드포인트의 기본 URL",
  "settings.providerDesc": "LLM 공급자를 선택하십시오",
  "settings.detectModels": "모델 감지",
  "settings.detectModelsDesc": "LM Studio의 /v1/models 엔드포인트를 조회하여 로드된 모델을 찾습니다",
  "settings.lmStatusQuerying": "LM Studio 조회 중...",
  "settings.lmStatusNoModels": "모델을 찾을 수 없습니다. LM Studio에서 먼저 모델을 로드하십시오.",
  "settings.lmStatusFound": "{count}개 모델 발견: {models}",
  "settings.lmStatusError": "오류: {error}. LM Studio가 실행 중인지 확인하십시오.",
  "settings.fallbackModelName": "모델 {cap} (대체)",

  // Provider names
  "provider.name.auto": "자동 감지 (URL에서)",
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
  "settings.budgetEnableDesc": "Mistral Nemo 기반 무료 관리형 API. API 키가 필요하지 않습니다. 일일 사용 제한이 포함됩니다.",
  "settings.budgetProRequired": "🔒 Copilot AI는 Pro 라이선스가 필요합니다. Pro로 업그레이드하여 관리형 예산 API를 사용하십시오.",

  // Settings — Model Configuration
  "settings.modelConfig": "모델 설정",
  "settings.temperatureDesc": "무작위성을 제어합니다 (0.0 = 결정적, 2.0 = 매우 무작위)",
  "settings.maxTokensDesc": "응답의 최대 토큰 수",
  "settings.topP": "Top P",
  "settings.topPDesc": "핵 확률 샘플링 (0.0-1.0). 낮을수록 더 집중됨",
  "settings.topK": "Top K",
  "settings.topKDesc": "토큰 선택을 상위 K개로 제한합니다 (0 = 비활성화)",
  "settings.presencePenalty": "존재 페널티",
  "settings.presencePenaltyDesc": "반복 토큰에 패널티를 부과합니다 (0-2). 높을수록 반복 감소",
  "settings.enableThinking": "사고 모드 활성화",
  "settings.enableThinkingDesc": "DeepSeek V4 사고/추론 사용 (온도/top_p/존재 페널티와 호환되지 않음)",
  "settings.reasoningEffort": "추론 노력",
  "settings.reasoningEffortDesc": "사고 모드가 활성화된 경우에만 적용됩니다 (DeepSeek V4)",
  "settings.streamResponsesDesc": "토큰 단위로 응답 표시",
  "settings.contextTurns": "컨텍스트 턴",
  "settings.contextTurnsDesc": "컨텍스트에 포함할 이전 턴 수",
  "settings.semanticSearchDesc": "채팅에서 의미 검색을 위해 볼트를 인덱싱합니다",
  "settings.semanticSearchProLocked": "🔒 의미 검색은 Pro 라이선스가 필요합니다",
  "settings.maxSourceChunks": "최대 소스 청크",
  "settings.maxSourceChunksDesc": "쿼리당 검색할 청크 수",
  "settings.chunkSize": "청크 크기 (토큰)",
  "settings.chunkSizeDesc": "청크당 대략적인 토큰 수",

  // Settings — Web Search
  "settings.webSearchDesc": "browser-use 마이크로서비스를 통한 웹 검색 허용",
  "settings.webSearchProLocked": "🔒 웹 검색은 Pro 라이선스가 필요합니다",
  "settings.webSearchServerUrl": "웹 검색 서버 URL",
  "settings.webSearchServerUrlDesc": "browser-use Python 마이크로서비스의 URL",
  "settings.webSearchMaxResults": "최대 검색 결과",
  "settings.webSearchMaxResultsDesc": "반환할 웹 검색 결과 수",
  "settings.webSearchToken": "웹 검색 토큰",
  "settings.webSearchTokenDesc": "Python 검색 서버와 공유되는 인증 토큰 (서버의 COPILOT_WEB_TOKEN과 일치해야 함)",
  "settings.webSearchTokenPlaceholder": "your-secure-token",

  // Settings — Vision
  "settings.visionDesc": "이미지에 비전 모델 사용",
  "settings.visionNotSupported": "이 공급자에서 사용할 수 없음",
  "settings.visionProLocked": "🔒 비전은 Pro 라이선스가 필요합니다",
  "settings.imageDrop": "이미지 드롭 활성화",
  "settings.imageDropDesc": "채팅에 이미지 드래그 & 드롭 허용",

  // Settings — Chat History
  "settings.saveChatHistory": "채팅 기록 저장",
  "settings.saveChatHistoryDesc": "대화를 볼트에 Markdown 파일로 저장",
  "settings.chatHistoryFolder": "채팅 기록 폴더",
  "settings.chatHistoryFolderDesc": "채팅 기록 파일을 저장할 폴더",

  // Settings — Memory
  "settings.enableMemory": "메모리 활성화",
  "settings.enableMemoryDesc": "채팅 세션 간 주요 사실 기억",
  "settings.memoryFolder": "메모리 폴더",
  "settings.memoryFolderDesc": "메모리 파일을 저장할 폴더",
  "settings.maxMemories": "최대 메모리",
  "settings.maxMemoriesDesc": "새 채팅 시 로드할 최근 메모리 수",

  // Settings — Agent Mode
  "settings.agentModeDesc": "AI가 도구를 사용하고 여러 작업을 자율적으로 수행하도록 허용",
  "settings.agentModeToolCallingNA": "이 공급자에서 도구 호출을 사용할 수 없음",
  "settings.agentModeProLocked": "🔒 에이전트 모드는 Pro 라이선스가 필요합니다",
  "settings.maxAgentIterations": "최대 에이전트 반복",
  "settings.maxAgentIterationsDesc": "에이전트 실행당 최대 도구 호출 수",

  // Settings — LM Studio
  "settings.lmDetectTitle": "LM Studio - 모델 감지",
  "settings.lmStatusDefault": "'감지'를 클릭하여 LM Studio에서 사용 가능한 모델을 가져옵니다.",
  "settings.lmDetectButton": "감지",
  "settings.lmStatusFoundNotice": "LM Studio에서 {count}개 모델을 찾았습니다. 첫 번째 모델({model})이 기본값으로 설정되었습니다.",

  // Settings — Model names
  "settings.chatModelDesc": "채팅 완성에 사용할 모델",
  "settings.embeddingModelDesc": "임베딩용 모델{unsupported}",
  "settings.embeddingModelUnsupported": " (⚠️ 이 공급자에서 지원되지 않음)",
  "settings.visionModelDesc": "비전/이미지 작업에 사용할 모델",

  // Settings — Section headers
  "settings.chatOptions": "채팅 옵션",
  "settings.chatHistory": "채팅 기록",
  "settings.memory": "메모리",
  "settings.lmVisionTitle": "LM Studio (이미지 분석)",
  "settings.sectionSemanticSearch": "의미 검색 (RAG)",
  "settings.sectionWebSearch": "웹 검색 (browser-use)",
  "settings.sectionVision": "비전 / 이미지",
  "settings.sectionAgentMode": "에이전트 모드",

  // Settings — Reasoning
  "settings.reasoningHigh": "높음",
  "settings.reasoningMax": "최대",

  // Settings — Multi-Provider Fallback
  "settings.multiProviderFallback": "🔄 다중 공급자 대체",
  "settings.fallbackFor": "{cap}의 대체",
  "settings.fallbackSelect": "{cap}을 지원하는 공급자 선택",
  "settings.fallbackProLocked": "🔒 Pro 라이선스 필요",
  "settings.fallbackModelDesc": "대체 공급자의 {cap} 모델 이름",
  "settings.multiProviderProNotice": "다중 공급자 대체는 Pro 라이선스가 필요합니다. Pro를 사용하면 기본 공급자가缺乏한 기능에 대해 두 번째 공급자를 사용할 수 있습니다.",
  "settings.providerNoSupport": "{provider}는 {cap}을 지원하지 않습니다",
  "settings.providerSelectSupporting": "{cap}을 지원하는 공급자를 선택하십시오",

  // Chat — Buttons & Header
  "chat.title": "Copilot Personal",
  "chat.newChatTooltip": "새 채팅 시작",
  "chat.saveChatTooltip": "채팅을 파일로 저장",
  "chat.browseHistoryTooltip": "저장된 채팅 찾아보기",
  "chat.agentToggleTooltip": "에이전트 모드 전환 (자율 도구 사용)",
  "chat.thinkToggleTooltip": "사고 모드 활성화 (모델이 응답 전에 추론)",
  "chat.sendPlaceholder": "메시지를 입력하십시오... (Enter: 전송, Shift+Enter: 새 줄)",
  "chat.headerPrivacyLocalTooltip": "데이터가 로컬에서 처리됩니다. 기기를 벗어나지 않습니다.",
  "chat.headerPrivacyCloudTooltip": "데이터가 외부 서버로 전송됩니다. 설정 > API 구성을 확인하십시오.",
  "chat.headerTierProTooltip": "Pro 라이선스 활성화 — 모든 기능 잠금 해제",
  "chat.headerTierFreeTooltip": "Free 등급 — 하루 50개 메시지, 제한된 기능",

  // Chat — Status
  "chat.statusAgentModeOn": "에이전트 모드 켜짐",
  "chat.statusAgentThinking": "에이전트 생각 중...",
  "chat.statusStopped": "중지됨",
  "chat.statusNewChat": "새 채팅 시작됨",
  "chat.statusThinkingOn": "사고 모드 켜짐",
  "chat.statusSearching": "웹 검색 중: \"{query}\"...",
  "chat.statusSearchError": "검색 오류",
  "chat.statusSaved": "{path}에 저장됨",
  "chat.statusSaveFailed": "저장 실패: {error}",
  "chat.statusParsing": "{name} 파싱 중...",
  "chat.statusPdfParsed": "PDF 파싱 완료: {name}",
  "chat.statusImageReady": "이미지 준비: {name}",
  "chat.statusAgentError": "에이전트 오류",
  "chat.statusExported": "채팅이 {fileName}으로 내보내졌습니다",
  "chat.statusExportFailed": "내보내기 실패: {error}",

  // Chat — Messages / License
  "chat.licenseAgentRequired": "🔒 에이전트 모드는 Pro 라이선스가 필요합니다. 설정 → 라이선스 키.",
  "chat.licenseWebSearchRequired": "🔒 웹 검색은 Pro 라이선스가 필요합니다. 설정 → 라이선스 키.",

  // Chat — Messages / Crash recovery
  "chat.memoriesLoaded": "📝 {count}개의 이전 요약을 로드했습니다.",

  // Chat — Messages / Agent
  "chat.agentStepProgress": "⏳ 단계 {step}: {tool}...",
  "chat.agentWriteCountWarn": "⚠️ 모델이 완료를 주장하지만 {expected}개의 노트 중 {written}개만 저장되었습니다. {missing}개 누락.",
  "chat.agentFallback": "⚠️ 에이전트 모드 실패 — 대체 응답:\n\n{response}",
  "chat.agentError": "에이전트 오류: {message}",
  "chat.agentWarnNotSaved": "⚠️ **참고: 모델이 노트를 저장/수정했다고 주장했지만, 쓰기 도구(update_note, create_note) 또는 <!--save:--> 마커가 사용되지 않았습니다. 이 주장은 환각입니다.**",
  "chat.budgetModelLabel": "🧠 Copilot AI",
  "chat.budgetAgentNotAvailable": "🤖 에이전트 모드는 Copilot AI에서 아직 사용할 수 없습니다. 설정 → 공급자에서 다른 공급자(DeepSeek, OpenAI 등)로 전환하여 에이전트 모드를 사용하십시오.",

  // Chat — Auto-save
  "chat.autoSaveResult": "📝 {saved}/{total}개 노트 자동 저장됨:\n{results}\n\n---\n\n{response}",
  "chat.autoSaveNoteUpdated": "📝 {path} 업데이트됨 ({changed}개 줄 변경)",

  // Chat — Messages
  "chat.noSavedChats": "저장된 채팅이 없습니다.",
  "chat.noMessagesToSave": "저장할 메시지가 없습니다.",
  "chat.chatSaved": "채팅이 {path}에 저장되었습니다",
  "chat.chatSaveFailed": "채팅 저장 실패: {error}",
  "chat.savedChatsFound": "📂 {count}개의 저장된 채팅:",
  "chat.savedChatItem": "📄 {title} ({date})",
  "chat.searchQueryMissing": "`!search` 뒤에 검색어를 입력하십시오.",
  "chat.searching": "검색 중: {query}",
  "chat.webSearchFailed": "웹 검색 실패: {error}",
  "chat.imageDroppedInfo": "이미지 드롭됨: {name} (설정에서 비전을 활성화하여 이미지 분석)",
  "chat.fileDroppedUnsupported": "파일 드롭됨: {name} (지원되지 않는 형식)",
  "chat.fileDroppedError": "{name} 처리 중 오류: {error}",

  // Chat — Delete
  "chat.deleteMessageTooltip": "이 메시지 삭제",

  // Chat — Loading states
  "chat.statusReading": "📕 파일 읽는 중...",
  "chat.statusSearchingVault": "🔍 볼트 검색 중...",
  "chat.statusAnalyzingImage": "🖼️ 이미지 분석 중...",
  "chat.statusGeneratingEmbeddings": "🧮 임베딩 생성 중...",
  "chat.statusCompacting": "📦 컨텍스트 압축 중...",
  "chat.statusDeepThinking": "💭 생각 중...",

  // Chat — Save/Export roles
  "chat.saveRoleYou": "**당신**",
  "chat.saveRoleAssistant": "**어시스턴트**",
  "chat.saveRoleSystem": "**시스템**",
  "chat.exportRoleUser": "👤 사용자",
  "chat.exportRoleAssistant": "🤖 어시스턴트",
  "chat.exportRoleSystem": "🔧 시스템",

  // Chat — Avatars
  "chat.roleUser": "당신",
  "chat.roleAssistant": "어시스턴트",
  "chat.roleSystem": "시스템",

  // Chat — Slash commands
  "chat.slashSummarize": "다음 내용을 간결하게 요약하고 핵심 사항을 강조하십시오:\n\n",
  "chat.slashTranslate": "다음 내용을 영어로 번역하고 서식과 기술 용어를 유지하십시오:\n\n",
  "chat.slashExplain": "다음 개념을 예제와 실제 적용 사례를 포함하여 자세히 설명하십시오:\n\n",
  "chat.slashToc": "다음 내용에 대한 구조화된 목차를 생성하십시오:\n\n",
  "chat.slashFlashcards": "Q: ... A: ... 형식으로 10개의 Q&A 플래시카드를 만드십시오:\n\n",
  "chat.slashRewrite": "다음 내용을 명확성, 구조 및 스타일을 개선하여 다시 작성하십시오:\n\n",
  "chat.slashExpand": "다음 내용에 세부 정보, 컨텍스트 및 예제를 추가하여 확장하십시오:\n\n",

  // Commands
  "commands.sendSelection": "선택 항목을 Copilot으로 보내기",
  "commands.indexVault": "Copilot: 의미 검색을 위해 볼트 인덱싱",
  "commands.clearIndex": "Copilot: 의미 검색 인덱스 지우기",
  "commands.saveChat": "Copilot: 채팅을 파일로 저장",
  "commands.exportJson": "Copilot: JSON으로 내보내기",

  // Notices
  "notices.noTextSelected": "선택된 텍스트가 없습니다.",
  "notices.indexingVault": "볼트 인덱싱 중...",
  "notices.indexingProgress": "인덱싱: {current}/{total} 파일",
  "notices.indexCorrupted": "인덱스 파일이 손상되었거나 로드에 실패했습니다. 지우고 다시 인덱싱해 보십시오.",
  "notices.indexEmpty": "볼트 인덱싱이 완료되었지만 인덱싱된 파일이 없습니다. 제외된 폴더를 확인하거나 다시 시도하십시오.",
  "notices.indexEmptyVectors": "볼트 인덱싱에서 빈 벡터가 생성되었습니다. 임베딩 모델이 임베딩을 생성하지 않습니다. LM Studio에서 전용 임베딩 모델(nomic-embed-text, all-MiniLM-L6-v2)을 로드하고 설정 → 임베딩 모델에서 설정한 후 지우고 다시 인덱싱하십시오.",
  "notices.indexComplete": "볼트 인덱싱 완료! {chunks}개 청크가 인덱싱되었습니다.",
  "notices.indexFailed": "인덱싱 실패: {error}",
  "notices.indexCleared": "인덱스가 지워졌습니다.",

  // Quick Ask
  "quickAsk.title": "빠른 질문",
  "quickAsk.placeholder": "무엇이든 물어보십시오...",
  "quickAsk.btnAsk": "질문",
  "quickAsk.btnThinking": "생각 중...",
  "quickAsk.error": "오류: {error}",

  // License
  "license.rejected": "라이선스 거부됨: {reason}",
  "license.serverError": "서버 오류 ({status}). Lemon Squeezy에서 키를 확인하십시오.",
  "license.offlineError": "라이선스 서버에 연결할 수 없습니다. 인터넷 연결을 확인하십시오.",
  "license.demoKeyDenied": "데모 키는 디버그 모드(COPILOT_DEBUG=1)가 필요합니다",
  "license.dailyLimitReached": "⚠️ 일일 한도에 도달했습니다. 무제한 메시지를 위해 Pro로 업그레이드하십시오.",

  // Provider & Services
  "provider.unsupportedTask": "이 작업에 사용 가능한 공급자가 없습니다 ({task}). 설정에서 공급자를 구성하십시오.",
  "provider.emptyEmbeddingResponse": "공급자로부터 임베딩이 반환되지 않았습니다. 선택한 모델이 임베딩을 지원하는지 확인하십시오.",
  "provider.zeroVectorEmbedding": "모델이 제로 벡터 임베딩을 반환했습니다. 선택한 모델이 실제 임베딩 모델(text-embedding-*, all-MiniLM-L6-v2, nomic-embed-text)인지 확인하십시오.",
  "provider.unavailableRetry": "모든 모델이 사용 중이거나 사용할 수 없습니다. 나중에 다시 시도하십시오.",
  "provider.anthropicNoEmbeddings": "Anthropic은 임베딩을 지원하지 않습니다. 설정에서 다른 공급자(DeepSeek, OpenAI 또는 LM Studio)를 임베딩용으로 구성하십시오.",
  "provider.anthropicNoEmbeddingsShort": "Anthropic은 임베딩을 지원하지 않습니다.",

  // Circuit Breaker
  "circuit.rateLimited": "속도 제한됨. {seconds}초 후 재시도...",
  "circuit.open": "{failures}회 실패 후 API를 사용할 수 없음. {cooldown}초 동안 회로 열림.",
  "circuit.retrying": "API 오류 (시도 {attempt}/3). 2초 후 재시도...",
  "circuit.statusOpen": "API가 {remaining}초 동안 비활성화됨",
  "circuit.statusDegraded": "최근 {failures}회 실패",
  "circuit.statusClosed": "정상",

  // Web Search
  "webSearch.urlNotConfigured": "웹 검색 서버 URL이 설정되지 않았습니다.",
  "webSearch.serverError": "검색 서버가 {status}을 반환했습니다: {text}",
  "webSearch.noResults": "결과를 찾을 수 없습니다.",
  "webSearch.resultItem": "[{index}] {title}\nURL: {url}\n스니펫: {snippet}",

  // Agent
  "agent.maxIterationsReached": "최대 도구 호출 반복에 도달했습니다.",
  "agent.fallbackResponse": "분석을 완료했지만 최종 응답을 생성할 수 없습니다.",
  "agent.fallbackTruncated": "최대 도구 호출 수에 도달했습니다. 발견된 내용에 따르면 볼트에 충분한 정보가 없을 수 있습니다. 더 구체적으로 시도하거나 추가 노트를 인덱싱하십시오.",
  "agent.planStepDone": "✓",
  "agent.planStepActive": "→",
  "agent.planStepFailed": "✗",
  "agent.planStepPending": "·",

  // Tool: read_note
  "tools.readNote.description": "볼트에서 노트의 전체 내용을 읽습니다. .md 확장자 유무와 경로 유무에 관계없이 노트 이름을 허용합니다. 예: '01_02_Qualitaet_als_Erfolgsfaktor', 'Folder/MyNote.md'. 이전에 저장된 노트를 참조하는 데 적합합니다.",
  "tools.readNote.paramPath": "노트 이름 또는 경로(.md 유무, 폴더 유무에 관계없음). 예: '01_02_Qualitaet_als_Erfolgsfaktor' 또는 '10_Mundo/ReinosDeAcanthia.md'.",
  "tools.readNote.error.noPath": "오류: 경로가 제공되지 않았습니다.",
  "tools.readNote.error.invalidPath": "오류: 잘못된 경로입니다.",
  "tools.readNote.autoFound": "[자동 찾음: {path}]",
  "tools.readNote.foundMultiple": "\"{name}\" 이름의 노트를 {count}개 찾았습니다. 전체 경로를 지정하십시오:\n{paths}",
  "tools.readNote.exactMatchNotFound": "\"{name}\"에 대한 정확한 일치를 찾을 수 없습니다. 유사한 노트:\n{paths}",
  "tools.readNote.error.notFound": "오류: \"{path}\" 노트가 볼트에 존재하지 않습니다.",
  "tools.readNote.error.readError": "\"{path}\" 읽기 오류: {error}",

  // Tool: read_pdf
  "tools.readPdf.description": "PDF에서 텍스트를 추출합니다. 대형 PDF(20페이지 초과)에는 pagesOnly가 필요합니다. 특정 페이지에는 pagesOnly: '116-138'을 사용하십시오. 목차에는 tocOnly: true를 사용하십시오. 매개변수 없이는 20페이지 이하의 PDF에서만 작동합니다.",
  "tools.readPdf.customInstructions": "read_pdf의 경우: 항상 find_files를 먼저 사용하여 PDF를 찾으십시오. pagesOnly를 사용하여 특정 페이지를 요청하십시오. 올바른 경로를 먼저 찾지 않고 read_pdf를 호출하지 마십시오.",
  "tools.readPdf.paramPath": "볼트 내 PDF의 경로.",
  "tools.readPdf.paramTocOnly": "PDF 목차/TOC만 반환합니다.",
  "tools.readPdf.paramPagesOnly": "특정 페이지 범위 (예: '10-20' 또는 '5,8,12').",
  "tools.readPdf.error.noPath": "오류: 경로가 제공되지 않았습니다.",
  "tools.readPdf.multiplePdfs": "\"{path}\"와 일치하는 여러 PDF:\n{paths}\n정확한 경로를 지정하십시오.",
  "tools.readPdf.error.notFound": "오류: \"{path}\"가 존재하지 않습니다.",
  "tools.readPdf.tooLarge": "PDF에 {pages}페이지가 있습니다. pagesOnly를 사용하여 특정 페이지(예: pagesOnly: \"116-138\")를 읽거나 tocOnly: true를 사용하여 목차를 읽으십시오.",
  "tools.readPdf.noText": "텍스트를 찾을 수 없습니다.",
  "tools.readPdf.tocHeader": "[PDF 목차 — 총 {pages}페이지]",
  "tools.readPdf.pageHeader": "[{spec}페이지 (총 {total}페이지)]",
  "tools.readPdf.pageLabel": "[{num}페이지]",
  "tools.readPdf.totalPages": "[총 {total}페이지]",
  "tools.readPdf.tocSeparator": "═══ 목차 / TOC ═══",
  "tools.readPdf.contentSeparator": "═══ 내용 ═══",
  "tools.readPdf.truncationNotice": "[참고: PDF에 {pages}페이지가 있습니다. 처음 500페이지만 표시됩니다.]",
  "tools.readPdf.error.generic": "오류: {error}",

  // Tool: create_note
  "tools.createNote.description": "지정된 제목과 내용으로 볼트에 새 노트를 생성합니다(Markdown 형식).",
  "tools.createNote.paramTitle": "노트 제목 (확장자 없음).",
  "tools.createNote.paramContent": "Markdown 형식의 노트 내용.",
  "tools.createNote.error.noTitle": "오류: 제목이 제공되지 않았습니다.",
  "tools.createNote.error.noContent": "오류: 내용이 제공되지 않았습니다.",
  "tools.createNote.error.alreadyExists": "오류: \"{name}\" 이름의 노트가 이미 존재합니다.",
  "tools.createNote.success": "노트가 성공적으로 생성되었습니다: \"{name}\" ({length}자).",
  "tools.createNote.error.createError": "노트 생성 오류: {error}",

  // Tool: update_note
  "tools.updateNote.description": "볼트에 있는 기존 노트의 내용을 덮어씁니다. 전체 경로를 사용하십시오. 노트가 존재하지 않으면 오류를 반환합니다(새 노트는 create_note를 사용하십시오).",
  "tools.updateNote.paramPath": "수정할 노트의 전체 경로 (예: '10_Mundo/Reinos.md').",
  "tools.updateNote.paramContent": "Markdown 형식의 노트 새 전체 내용.",
  "tools.updateNote.error.noPath": "오류: 경로가 제공되지 않았습니다.",
  "tools.updateNote.error.noContent": "오류: 내용이 제공되지 않았습니다.",
  "tools.updateNote.error.notFound": "오류: \"{path}\" 노트가 존재하지 않습니다. 새 노트를 만들려면 create_note를 사용하십시오.",
  "tools.updateNote.error.mismatch": "오류: \"{path}\" 노트가 업데이트되었다고 보고되었지만 내용이 일치하지 않습니다({expected}자 예상, {actual}자 읽음).",
  "tools.updateNote.success": "\"{path}\" 노트가 성공적으로 업데이트되었습니다({length}자).",
  "tools.updateNote.error.updateError": "\"{path}\" 업데이트 오류: {error}",

  // Tool: find_files
  "tools.findFiles.description": "이름 패턴으로 볼트에서 파일을 검색합니다. 일치하는 파일의 경로를 반환합니다. 정확한 경로를 모를 때 이미지, PDF 또는 노트를 찾는 데 유용합니다.",
  "tools.findFiles.paramNameQuery": "검색할 파일 이름의 일부 (예: 'MapaPolitico', 'diagram', 'photo.png'). 대소문자를 구분하지 않습니다.",
  "tools.findFiles.paramExtension": "확장자로 필터링 (예: 'png', 'pdf', 'md'). 선택 사항.",
  "tools.findFiles.error.emptyQuery": "오류: 빈 검색어입니다.",
  "tools.findFiles.noResults": "\"{query}\"{extension}와 일치하는 파일을 찾을 수 없습니다.",
  "tools.findFiles.results": "{results}\n... 외 {more}개 더.",
  "tools.findFiles.error.searchError": "파일 검색 오류: {error}",

  // Tool: list_notes
  "tools.listNotes.description": "볼트 폴더의 노트를 나열합니다(지정되지 않은 경우 루트).",
  "tools.listNotes.paramFolder": "나열할 폴더 (선택 사항). 지정하지 않으면 루트를 나열합니다.",
  "tools.listNotes.noNotes": "노트를 찾을 수 없습니다.",

  // Tool: search_vault_fulltext
  "tools.searchVaultFulltext.description": "모든 볼트 노트에서 정확한 텍스트를 검색합니다(의미 검색보다 빠름).",
  "tools.searchVaultFulltext.paramQuery": "검색할 텍스트.",
  "tools.searchVaultFulltext.error.emptyQuery": "오류: 빈 검색어입니다.",
  "tools.searchVaultFulltext.notFound": "어떤 노트에서도 \"{query}\"을(를) 찾지 못했습니다.",

  // Tool: search_vault_semantic
  "tools.searchVaultSemantic.description": "의미 검색(RAG)을 사용하여 볼트 노트를 검색합니다. 쿼리를 기반으로 관련 조각을 반환합니다.",
  "tools.searchVaultSemantic.paramQuery": "검색 쿼리.",
  "tools.searchVaultSemantic.paramStartDate": "선택적 필터: ISO 시작 날짜.",
  "tools.searchVaultSemantic.paramEndDate": "선택적 필터: ISO 종료 날짜.",
  "tools.searchVaultSemantic.error.emptyQuery": "오류: 빈 검색어입니다.",
  "tools.searchVaultSemantic.error.notEnabled": "오류: 의미 검색이 활성화되지 않았습니다. 설정에서 'enableSemanticSearch'를 활성화하고 볼트를 인덱싱하십시오.",
  "tools.searchVaultSemantic.noResults": "쿼리에 대한 관련 조각을 찾을 수 없습니다.",
  "tools.searchVaultSemantic.fragment": "[조각 {index}] ({path}, 관련성: {score})\n{text}",
  "tools.searchVaultSemantic.error.generic": "의미 검색 오류: {error}",

  // Tool: search_vault_by_timeframe
  "tools.searchVaultByTimeframe.description": "ISO 8601 형식(YYYY-MM-DDTHH:mm:ss)의 두 날짜 사이에 수정된 볼트 노트를 검색합니다. 사용자가 특정 기간에 무엇을 했는지 확인하는 데 유용합니다.",
  "tools.searchVaultByTimeframe.paramStartDate": "ISO 8601 형식의 시작 날짜 (예: 2026-05-01T00:00:00)",
  "tools.searchVaultByTimeframe.paramEndDate": "ISO 8601 형식의 종료 날짜 (예: 2026-05-10T23:59:59)",
  "tools.searchVaultByTimeframe.error.invalidDates": "오류: 잘못된 날짜입니다. ISO 8601 형식(YYYY-MM-DDTHH:mm:ss)을 사용하십시오.",
  "tools.searchVaultByTimeframe.noResults": "{start}과 {end} 사이에 수정된 노트를 찾을 수 없습니다.",
  "tools.searchVaultByTimeframe.result": "[{index}] {title} ({path})\n수정: {mtime}\n내용: {snippet}...",

  // Tool: search_web
  "tools.searchWeb.description": "자동화된 브라우저를 사용하여 웹 검색을 수행하고 가장 관련성 높은 결과(제목, URL, 스니펫)를 반환합니다.",
  "tools.searchWeb.paramQuery": "웹 검색 쿼리.",
  "tools.searchWeb.error.emptyQuery": "오류: 빈 검색어입니다.",
  "tools.searchWeb.noResults": "\"{query}\"에 대한 결과를 찾을 수 없습니다.",
  "tools.searchWeb.error.generic": "웹 검색 오류: {error}",

  // Tool: analyze_image
  "tools.analyzeImage.description": "볼트의 이미지를 분석하고 자세한 설명을 제공합니다. 이미지 경로(예: 'folder/diagram.png')를 사용하십시오. png, jpg, jpeg, gif, webp를 지원합니다.",
  "tools.analyzeImage.paramImagePath": "볼트 내 이미지 파일의 경로.",
  "tools.analyzeImage.error.noPath": "오류: 이미지 경로가 제공되지 않았습니다.",
  "tools.analyzeImage.error.configError": "오류: {error}",
  "tools.analyzeImage.noResponse": "비전 모델로부터 응답을 받지 못했습니다.",
  "tools.analyzeImage.error.apiError": "API 오류: {message}",
  "tools.analyzeImage.error.connectionRefused": "오류: 비전 서버에 연결할 수 없습니다. 로컬 비전 모델이 호환 가능한 모델로 실행 중인지 확인하십시오.",
  "tools.analyzeImage.error.generic": "이미지 분석 오류: {error}",

  // Tool: extract_youtube_transcript
  "tools.extractYoutubeTranscript.description": "YouTube 동영상 URL에서 자막을 가져옵니다.",
  "tools.extractYoutubeTranscript.paramVideoUrl": "YouTube 동영상 URL (예: https://www.youtube.com/watch?v=... 또는 https://youtu.be/...).",
  "tools.extractYoutubeTranscript.error.noUrl": "오류: 동영상 URL이 제공되지 않았습니다.",
  "tools.extractYoutubeTranscript.error.invalidUrl": "오류: URL에서 동영상 ID를 추출할 수 없습니다: {url}",
  "tools.extractYoutubeTranscript.noTranscript": "이 동영상에 대한 자막을 찾을 수 없습니다(자막을 사용할 수 없을 수 있음).",
  "tools.extractYoutubeTranscript.header": "동영상 {videoId}의 자막:",
  "tools.extractYoutubeTranscript.error.generic": "자막 가져오기 오류: {error}",

  // Tool: render_pdf_pages
  "tools.renderPdfPages.description": "특정 PDF 페이지를 PNG 이미지로 렌더링하고 볼트에 저장합니다. 정확한 경로를 반환합니다(예: 'Resources/PDF_images/PDF_page_40.png'). 중요: 이 도구가 반환한 정확한 경로를 ![[embeds]]에 사용하십시오. 경로를 임의로 생성하지 마십시오.",
  "tools.renderPdfPages.paramPath": "볼트 내 PDF의 경로.",
  "tools.renderPdfPages.paramPages": "렌더링할 페이지 (예: '30-33', '5,8,12', '30').",
  "tools.renderPdfPages.paramOutputFolder": "이미지를 저장할 폴더 (선택 사항, 기본값: PDF 옆).",
  "tools.renderPdfPages.paramScale": "렌더링 배율 (1.0 = 72 DPI, 2.0 = 144 DPI). 기본값: 2.0.",
  "tools.renderPdfPages.error.noPath": "오류: PDF 경로가 제공되지 않았습니다.",
  "tools.renderPdfPages.error.noPages": "오류: 페이지가 지정되지 않았습니다.",
  "tools.renderPdfPages.multiplePdfs": "\"{path}\"와 일치하는 여러 PDF가 있습니다. 정확한 경로를 지정하십시오.",
  "tools.renderPdfPages.error.notFound": "오류: \"{path}\"가 존재하지 않습니다.",
  "tools.renderPdfPages.error.invalidRange": "오류: 잘못된 페이지 범위: \"{range}\".",
  "tools.renderPdfPages.error.createFolder": "오류: 출력 폴더 \"{folder}\"를 생성할 수 없습니다: {error}",
  "tools.renderPdfPages.error.noValidPages": "오류: 유효한 페이지가 없습니다. PDF에 {pages}페이지가 있습니다.",
  "tools.renderPdfPages.error.canvas": "오류: {page}페이지의 캔버스 2D 컨텍스트를 생성할 수 없습니다.",
  "tools.renderPdfPages.error.renderError": "{page}페이지 렌더링 오류: {error}",
  "tools.renderPdfPages.result": "{rendered}/{total}페이지 렌더링됨:\n{results}",
  "tools.renderPdfPages.success": "✅ {path}",
  "tools.renderPdfPages.fail": "❌ {error}",
  "tools.renderPdfPages.error.topLevel": "PDF 페이지 렌더링 오류: {error}",

  // Tool: extract_pdf_images
  "tools.extractPdfImages.description": "PDF 페이지에서 내장된 JPG/PNG 이미지를 추출합니다. 'unpdf'가 설치되어 있어야 합니다(npm install unpdf). 래스터 이미지(벡터 그래픽/다이어그램)가 없으면 전체 페이지를 PNG로 렌더링합니다. 전체 페이지가 필요하면 render_pdf_pages를 사용하십시오.",
  "tools.extractPdfImages.paramPath": "볼트 내 PDF의 경로.",
  "tools.extractPdfImages.paramPages": "페이지 (예: '49-54', '27,30').",
  "tools.extractPdfImages.paramOutputFolder": "출력 폴더 (선택 사항).",
  "tools.extractPdfImages.error.pathAndPages": "오류: 경로와 페이지가 필요합니다.",
  "tools.extractPdfImages.multiplePdfs": "일치하는 여러 PDF가 있습니다. 정확한 경로를 지정하십시오.",
  "tools.extractPdfImages.error.notFound": "오류: \"{path}\"가 존재하지 않습니다.",
  "tools.extractPdfImages.error.invalidRange": "오류: 잘못된 범위: \"{range}\".",
  "tools.extractPdfImages.error.outOfRange": "오류: 페이지가 범위를 벗어났습니다(총 {pages}페이지).",
  "tools.extractPdfImages.result": "{pages}페이지에서 {count}개 이미지 추출됨:\n{results}",
  "tools.extractPdfImages.fullPage": "🖼️ {path} (전체 페이지)",
  "tools.extractPdfImages.warnRenderFailed": "⚠️ {page}페이지: 렌더링 실패",
  "tools.extractPdfImages.error.canvas": "❌ {page}페이지: 캔버스를 생성할 수 없음",
  "tools.extractPdfImages.error.generic": "오류: {error}",

  // Tool: get_vault_stats
  "tools.getVaultStats.description": "볼트 통계를 반환합니다: 노트 수, 총 크기, 폴더.",
  "tools.getVaultStats.stats": "노트: {notes}\n총 크기: ~{size}\n폴더: {folders}",

  // Tool: get_active_file
  "tools.getActiveFile.description": "편집기에서 현재 열려 있는 파일의 내용을 반환합니다.",
  "tools.getActiveFile.noFileOpen": "현재 열려 있는 파일이 없습니다.",
  "tools.getActiveFile.error": "오류: {error}",

  // Tool: get_frontmatter
  "tools.getFrontmatter.description": "노트에서 프론트매터(YAML 메타데이터)를 추출합니다.",
  "tools.getFrontmatter.paramPath": "노트의 경로.",
  "tools.getFrontmatter.error.notFound": "오류: \"{path}\"가 존재하지 않습니다.",
  "tools.getFrontmatter.noFrontmatter": "프론트매터가 없습니다.",
  "tools.getFrontmatter.error.generic": "오류: {error}",

  // Tool registry
  "tools.registry.errorExecute": "\"{name}\" 도구 실행 오류: {error}",
  "tools.registry.errorNotFound": "\"{name}\" 도구가 등록되지 않았습니다",

  // Errors
  "errors.unknown": "알 수 없는 오류",
  "errors.fetchFailed": "가져오기 실패",

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
  "labels.unknown": "알 수 없는 오류",
  "labels.proLocked": " (🔒 Pro)",
  "labels.notSupported": " (⚠️ 지원되지 않음)",
  "labels.pro": " (Pro)",
  "labels.embeddings": "임베딩",
  "labels.vision": "비전",
  "labels.lmStudio": "LM Studio",
};
