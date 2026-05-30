// ═══════════════════════════════════════════════════════════
// Centralized constants for the Copilot Personal plugin.
// Every magic number from the codebase lives here so tuning
// doesn't require hunting through source files.
// ═══════════════════════════════════════════════════════════

// ── Token & context thresholds ──
export const TOKEN_ESTIMATE_RATIO = 4;                // chars ÷ N ≈ tokens
export const TOKEN_WARNING_THRESHOLD = 8000;
export const TOKEN_DANGER_THRESHOLD = 12000;
export const CONTEXT_COMPACT_TOKENS = 20000;           // compaction kicks in above this
export const CONTEXT_COMPACT_THRESHOLD = 18000;         // min tokens for compact fn
export const CONTEXT_COMPACT_SKIP_ITERATIONS = 2;       // skip first N agent iterations
export const CONTEXT_SUMMARIZE_MAX_TOKENS = 200;        // max output tokens for summary LLM call

// ── Compactor ──
export const COMPACTOR_PRESERVE_LAST = 8;              // messages preserved from tail
export const COMPACTOR_MAX_BLOCKS = 8;                 // max blocks to summarize per pass
export const COMPACTOR_ASSISTANT_MIN_CHARS = 1000;     // min chars for assistant candidate
export const COMPACTOR_SUMMARIZE_MAX_CHARS = 2000;     // max chars sent to LLM per block

// ── Context layers ──
export const LAYERS_PROMOTION_INTERVAL = 3;            // promote L3→L2 every N turns
export const LAYERS_RECENT_MSGS = 6;                   // recent messages in L2 context
export const LAYERS_MIN_PROMPT_CHARS = 100;            // min chars to trigger promotion
export const LAYERS_MAX_PROMOTE_CHARS = 4000;          // max chars to summarize for promote
export const LAYERS_MAX_FACT_CHARS = 200;              // max chars per extracted fact
export const LAYERS_MAX_FACTS = 8;                     // max facts to extract
export const LAYERS_MAX_L2_CHARS = 3000;               // max L2 content size in chars

// ── Vector search ──
export const SIMILARITY_CUTOFF = 0.3;                   // cosine similarity minimum
export const HYBRID_VECTOR_WEIGHT = 0.7;                // vector weight in hybrid scoring
export const RERANKER_THRESHOLD = 0.5;                  // reranker score minimum

// ── PDF extraction ──
export const PDF_MAX_PAGES = 500;                       // safety cap
export const PDF_CHARS_PER_PAGE = 1200;                 // max chars per page in output
export const PDF_HEADER_ZONE = 0.08;                    // top N% treated as header
export const PDF_FOOTER_ZONE = 0.92;                    // bottom starts at N%
export const PDF_PAGE_NUM_Y = 0.85;                     // below this Y, filter page numbers
export const PDF_COLUMN_GAP = 40;                       // min gap to start new cluster
export const PDF_COLUMN_SEPARATION = 80;                // gap to declare separate column

// ── Tool result limits ──
export const MAX_LIST_NOTES = 50;
export const MAX_FULLTEXT_MATCHES = 20;
export const MAX_FILE_SEARCH = 15;
export const MAX_CHAT_HISTORY = 50;
export const MAX_DISPLAY_HISTORY = 10;
export const MAX_READ_NOTE_PARTIAL = 10;
export const MAX_SNIPPET_CHARS = 500;
export const MAX_MESSAGES_BEFORE_TRIM = 200;
export const MESSAGES_TRIM_KEEP = 100;

// ── Indexing ──
export const CHUNK_OVERLAP_RATIO = 0.1;
export const WORDS_PER_TOKEN = 0.75;
export const INDEX_BATCH_SMALL = 10;
export const INDEX_BATCH_LARGE = 20;
export const PROGRESS_INTERVAL = 10;
