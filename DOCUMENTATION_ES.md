# Copilot Personal — Documentación v1.6.1

> Asistente de IA con capacidades agentivas avanzadas para Obsidian. Chat multimodal con streaming real, RAG semántico, agente autónomo (17 herramientas), 11 proveedores LLM con tool calling nativo y fallback multi-proveedor, renderizado de PDFs con `unpdf`, sistema de licencias Free/Pro con validación cloud + grace period, CircuitBreaker en todos los providers, dual-build (store limpio / distribution ofuscado), y auto-guardado inteligente de notas. 385 tests.

---

## Índice

1. [Instalación](#1-instalación)
2. [Licencias Free vs Pro](#2-licencias-free-vs-pro)
3. [Configuración inicial](#3-configuración-inicial)
4. [Uso del chat](#4-uso-del-chat)
5. [Slash commands](#5-slash-commands)
6. [Modo Agente](#6-modo-agente)
7. [Herramientas del agente](#7-herramientas-del-agente)
8. [Trabajar con PDFs](#8-trabajar-con-pdfs)
9. [Búsqueda semántica (RAG)](#9-búsqueda-semántica-rag)
10. [Exportar conversaciones](#10-exportar-conversaciones)
11. [Comandos de Obsidian](#11-comandos-de-obsidian)
12. [Privacidad y seguridad](#12-privacidad-y-seguridad)
13. [Resolución de problemas](#13-resolución-de-problemas)
14. [Atajos de teclado](#14-atajos-de-teclado)
15. [Roadmap](#15-roadmap)

---

## 1. Instalación

### Requisitos
- Obsidian v1.0.0 o superior
- Node.js 18+ (solo para desarrollo)
- Para funciones locales: [LM Studio](https://lmstudio.ai/) con un modelo cargado
- Para PDFs: sin dependencias adicionales (pdfjs-dist incluido)

### Instalación rápida

```bash
# 1. Navega a la carpeta de plugins de tu vault
cd "TuVault/.obsidian/plugins"

# 2. Clona el repositorio
git clone https://github.com/JosefBelzer/copilot-personal.git

# 3. Instala dependencias y compila
cd copilot-personal
npm install
npm run build

# 3b. (Opcional) Para extraer imágenes de PDFs:
npm install unpdf

### Build modes
```bash
npm run build          # main.js ofuscado (distribución externa: ZIP, Gumroad, BRAT)
npm run build:store    # main.js limpio (PR a Obsidian Community Plugins)
npm run dev            # Dev mode con sourcemaps y watch
```

> ⚠️ **IMPORTANTE:** Para publicar en la tienda oficial de Obsidian, **SIEMPRE** usa `npm run build:store`. El build ofuscado (`npm run build`) será **RECHAZADO** por los revisores. La ofuscación es solo para distribución externa (Gumroad, ZIP, BRAT) para proteger la propiedad intelectual.

# 4. Recarga Obsidian (Ctrl+Shift+I → Console → location.reload())
```

### Instalación manual
1. Descarga el ZIP desde [Releases](https://github.com/JosefBelzer/copilot-personal/releases)
2. Extrae en `TuVault/.obsidian/plugins/copilot-personal/`
3. Activa el plugin en Settings → Community plugins → Copilot Personal

### Servidor de búsqueda web (opcional)
```bash
cd web_search_server
pip install -r requirements.txt
# Configura el token compartido (debe coincidir con el del plugin)
set COPILOT_WEB_TOKEN=tu-token-seguro
uvicorn main:app --host 127.0.0.1 --port 8000
```

> ⚠️ **Importante:** Configura un token seguro tanto en el servidor (`COPILOT_WEB_TOKEN`) como en el plugin (Settings → Web Search → Web search token). El valor por defecto `copilot-default-token-change-me` es inseguro.

---

## 2. Licencias Free vs Pro

### 🆓 Free (por defecto)
- Chat básico ilimitado (trae tu propia API key)
- Sin límite de mensajes en tu proveedor preferido
- 3 herramientas: `read_note`, `read_pdf`, `find_files`
- **💰 Copilot AI Free Trial** — 5 consultas/día. Sin API key. Selecciona **💰 Copilot AI** del dropdown de providers. Prueba funciones Pro (modo agente, herramientas inteligentes) antes de comprar.
- Sin agent mode · Sin web search · Sin imágenes PDF · Sin RAG semántico
- Las opciones Pro aparecen **deshabilitadas** (🔒) en la UI de settings

### ⭐ Pro ($4.99/mes vía Lemon Squeezy)
- **Mensajes ilimitados** · **Agent mode** (17 herramientas)
- **Web search** · **PDF con imágenes** · **RAG semántico**
- **Export chat** (MD/JSON) · **Slash commands** · Soporte prioritario
- **Multi-provider fallback** · **API keys por proveedor**
- **💰 Copilot AI (incluido)** — Proveedor de IA gestionado integrado. 50 consultas/día. Sin API key. Modo agente soportado.

### 💰 Copilot AI — Proveedor de Presupuesto

**Free Trial (5 consultas/día):** Cualquier usuario puede seleccionar **💰 Copilot AI** del dropdown de providers — sin API key, sin licencia, sin configuración. Experimenta las capacidades Pro sin riesgo antes de actualizar.

**Pro (50 consultas/día):** Incluido con Pro sin costo extra. Selecciona **💰 Copilot AI (Pro)** en el dropdown. Control de uso por servidor (Cloudflare Worker) y compartido entre dispositivos.

> ⚠️ **El modo agente aumenta el consumo.** Cada paso del agente cuenta como una consulta. Una tarea de 3 pasos = 3 consultas. Usa el agente para tareas complejas y chat simple para preguntas rápidas.

> 🌐 **Idiomas soportados:** Inglés, Español, Francés, Alemán, Italiano, Portugués, Chino, Japonés, Coreano, Árabe, Hindi (11 idiomas). Para otros idiomas de la UI, el asistente responde en inglés.

### Activar Pro
1. Compra una suscripción Pro en [belzersoftware.lemonsqueezy.com](https://belzersoftware.lemonsqueezy.com/checkout/buy/85655f95-93f7-4649-954a-8bc62472f302)
2. Recibirás tu **License Key** por email (formato UUID de Lemon Squeezy, ej: `056b9494-...`)
3. Settings → Copilot Personal → License Key → pega la key
4. Verás `✅ Licencia Pro activada correctamente.`
5. El badge en chat cambia a `⭐ Pro`
6. Todas las opciones Pro se desbloquean automáticamente en settings

> **Key de prueba:** `COPIPRO-DEMO-DEMO-DEMO` (solo en modo debug — `COPILOT_DEBUG=1`).

### 🔒 Seguridad de licencias

| Mecanismo | Descripción |
|-----------|-------------|
| **Validación cloud** | Cada activación se verifica contra el Cloudflare Worker en `copilot-personal-worker.copilot-personal.workers.dev` |
| **Device binding** | La licencia se asocia a tu dispositivo (vía fingerprint). Máximo 3 dispositivos por licencia |
| **Grace period** | Si no hay internet, la licencia Pro sigue funcionando 24h antes de degradar a Free |
| **Persistencia anti-reinicio** | El contador de mensajes y estado de licencia se guardan en `data.json` |
| **Anti-sharing** | Límite de 3 dispositivos por licencia. Cambiar de dispositivo frecuentemente dispara protecciones |
| **Demo restringida** | Solo funciona en modo desarrollo (`COPILOT_DEBUG=1`) |

---

## 3. Configuración inicial

### Paso 1: Elige tu proveedor

| Opción | Recomendado para | Configuración |
|--------|-----------------|---------------|
| **🔒 LM Studio (local)** | Privacidad total, sin API key | Inicia LM Studio, carga un modelo, URL: `http://localhost:1234/v1` |
| **☁️ DeepSeek (cloud)** | Mejor rendimiento, barato | API key desde [platform.deepseek.com](https://platform.deepseek.com) |
| **☁️ OpenAI** | GPT-4o, tareas complejas | API key desde [platform.openai.com](https://platform.openai.com) |
| **☁️ Anthropic** | Claude Sonnet/Opus | API key desde [console.anthropic.com](https://console.anthropic.com) |
| **☁️ Gemini** | Google, multi-modal | API key desde [aistudio.google.com](https://aistudio.google.com) |

### Proveedores soportados (11) — Capacidades reales

| Provider | Chat | Streaming | Embeddings | Vision | Tool Calling | Thinking |
|----------|:----:|:---------:|:----------:|:------:|:------------:|:--------:|
| DeepSeek | ✅ | ✅ Real | ✅ | ✅ | ✅ | ✅ |
| OpenAI | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |
| Anthropic | ✅ | ✅ Real | ❌ | ✅ | ✅ | ❌ |
| Gemini | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |
| Mistral | ✅ | ✅ Real | ✅ | ✅ (Pixtral) | ✅ | ❌ |
| xAI (Grok) | ✅ | ✅ Real | ❌ | ✅ (Grok‑1.5V) | ✅ | ❌ |
| Groq | ✅ | ✅ Real | ❌ | ❌ | ✅ | ❌ |
| Perplexity | ✅ | ✅ Real | ❌ | ❌ | ✅ | ❌ |
| OpenRouter | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |
| LM Studio | ✅ | ✅ Real | ✅ | ✅ | ✅ | ❌ |

> 💡 **Tool calling nativo:** OpenAI, Anthropic (input_schema), Gemini (functionDeclarations) — cada uno usa el formato específico de su API.
> 💡 **Streaming real:** fetch + ReadableStream en todos los providers.
> 💡 **Settings inteligentes:** Los campos no soportados por el provider se deshabilitan automáticamente en Settings.

### 🔄 Multi-Provider Fallback (Pro)

Si tu proveedor principal no soporta ciertas capacidades, puedes configurar un **segundo proveedor** para compensar:

| Proveedor → Carece de | Fallback típico | Configuración |
|-----------------------|-----------------|---------------|
| **Anthropic** → Embeddings | LM Studio (`nomic-embed-text`) | Settings → Multi-Provider Fallback |
| **Groq** → Embeddings, Vision | LM Studio | Ambos fallbacks a LM Studio |
| **Perplexity** → Embeddings, Vision | LM Studio | Igual que Groq |
| **DeepSeek** → (nada, opcional) | LM Studio (ahorro costes) | Configurar ambos fallbacks para usar local |

**Cómo funciona:** El sistema detecta automáticamente qué capacidades le faltan a tu proveedor principal y redirige esas tareas al proveedor de fallback configurado. El chat siempre usa el proveedor principal. *Requiere licencia Pro.*

### Paso 2: Configura tu API Key
1. Ve a Settings → Copilot Personal → API Configuration
2. Pega tu API key en el campo correspondiente
3. Selecciona el provider (Auto-detect funciona en la mayoría de casos)

> 💡 **API Keys por proveedor:** Cada proveedor recuerda su propia API key. Si cambias de DeepSeek a Gemini, el campo de API key se vacía y muestra la key guardada para Gemini. Así puedes tener configurados varios proveedores sin que las keys se mezclen.

> ⚠️ **Atención:** Las API keys se guardan en `data.json` dentro de la carpeta del plugin (sin encriptar). Este archivo NO debe incluirse en Git (está en `.gitignore`). Si sincronizas tu vault, asegúrate de excluir `.obsidian/plugins/copilot-personal/data.json`.

### Paso 3: Selecciona tu modelo
- **Chat Model:** `deepseek-v4-flash` (rápido) o `deepseek-v4-pro` (potente)
- **Embedding Model:** `text-embedding-nomic-embed-text-v1.5` (local, gratuito)
- **Vision Model:** `qwen2.5-vl-27b-instruct` (LM Studio) o el mismo chat model

### Configuración recomendada para LM Studio
```
API URL:    http://localhost:1234/v1
Provider:   Auto-detect (detectará LM Studio automáticamente)
Chat Model: qwen3.6-35b-a3b (cárgalo en LM Studio)
Embedding:  text-embedding-nomic-embed-text-v1.5
Vision:     qwen2.5-vl-27b-instruct (opcional)
```

---

## 4. Uso del chat

### Operaciones básicas
- Escribe tu mensaje y presiona **Enter** para enviar
- Usa **Shift+Enter** para nueva línea
- Arrastra archivos al chat: `.md` (como contexto), `.pdf` (extrae texto), `.png/.jpg` (preview)
- Haz clic en el botón **Agent** para activar el modo autónomo
- Haz clic en **Think** para activar el modo de razonamiento (modelos DeepSeek)

### Indicadores visuales
| Indicador | Significado |
|-----------|-------------|
| `🆓 Free` | Tier gratuito — sin límite de mensajes con tu API key |
| `⭐ Pro` | Licencia Pro activa — todas las funciones desbloqueadas |
| `🔒 Local` | Datos procesados en tu equipo (LM Studio) |
| `☁️ Cloud` | Datos enviados a servidor externo (DeepSeek/OpenAI) |
| `⏳ Step N: tool...` | El agente está ejecutando una herramienta |
| `⚠️ NOTA NO GUARDADA` | El modelo escribió en el chat sin guardar en una nota |
| `⚠️ Links inventados` | El modelo sugirió enlaces a notas que no existen |

---

## 5. Slash commands

Escribe `/` seguido del comando y presiona Enter. El comando se expande automáticamente:

| Comando | Acción |
|---------|--------|
| `/summarize` | Resume el contenido seleccionado |
| `/translate` | Traduce el texto al inglés |
| `/explain` | Explica un concepto en detalle |
| `/toc` | Genera una tabla de contenidos |
| `/flashcards` | Crea 10 flashcards pregunta/respuesta |
| `/rewrite` | Reescribe mejorando claridad y estilo |
| `/expand` | Expande añadiendo más detalles |

**Ejemplo:**
```
/summarize arrastra aquí el texto de una nota o PDF
```

---

## 6. Modo Agente

El modo agente permite al LLM usar herramientas autónomamente. Es la característica diferencial del plugin.

### Cómo activarlo
1. Haz clic en el botón **Agent** en el chat
2. Escribe tu instrucción (ej: "crea notas para cada capítulo del PDF")
3. El agente ejecutará las herramientas necesarias automáticamente

### Ejemplos de uso

**Poblar notas desde un PDF:**
```
lee la nota 01_02 para entender la estructura. Después pobla las notas 
[[03_03_Aufgaben]], [[03_03_01_Planung]], [[03_03_02_Lenkung]] con 
información del PDF Grundlagen_des_Qualitätsmanagements.pdf, páginas 116-138.
Incluye imágenes y conexiones entre notas.
```

**Crear notas desde una lista:**
```
crea una nota para cada uno de los siguientes puntos:
- [[05_01_Ziele_und_ihre_Abhaengigkeit]]
- [[05_01_01_Gesamtheitlicher_Fokus_Prozessgestaltung]]
- [[05_02_Kontinuierlicher_Verbesserungsprozess]]
```

**Revisar nota contra el PDF:**
```
revisa la nota 01_03_01_Reklamationen según el PDF 
Grundlagen_des_Qualitätsmanagements.pdf, página 27
```

### Mecanismos de seguridad del agente
- **ToolRouter:** Clasifica la tarea antes de ejecutar y solo proporciona las herramientas necesarias (ahorro 70-90% tokens)
- **DECIDE NOW:** Fuerza al modelo a elegir entre actuar o responder
- **Anti-loop:** Detecta planificación repetida y fuerza conclusión
- **Force-write:** Si el modelo re-lee 3+ veces, fuerza cambio a escritura
- **WriteCount:** Verifica que todas las notas se hayan creado antes de declarar "completado"

---

## 7. Herramientas del agente

| Herramienta | Función | Cuándo se usa |
|-------------|---------|---------------|
| `read_note` | Leer una nota del vault | Necesitas ver contenido de una nota |
| `read_pdf` | Extraer texto de PDF (requiere pagesOnly) | Trabajar con PDFs grandes |
| `create_note` | Crear nueva nota | Generar contenido nuevo |
| `update_note` | Modificar nota existente | Actualizar notas |
| `find_files` | Buscar archivos por nombre | Localizar PDFs, imágenes, notas |
| `list_notes` | Listar notas en carpeta | Explorar el vault |
| `render_pdf_pages` | Renderizar páginas PDF a PNG | Extraer figuras/diagramas |
| `extract_pdf_images` | Extraer imágenes individuales de PDF | Obtener figuras incrustadas |
| `analyze_image` | Describir imagen con modelo de visión | Analizar diagramas, fotos |
| `search_vault_semantic` | Búsqueda semántica (RAG) | Encontrar conceptos en el vault |
| `search_vault_fulltext` | Búsqueda de texto exacto | Encontrar palabras específicas |
| `search_web` | Búsqueda en internet | Información externa |
| `get_vault_stats` | Estadísticas del vault | Saber tamaño, # notas |
| `get_active_file` | Archivo abierto actualmente | Trabajar con nota activa |
| `get_frontmatter` | Metadatos YAML de nota | Leer tags, fecha, etc. |
| `extract_youtube_transcript` | Transcripción de video | Analizar contenido de videos |

---

## 8. Trabajar con PDFs
## 9. Búsqueda semántica
## 10. Exportar conversaciones
## 11. Comandos de Obsidian
## 12. Privacidad y seguridad

- **API keys:** Almacenadas en `data.json` local. Cada proveedor tiene su propio campo. Nunca se envían a servidores del autor del plugin.
- **Datos del vault:** Enviados solo al proveedor LLM que configures (DeepSeek, OpenAI, etc.). Sin telemetría ni analytics.
- **Web search:** Requiere un microservicio Python local (`web_search_server/`). El token de autenticación es configurable desde settings.
- **Validación de licencias:** Las keys Pro se validan contra el Cloudflare Worker en `copilot-personal-worker.copilot-personal.workers.dev`. Free tier no requiere conexión a internet.
- **Path traversal:** Protección multicapa en `read_note` contra escapes de directorio (`..`, `%2e%2e`, paths absolutos).
- **Timing attacks:** El endpoint admin del Worker usa comparación constant-time para tokens.
- **Sin telemetría, sin analytics, sin tracking.**

## 13. Resolución de problemas
## 14. Atajos de teclado
## 15. Roadmap

### v1.6.0 (Lanzada 2026-06-20)
- [x] **Cumplimiento revisión Obsidian**: Los 6 errores + 9 warnings corregidos — descripciones en directive comments, `any[]`→`SettingDefinitionItem`, `(globalThis as any)`→`declare const activeDocument`, `Promise void`→operador `void`, `globalThis.setTimeout`→`setTimeout`
- [x] **Corrección BOM en `manifest.json`**: Eliminado BOM UTF-8 que impedía cargar el plugin en Obsidian
- [x] **Corregido `import("obsidian")` en `LicenseManager.ts`**: Import dinámico ESM reemplazado por `import { requestUrl }` estático — bloqueaba validación de licencia para todos los usuarios Pro
- [x] **Corregido `import("obsidian")` en `pathUtils.ts`**: Misma correción en `fetchWithFallback()` — afectaba TODOS los proveedores LLM (DeepSeek, OpenAI, Anthropic, Gemini...)
- [x] **Reutilización de fingerprint**: LicenseManager ahora reusa el fingerprint guardado en `data.json` en lugar de generar uno nuevo cada vez — evita consumir slots de dispositivo
- [x] **Reutilización de fingerprint en BudgetManager**: `chatView.ts` usa `getStoredFingerprint()` para llamadas al chat presupuestario — corrige error 429 "device_limit" en proveedor Copilot AI Pro
- [x] **Migración de sessionStorage**: La recuperación de sesión ahora usa `plugin.loadData()/saveData()` — resuelve recomendación "Local Storage" de la revisión
- [x] **385 tests en 27 suites** (desde 370 en 26)
- [x] **Validación integral de 38 características**: DeepSeek (chat, streaming, tool calling) + Copilot AI Pro (chat, herramientas, uso) verificados
- [x] **0 errores TypeScript** (modo estricto)


### v1.6.1 (Actual)
- [x] **Instrucciones personalizadas del agente**: Campo en Settings para instructions del system prompt. Inyectado en chat normal, agente, budget chat y budget agent chat
- [x] **Listas completas de modelos por proveedor**: DeepSeek (8), OpenAI (27), Anthropic (11), Gemini (16), Mistral (20), Groq (11), Perplexity (5), xAI (9), OpenRouter (~85)
- [x] **/search-history**: Busca texto completo en el historial de chat guardado. Muestra snippets con contexto
- [x] **/list-chats + /load-chat**: Lista y carga conversaciones guardadas usando ChatHistoryBrowser
- [x] **/batch-process**: Procesa archivos markdown en carpeta con acciones: summarize, translate, rewrite, expand, toc
- [x] **Popout chat window**: Boton Popout en el header. Arrastra la pestana a una ventana separada
- [x] **Sincronizacion UI**: Los botones Agent/Think ahora leen/escriben directo de settings — sin desincronizacion
- [x] **Budget chat con instrucciones**: handleBudgetChat ahora inyecta agentInstructions
- [x] **Correccion Gemini streaming**: chatStream siempre agregaba models/ sin condicion — ahora verifica si el modelo ya contiene /
- [x] **Correccion IDs Perplexity**: Eliminado prefijo perplexity/ — la API nativa espera sonar-pro no perplexity/sonar-pro
- [x] **Rutas del worker corregidas**: Faltaban /v1/budget-chat y /v1/budget-usage en el router
- [x] **Endpoint admin reset-devices**: Nuevo POST /admin/reset-devices para limpiar dispositivos de una licencia
- [x] **Free trial integrado**: 5 consultas/dia sin API key. LicenseManager usa 5 como limite, worker enforce 5/dia por fingerprint
- [ ] Multi-provider budget fallback

### v1.5.0
- [x] ~600 strings de UI internacionalizados con motor `t()`
- [x] Traducción completa al español de settings, chat y herramientas
- [x] Migración de `apiKey` legacy a claves por proveedor

### v1.4.4

### v1.4.3
- [x] **Dual-build**: `npm run build:store` (limpio, Obsidian review) + `npm run build` (ofuscado, distribución)
- [x] **Cloudflare Worker desplegado**: `copilot-personal-worker.copilot-personal.workers.dev` — validación cloud, webhook Lemon Squeezy, device limit
- [x] **API Keys por proveedor**: cada provider recuerda su propia key (DeepSeek, OpenAI, Gemini, etc.)
- [x] **Licencias Lemon Squeezy**: keys nativas UUID, sin formato COPILOT-, validación 100% cloud
- [x] **UI gating Free/Pro**: toggles deshabilitados (🔒) en settings cuando tier=free, mensajes de error al validar
- [x] **Persistencia del contador**: límite diario de mensajes sobrevive reinicios de Obsidian
- [x] **Web search token** configurable desde settings (ya no hardcoded)
- [x] **Path traversal protection** mejorada en `readNoteTool` (detección de `..`, `.`, paths absolutos, encoded)
- [x] **Timing-safe auth** en admin endpoint del Worker
- [x] **Test suite**: 385 tests en 27 suites
- [x] **CircuitBreaker** en TODOS los providers (chat + stream + embed)
- [x] **Sanitización Markdown**: protección contra `<script>` y `on*` handlers
- [x] **Console output disabled** en bundle ofuscado
- [x] **Licencia MIT** para cumplimiento open-source

### v1.4
- [x] **Multi-Provider Fallback (Pro)** — compensación automática de capacidades entre proveedores
- [x] **Seguridad HMAC-SHA256** + fingerprint binding + persistencia anti-reinicio
- [x] Modo agente con 17 herramientas
- [x] ToolRouter con clasificación LLM (ahorro 70-90% tokens)
- [x] PDF renderizado + extracción de imágenes con `unpdf`
- [x] 7 Slash commands + Export MD/JSON
- [x] Circuit breaker + timeouts + backoff en todos los providers (chat + stream + embed)
- [x] Session auto-save crash recovery (sessionStorage cada 30s)
- [x] Indicador de privacidad (🔒 Local / ☁️ Cloud) + tier badge (🆓 Free / ⭐ Pro)
- [x] LicenseManager con rate limiting + feature gating + fingerprint binding
- [x] Validación de wiki-links inventados + auto-guardado multi-nota
- [x] 11 proveedores con streaming real (fetch + ReadableStream)
- [x] Gemini provider nativo con tool calling (functionDeclarations)
- [x] Anthropic provider con tool calling nativo (input_schema) + CircuitBreaker
- [x] BaseOpenAIProvider unificado + buildBody() centralizado
- [x] AutoSaveManager integrado — splitNoteSections, validateWikiLinks, findNoteByHeading
- [x] Avatares en chat (👤/🤖/🔧) + animación fade-in
- [x] Progress tracker visual del agente (⏳ Step N: tool...)
- [x] Landing page + documentación completa
- [x] TypeScript strict mode (0 errores)
- [x] Ofuscación de build con javascript-obfuscator (rc4, CF flattening, dead code)
- [x] `fetchWithFallback()` — compatibilidad Obsidian desktop + mobile
- [x] `normalizeApiUrl()` unificada para todos los providers
- [x] 9 auditorías de código superadas (10/10 en providers, tools, seguridad)

### v1.3 (Próximamente)
- [ ] Voice input (Web Speech API)
- [ ] Templates de prompts personalizables
- [ ] Custom agent instructions (similar a Custom GPTs)
- [ ] Gemini tool calling nativo
- [ ] Export PDF con tool results
- [ ] Notificaciones al completar tareas largas
- [ ] Sync de configuración entre dispositivos

### v2.0 (Pro — Comercial)
- [x] Sistema de licencias free vs pro
- [x] Servidor de validación cloud (Cloudflare Worker desplegado)
- [x] Web search ilimitado (Pro)
- [x] API Keys por proveedor
- [ ] Soporte multi-vault
- [ ] Embeddings locales optimizados (ANN/HNSW)
- [ ] Soporte prioritario
- [ ] Templates premium

---

## Soporte

- **GitHub Issues:** [Reportar bug o sugerir feature](https://github.com/JosefBelzer/copilot-personal/issues)
- **Discord:** [Comunidad de Copilot Personal](https://discord.gg/tu-invitacion)
- **Email:** soporte@copilot-personal.dev

---

**Copilot Personal v1.5.0** — Hecho con ❤️ para la comunidad Obsidian.
