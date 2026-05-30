# Copilot Personal v1.4.1 — Obsidian AI Agent Plugin

Asistente de IA para Obsidian. Chat multimodal con streaming real, RAG, agente autónomo (17 herramientas), 11 proveedores LLM, multi-provider fallback, PDFs con `unpdf`, licencias Free/Pro con validación cloud + grace period, CircuitBreaker, dual-build (store/obfuscated). 151 tests. TypeScript strict mode.

---

## Índice
- [Características principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Modo Agente](#modo-agente)
  - [Flujo de ejecución](#flujo-de-ejecución)
  - [ToolRouter — Clasificación LLM de tareas](#toolrouter--clasificación-llm-de-tareas)
  - [Estimación de iteraciones](#estimación-de-iteraciones)
  - [DECIDE NOW — decisión binaria forzada](#decide-now--decisión-binaria-forzada)
  - [Mecanismos anti-loop](#mecanismos-anti-loop)
  - [PlanTracker — estado interno de ejecución](#plantracker--estado-interno-de-ejecución)
- [Herramientas del agente](#herramientas-del-agente)
  - [Categorías de herramientas](#categorías-de-herramientas)
  - [PDF: lectura, renderizado y extracción](#pdf-lectura-renderizado-y-extracción)
  - [Imágenes y visión](#imágenes-y-visión)
  - [Auto-save y post-procesamiento](#auto-save-y-post-procesamiento)
- [Gestión de contexto](#gestión-de-contexto)
  - [ContextCompactor](#contextcompactor)
  - [ContextLayers](#contextlayers)
  - [ContextPills (eliminado)](#contextpills-eliminado)
- [Model-Specific Adapters](#model-specific-adapters)
- [Native Tool Calling](#native-tool-calling)
- [RAG — Búsqueda Semántica](#rag--búsqueda-semántica)
- [Settings](#settings)
- [Comandos y atajos](#comandos-y-atajos)
- [Desarrollo](#desarrollo)
- [Tests](#tests)

---

## Características principales

| Capacidad | Descripción |
|-----------|-------------|
| **Chat multimodal** | Chat streaming real (fetch + ReadableStream) con drag & drop de archivos |
| **Modo Agente** | Tool-calling loop autónomo con 17 herramientas, clasificación LLM, anti-loop, plan tracker |
| **RAG semántico** | Indexación del vault con embeddings, búsqueda por similitud coseno, persistencia JSON |
| **PDF avanzado** | Lectura de texto, renderizado de páginas a PNG, extracción de imágenes con `unpdf` |
| **11 proveedores LLM** | DeepSeek, OpenAI, Anthropic, Gemini, LM Studio, OpenRouter, Mistral, Groq, Perplexity, xAI |
| **Multi-Provider Fallback** | Compensación automática de capacidades (Pro) — ej: DeepSeek chat + LM Studio embeddings |
| **Licencias Free/Pro** | HMAC-SHA256, fingerprint binding, rate limiting (50/día free), ofuscación del bundle |
| **CircuitBreaker** | 3 fallos → 30s open + backoff exponencial en todos los providers |
| **Auto-save inteligente** | Detección multi-nota, validación de wiki-links inventados, guardado automático |
| **Slash commands** | `/summarize`, `/translate`, `/explain`, `/toc`, `/flashcards`, `/rewrite`, `/expand` |
| **Export chat** | Markdown + JSON vía comandos (Ctrl+P) |
| **Model adapters** | System prompts optimizados por modelo (DeepSeek anti-verbose, LM Studio anti-hallucination) |
| **Gestión de contexto** | Map-Reduce compaction, capas L1-L5, auto-trim, CURRENT TASK reminder |
| **Session recovery** | Crash recovery en sessionStorage cada 30s |

---

## Arquitectura

```
src/
├── main.ts                          # Plugin entry point
├── settings.ts                      # Settings interface & defaults
├── settingsTab.ts                   # Settings UI tab
├── chatView.ts                      # Chat ItemView (orquestador principal)
├── constants.ts                     # 39 constantes centralizadas
│
├── LLMProviders/
│   ├── providerTypes.ts             # LLMProvider interface, ToolDefinition, ProviderConfig
│   ├── providerManager.ts           # Factory: auto-detect & switch providers
│   ├── deepseekProvider.ts          # DeepSeek (OpenAI-compatible + thinking mode)
│   ├── openaiProvider.ts            # OpenAI / OpenAI-compatible APIs
│   └── anthropicProvider.ts         # Anthropic Messages API
│
├── agent/
│   ├── ToolRegistry.ts              # Singleton: register, get, execute tools
│   ├── AgentModeRunner.ts           # Tool-calling loop principal
│   ├── ToolRouter.ts                # Clasificación LLM de tareas → selección de tools
│   ├── PlanTracker.ts               # Estado interno de ejecución (pasos completados/pendientes)
│   ├── ContextCompactor.ts          # Map-Reduce summarization del contexto
│   └── ContextLayers.ts             # Sistema de capas de contexto L1-L5
│
├── tools/
│   ├── FileParserManager.ts         # PDF, image, text file parsers
│   ├── fileSearchTool.ts            # find_files
│   ├── readNoteTool.ts              # read_note (4 estrategias de búsqueda + auto-find)
│   ├── createNoteTool.ts            # create_note
│   ├── updateNoteTool.ts            # update_note (verificación post-escritura)
│   ├── readPdfTool.ts               # read_pdf (TOC + páginas + auto-find)
│   ├── renderPdfPagesTool.ts        # render_pdf_pages (páginas a PNG)
│   ├── extractPdfImagesTool.ts      # extract_pdf_images (imágenes individuales + fallback)
│   ├── imageAnalysisTool.ts         # analyze_image (modelo de visión)
│   ├── timeSearchTool.ts            # search_vault_by_timeframe
│   ├── semanticSearchTool.ts        # search_vault_semantic
│   ├── youtubeTranscriptTool.ts     # extract_youtube_transcript
│   ├── webSearchTool.ts             # search_web
│   ├── additionalTools.ts           # list_notes, search_vault_fulltext, get_vault_stats, get_active_file, get_frontmatter
│   └── pdfWorkerUri.ts             # Worker de pdfjs-dist embebido (1.7MB auto-generado)
│
├── search/
│   ├── vectorStoreManager.ts        # In-memory cosine similarity + persistencia JSON
│   ├── indexOperations.ts           # Chunking, embedding, batch indexing
│   ├── indexEventHandler.ts         # Auto-reindex en create/modify/delete (con unregister)
│   ├── hybridRetriever.ts           # Búsqueda híbrida (vector + fulltext)
│   └── reranker.ts                  # Re-ranking de resultados
│
├── components/
│   ├── ChatHistoryBrowser.ts        # Navegador de historial de chats
│   └── ApplyView.ts                 # Vista de diff para <!--save:-->
│
├── services/
│   ├── webSearchClient.ts           # HTTP client para microservicio Python
│   └── lmStudioService.ts           # LM Studio model detection (/v1/models)
│
├── memory/
│   └── MemoryManager.ts             # Resúmenes de conversación persistente
│
└── utils/
    └── pathUtils.ts                 # Normalización de paths, umlauts alemanes

web_search_server/
├── main.py                          # FastAPI server wrapping browser-use
└── requirements.txt                 # Python dependencies
```

---

## Modo Agente

El modo agente es el núcleo del plugin. Permite al LLM usar herramientas autónomamente para leer notas, buscar en el vault, analizar PDFs, crear/modificar notas, y más.

### Flujo de ejecución

```
1. El usuario envía una query
2. buildContext() construye el contexto (historial + RAG)
3. ToolRouter.route() clasifica la query → devuelve solo las tools necesarias
4. AgentModeRunner.run() inicia el bucle:
   ┌─────────────────────────────────────────────────┐
   │  system prompt (model-specific)                 │
   │  + CURRENT TASK (query del usuario)             │
   │  + ACTIVE TOOL CATEGORIES                       │
   │  + PLAN (si existe)                             │
   │  + tool-specific custom instructions            │
   │  + DECIDE NOW prompt                            │
   └─────────────────────────────────────────────────┘
                    ↓
   LLM recibe tools nativas (si el provider lo soporta)
                    ↓
   Modelo responde: tool_call JSON o respuesta final
                    ↓
   parseResponse() extrae tool calls del texto
                    ↓
   ┌─ tool_call encontrado → ejecutar tool → resultado → DECIDE NOW → loop
   └─ sin tool_call → ¿planning text? → corregir → loop
                    → ¿final answer? → devolver al usuario
```

### ToolRouter — Clasificación LLM de tareas

El `ToolRouter` clasifica la query del usuario para determinar qué herramientas necesita. NO usa regex frágiles — usa al propio LLM como clasificador primario.

**Clasificación LLM (primaria):**
```
Query → LLM (10-20 tokens) → ["read", "write", "search", "media"]
```
El prompt de clasificación incluye ejemplos en español e inglés y maneja variaciones lingüísticas (poblar, pobla, pobles, puebla — todos se clasifican como "write").

**Fast-path (ahorro de tokens):**
Solo para el caso inequívoco de lista de `[[wikilinks]]` con verbo "crea/genera" → `["write"]` directo, sin llamada al LLM.

**Categorías de herramientas:**

| Categoría | Tools incluidas | Cuándo se activa |
|-----------|-----------------|------------------|
| `read` | read_note, read_pdf, get_active_file, get_frontmatter | Leer contenido |
| `write` | create_note, update_note | Crear/modificar notas |
| `search` | find_files, list_notes, search_vault_fulltext, get_vault_stats | Buscar en vault |
| `semantic` | search_vault_semantic, search_vault_by_timeframe | Búsqueda semántica |
| `web` | search_web | Búsqueda en internet |
| `media` | analyze_image, extract_youtube_transcript, render_pdf_pages, extract_pdf_images | Imágenes/PDF/YouTube |

Solo las tools de las categorías seleccionadas se envían al LLM, ahorrando entre un 70-90% de tokens en definiciones de herramientas.

### Estimación de iteraciones

El sistema estima automáticamente cuántas iteraciones necesitará la tarea:

```
items = detectar elementos en la query (wikilinks, bullets, comas, líneas)
iterPerItem = según categorías:
  write only          → 1
  read + PDF          → 2
  search + PDF        → 3
  + media             → +1

estimatedIterations = items × iterPerItem + 3 (overhead)
                    = clamp(mínimo=defaultMax, máximo=40)
```

Ejemplo: "crea notas para 31 [[wikilinks]]" → 31 × 1 + 3 = 34 iteraciones.

### DECIDE NOW — decisión binaria forzada

Después de cada tool result, el sistema inyecta un prompt de decisión binaria:

```
⚠️ DECIDE NOW:
(A) Still need data? → {"tool_call": {...}}
(B) ALL sources read AND links verified? → final answer
Checklist: PDF read? ☐  Links verified? ☐  Content saved? ☐
```

Esto fuerza al modelo a elegir entre actuar o responder, eliminando el espacio para "planning text" intermedio.

### Mecanismos anti-loop

1. **looksLikePlanning()**: Detecta texto de planificación en español e inglés ("Voy a leer...", "Let me check...", "Ahora necesito..."). Si se detecta, inyecta corrección y reloop.

2. **Repetition detector**: Si el mismo texto de planificación aparece 2 veces seguidas → fuerza conclusión.

3. **Correction limit**: Máximo 2 correcciones de planificación por run. La tercera → anti-stuck forzado (tools disabled, raw model synthesis).

4. **alreadyReadCount**: Si el modelo re-lee/re-renderiza archivos ya procesados → acelera el anti-stuck.

5. **Early force**: A partir de `iterations > maxIter - 2`, se fuerza síntesis sin tools si el modelo sigue atascado.

### PlanTracker — estado interno de ejecución

Mantiene el estado de ejecución entre iteraciones:

```
PLAN (2/4 done, 2 remaining)
Goal: poblar notas 02_03_01 con PDF págs 56-68
 ✓ 1. read_note reference
 ✓ 2. read_pdf pages 56-68
 → 3. create_note 02_03_01_Mensch
 · 4. create_note 02_03_01_01_Rahmenbedingungen
```

- Avanza automáticamente tras cada tool execution
- Detecta desviaciones del plan
- Fuerza final answer cuando todos los pasos están completos

---

## Herramientas del agente

### Categorías de herramientas

| Herramienta | Categoría | Función |
|-------------|-----------|---------|
| `read_note` | read | Lee nota con 4 estrategias de búsqueda + auto-find + normalización de umlauts alemanes |
| `read_pdf` | read | Extrae texto de PDF con TOC/páginas + auto-find |
| `get_active_file` | read | Contenido del archivo abierto en el editor |
| `get_frontmatter` | read | Extrae metadatos YAML de una nota |
| `create_note` | write | Crea nota con verificación post-creación |
| `update_note` | write | Actualiza nota con verificación de contenido escrito |
| `find_files` | search | Busca archivos por nombre (acepta `nameQuery` y `query`) |
| `list_notes` | search | Lista notas en una carpeta |
| `search_vault_fulltext` | search | Búsqueda de texto exacto en todas las notas |
| `get_vault_stats` | search | Estadísticas del vault |
| `search_vault_semantic` | semantic | Búsqueda semántica por embeddings |
| `search_vault_by_timeframe` | semantic | Notas modificadas entre dos fechas |
| `search_web` | web | Búsqueda web con browser-use |
| `analyze_image` | media | Análisis de imágenes con modelo de visión |
| `extract_youtube_transcript` | media | Transcripción de videos de YouTube |
| `render_pdf_pages` | read, media | Renderiza páginas de PDF a PNG |
| `extract_pdf_images` | read, media | Extrae imágenes individuales de PDF + fallback a página completa |

### PDF: lectura, renderizado y extracción

**read_pdf** — Extracción de texto:
- `tocOnly: true` → solo índice/TOC
- `pagesOnly: "56-68"` → páginas específicas
- Sin parámetros → texto completo
- Auto-find: si el path no existe, busca en todo el vault
- Clasificación TOC mejorada: detecta tablas de contenido reales (dot leaders, keywords) sin falsos positivos en texto académico

**render_pdf_pages** — Páginas a PNG:
- Renderiza páginas a 144 DPI (escala 2x) usando canvas nativo de Electron
- Guarda en carpeta `_images/` junto al PDF
- Devuelve rutas exactas para `![[embeds]]`

**extract_pdf_images** — Imágenes individuales:
- Extrae imágenes raster (JPG, PNG, GIF, WebP) incrustadas en el PDF
- Detecta formato por magic bytes
- FALLBACK AUTOMÁTICO: para páginas sin imágenes raster, renderiza la página completa como PNG

### Imágenes y visión

**analyze_image**:
- Envía imágenes en base64 al modelo de visión configurado
- Usa `settings.lmStudioModel` para LM Studio, `settings.visionModel` para cloud
- No requiere etiqueta "VL" en el nombre del modelo — intenta con cualquier modelo configurado

### Auto-save y post-procesamiento

**Auto-save de notas no guardadas:**
Cuando el modelo escribe contenido de nota en el chat sin usar `<!--save:-->` ni `update_note`, el sistema:
1. Detecta headings `#` que parecen títulos de nota
2. Divide la respuesta en secciones (`splitNoteSections`)
3. Busca cada nota en el vault por número de capítulo (anclado al inicio del basename)
4. Guarda cada sección en su archivo correspondiente
5. Reporta: `📝 Auto-guardado 3/3 notas`

**Validación de wiki-links:**
Después de cada respuesta:
1. Extrae todos los `[[...]]` del contenido
2. Verifica contra `getFiles()` del vault (no solo `.md`, también imágenes)
3. Los links inventados se **eliminan** del contenido (convertidos a texto plano)
4. Los links a imágenes (`.png`, `.jpg`) se validan correctamente (no son falsos positivos)

**fixWikiLinks:**
Convierte automáticamente links Markdown `[texto](url)` a formato wiki `[[texto]]` para cualquier link que no sea URL web.

---

## Gestión de contexto

### ContextCompactor

Map-Reduce summarization del contexto cuando excede 20,000 tokens:
- Solo compacta mensajes `assistant` > 1000 chars
- NUNCA compacta tool results (causan alucinación)
- Preserva últimos 8 mensajes
- No compacta en las primeras 2 iteraciones (datos frescos)
- Fallback: `cleanContext()` preserva 6 tool results si el compactor falla

### ContextLayers

Sistema de capas L1-L5:
- L1: System prompt (fijo)
- L2: Hechos extraídos de la conversación (auto-promoted cada 3 turnos)
- L3: Mensajes recientes (últimos 6)
- L4: Herramientas activas
- L5: Tool results actuales

Auto-promoción L3→L2: extrae hechos clave de mensajes > 100 chars y los fusiona en L2 (máx 3000 chars).

### Messages auto-trim

Cuando `this.messages` excede 200 entradas, se trunca a las últimas 100 con un marcador `[N older messages trimmed]`.

### CURRENT TASK

La query actual del usuario se inyecta en el system prompt como `CURRENT TASK (do NOT lose focus): ...` y también en cada tool result como `[REMINDER: your task is: ...]`. Esto evita que el modelo pierda el foco en ejecuciones largas.

### Separación de turnos

Las respuestas del asistente de turnos anteriores se prefijan con `[PREVIOUS TURN RESPONSE — for context only, do NOT re-execute]` para evitar que el modelo confunda tareas de distintos turnos.

---

## Model-Specific Adapters

Cada familia de modelos recibe instrucciones específicas para sus fallos conocidos (inspirado en obsidian-copilot-master):

| Provider | Instrucciones específicas |
|----------|--------------------------|
| **DeepSeek** | Anti-verbose ("Be CONCISE"), anti-planning text ("NEVER output 'Voy a...'"), "STOP after tool calls", resistir tendencia a escribir respuestas completas en vez de tool calls |
| **LM Studio** | Anti-hallucination ("ONLY write facts from tool results, never from training data"), "go straight to action", "if unsure, call the tool anyway" |
| **OpenAI** | "Use tools aggressively", "be concise in final answers" |
| **Generic** | "If you write 'Voy a...' you are WRONG. Output the JSON instead." |

---

## Native Tool Calling

Cuando el proveedor lo soporta (DeepSeek, OpenAI, LM Studio con Qwen), las definiciones de herramientas se pasan como parámetro `tools` en la request HTTP, usando el formato nativo de function-calling del API. Esto es más fiable que embeber JSON en el system prompt porque el modelo está específicamente fine-tuneado para este formato.

Cuando el modelo responde con tool calls nativos, `parseResponse` los detecta en el formato `{"tool_calls": [...]}` y los convierte al formato interno.

---

## RAG — Búsqueda Semántica

1. **Indexación**: `IndexOperations.indexVaultToVectorStore()` divide cada nota en chunks de ~500 tokens con 10% de solapamiento, genera embeddings con el modelo configurado, y persiste en `.obsidian/copilot-personal-index.json`.

2. **Búsqueda**: `search_vault_semantic` genera el embedding de la query y busca por similitud coseno en `VectorStoreManager`. Resultados filtrados por threshold (0.3).

3. **Auto-reindex**: `IndexEventHandler` reindexa automáticamente archivos al crearlos, modificarlos o eliminarlos. Los listeners se limpian con `unregister()` al recargar el plugin.

4. **Búsqueda híbrida**: `HybridRetriever` combina vector search (70% peso) con fulltext search (30% peso). `Reranker` reordena resultados por relevancia.

5. **Rate limiter**: Controla la tasa de llamadas al API de embeddings.

---

## Settings

### API Configuration
| Campo | Descripción | Default |
|-------|-------------|---------|
| API Key | Clave de API | (vacío) |
| API URL | Endpoint base | `https://api.deepseek.com` |
| Provider | Auto-detect / manual | Auto |

### Model Configuration
| Campo | Default |
|-------|---------|
| Chat Model | `deepseek-v4-flash` |
| Embedding Model | `deepseek-embedding` |
| Vision Model | `deepseek-v4-flash` |
| Max Tokens | 4096 |
| Temperature | 0.7 |
| Top P | 0.8 |
| Top K | 20 |
| Presence Penalty | 1.5 |
| Enable Thinking | OFF |
| Reasoning Effort | high |

### Semantic Search
- `enableSemanticSearch`: false
- `maxSourceChunks`: 5
- `chunkSize`: 500
- `excludedFolders`: "" (separadas por coma)

### Web Search
- `webSearchEnabled`: false
- `webSearchServerUrl`: `http://localhost:8000/search`
- `webSearchMaxResults`: 3

### Vision
- `visionEnabled`: false
- `enableImageDrop`: true

### Agent Mode
- `enableAgentMode`: false
- `agentMaxIterations`: 8 (auto-escalado por el estimator)

### LM Studio
- `lmStudioUrl`: `http://localhost:1234/v1`
- `lmStudioModel`: `qwen2.5-vl-27b-instruct`
- `lmStudioApiKey`: "" (opcional)

### Memory
- `memoryEnabled`: true
- `memoryFolder`: `copilot/memory`
- `maxMemories`: 3

### Chat
- `saveChatHistory`: false
- `chatHistoryFolder`: `copilot-chats`
- `contextTurns`: 5
- `streamEnabled`: true

---

## Comandos y atajos

### Comandos
| Comando | Descripción |
|---------|-------------|
| `Open Copilot Chat` | Abre el panel de chat |
| `Send selection to Copilot` | Envía el texto seleccionado al chat |
| `Copilot: Index vault for semantic search` | Indexa todas las notas del vault |
| `Copilot: Clear semantic search index` | Borra el índice |
| `Copilot: New chat` | Nueva conversación |
| `Copilot: Save chat to file` | Guarda chat como nota |
| `Copilot: Quick Ask` | Ventana modal rápida |

### Botones del chat
| Botón | Función |
|-------|---------|
| **Agent** | Activa/desactiva modo agente |
| **Think** | Activa/desactiva thinking mode |
| **New** | Limpiar conversación |
| **Save** | Guardar chat como nota |

### Atajos
- `Enter` → Enviar mensaje
- `Shift+Enter` → Nueva línea
- Arrastrar `.md`/`.pdf`/`.png`/`.jpg` al chat

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Build para distribución externa (ofuscado — ZIP, Gumroad, BRAT)
npm run build

# Build para tienda oficial (limpio — PR a Obsidian Community Plugins)
npm run build:store

# Solo type-check
npm run typecheck

# Modo watch
npm run dev

# Tests
npx jest --verbose
```

> ⚠️ **Para publicar en Obsidian Community Plugins:** usa EXCLUSIVAMENTE `npm run build:store`.  
> El build ofuscado (`npm run build`) será rechazado por los revisores. La ofuscación es solo para distribución externa.

### Dependencias
- `obsidian` — API de Obsidian
- `pdfjs-dist` — Extracción de texto + renderizado de PDFs
- `youtube-transcript` — Transcripciones de YouTube
- `esbuild` — Bundler
- `jest` / `ts-jest` — Tests

### Tests
151 tests en 16 suites cubriendo:

| Suite | Cobertura |
|-------|-----------|
| `agentRunner.test.ts` | Loop de tool-calling, parseResponse, events, maxIterations, system prompt merge, error handling |
| `toolRegistry.test.ts` | Singleton, register/get/execute, formatos OpenAI, overwrite, resetInstance |
| `tools.test.ts` | search_vault, semantic_search, web_search, create_note, youtube_transcript |
| `readWriteTools.test.ts` | 4 estrategias de read_note, auto-append .md, case-insensitive, update_note verification, create_note duplicate |
| `readPdfTool.test.ts` | Registro, parsePageRange, isTOClike classification |
| `vectorStore.test.ts` | CRUD, cosine similarity (idéntico/ortogonal/cero/longitudes dispares), search con threshold, clear, index status |
| `indexOperations.test.ts` | Chunking con overlap, index vault, skip ya indexado, excluded folders, searchSimilar, indexFile |
| `lmStudio.test.ts` | Auto-detección, chat/embedding API, model detection, isReachable |
| `providerManager.test.ts` | Auto-detección por URL, override, runtime switch, updateSettings |
| `agentDetection.test.ts` | looksLikePlanning (ES/EN), hallucinated completion claims, sanitizeAgentResponse, looksLikeCompletionClaim |
| `singletonReset.test.ts` | ToolRegistry, VectorStoreManager, WebSearchClient resetInstance |
| `chatFlow.test.ts` | LLMMessage types, context builder, RAG chunks, system message filtering |
| `settings.test.ts` | DEFAULT_SETTINGS fields, merge, providerType validation |
| `circuitBreaker.test.ts` | CircuitBreaker: open/close, backoff, reset, rate limit detection |
| `licenseManager.test.ts` | LicenseManager: key validation, tier gating, rate limiting, fingerprint, persistence |

---

## Instalación

### 1. Plugin de Obsidian
```bash
cd .obsidian/plugins/copilot-personal
npm install
npm run build
```
Activar en Settings → Community plugins → Copilot Personal.

### 2. Microservicio de búsqueda web (opcional)
```bash
cd web_search_server
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. LM Studio (opcional)
Descargar [LM Studio](https://lmstudio.ai/), cargar modelo de chat (`qwen3.6-35b-a3b`), modelo de embedding (`text-embedding-nomic-embed-text-v1.5`), y opcionalmente modelo de visión (`qwen2.5-vl-27b-instruct`). Iniciar servidor en `http://localhost:1234`.

---

## Privacy & Security

- **API keys:** Stored locally in `data.json` within the plugin folder. Each provider has its own key field — switching from DeepSeek to Gemini won't leak your key. Never sent to any server other than the LLM provider you configure. The field is masked (`type="password"`) in settings UI.
- **Vault data:** Sent to your configured LLM provider for chat and embeddings. No data is sent to the plugin author's servers.
- **Web search:** Requires a local Python microservice (`web_search_server/`). Authentication token is configurable in settings (no longer hardcoded). No external server dependency.
- **License validation:** Pro license keys (Lemon Squeezy UUID format) are validated against the Cloudflare Worker at `copilot-personal-worker.copilot-personal.workers.dev`. Free tier requires no internet connection.
- **Path traversal:** Multi-layer protection against directory escape attacks in file reading tools.
- **No telemetry, no analytics, no tracking.**

## Licencia

UNLICENSED
