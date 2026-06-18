/**
 * Tests for constants.ts — all centralized constant values.
 */
import * as constants from "../constants";

describe("Constants — Token & Context Thresholds", () => {
  test("TOKEN_ESTIMATE_RATIO is 4 (chars per token)", () => {
    expect(constants.TOKEN_ESTIMATE_RATIO).toBe(4);
  });

  test("TOKEN_WARNING_THRESHOLD is 8000", () => {
    expect(constants.TOKEN_WARNING_THRESHOLD).toBe(8000);
  });

  test("TOKEN_DANGER_THRESHOLD is 12000", () => {
    expect(constants.TOKEN_DANGER_THRESHOLD).toBe(12000);
  });

  test("CONTEXT_COMPACT_TOKENS is 20000", () => {
    expect(constants.CONTEXT_COMPACT_TOKENS).toBe(20000);
  });

  test("CONTEXT_COMPACT_THRESHOLD is 18000", () => {
    expect(constants.CONTEXT_COMPACT_THRESHOLD).toBe(18000);
  });

  test("CONTEXT_COMPACT_SKIP_ITERATIONS is 2", () => {
    expect(constants.CONTEXT_COMPACT_SKIP_ITERATIONS).toBe(2);
  });

  test("CONTEXT_SUMMARIZE_MAX_TOKENS is 200", () => {
    expect(constants.CONTEXT_SUMMARIZE_MAX_TOKENS).toBe(200);
  });
});

describe("Constants — Compactor", () => {
  test("COMPACTOR_PRESERVE_LAST is 8", () => {
    expect(constants.COMPACTOR_PRESERVE_LAST).toBe(8);
  });

  test("COMPACTOR_MAX_BLOCKS is 8", () => {
    expect(constants.COMPACTOR_MAX_BLOCKS).toBe(8);
  });

  test("COMPACTOR_ASSISTANT_MIN_CHARS is 1000", () => {
    expect(constants.COMPACTOR_ASSISTANT_MIN_CHARS).toBe(1000);
  });

  test("COMPACTOR_SUMMARIZE_MAX_CHARS is 2000", () => {
    expect(constants.COMPACTOR_SUMMARIZE_MAX_CHARS).toBe(2000);
  });
});

describe("Constants — Context Layers", () => {
  test("LAYERS_PROMOTION_INTERVAL is 3", () => {
    expect(constants.LAYERS_PROMOTION_INTERVAL).toBe(3);
  });

  test("LAYERS_RECENT_MSGS is 6", () => {
    expect(constants.LAYERS_RECENT_MSGS).toBe(6);
  });

  test("LAYERS_MIN_PROMPT_CHARS is 100", () => {
    expect(constants.LAYERS_MIN_PROMPT_CHARS).toBe(100);
  });

  test("LAYERS_MAX_PROMOTE_CHARS is 4000", () => {
    expect(constants.LAYERS_MAX_PROMOTE_CHARS).toBe(4000);
  });

  test("LAYERS_MAX_FACT_CHARS is 200", () => {
    expect(constants.LAYERS_MAX_FACT_CHARS).toBe(200);
  });

  test("LAYERS_MAX_FACTS is 8", () => {
    expect(constants.LAYERS_MAX_FACTS).toBe(8);
  });

  test("LAYERS_MAX_L2_CHARS is 3000", () => {
    expect(constants.LAYERS_MAX_L2_CHARS).toBe(3000);
  });
});

describe("Constants — Vector Search", () => {
  test("SIMILARITY_CUTOFF is 0.3", () => {
    expect(constants.SIMILARITY_CUTOFF).toBe(0.3);
  });

  test("HYBRID_VECTOR_WEIGHT is 0.7", () => {
    expect(constants.HYBRID_VECTOR_WEIGHT).toBe(0.7);
  });

  test("RERANKER_THRESHOLD is 0.5", () => {
    expect(constants.RERANKER_THRESHOLD).toBe(0.5);
  });
});

describe("Constants — PDF Extraction", () => {
  test("PDF_MAX_PAGES is 500", () => {
    expect(constants.PDF_MAX_PAGES).toBe(500);
  });

  test("PDF_CHARS_PER_PAGE is 1200", () => {
    expect(constants.PDF_CHARS_PER_PAGE).toBe(1200);
  });

  test("PDF_HEADER_ZONE is 0.08", () => {
    expect(constants.PDF_HEADER_ZONE).toBe(0.08);
  });

  test("PDF_FOOTER_ZONE is 0.92", () => {
    expect(constants.PDF_FOOTER_ZONE).toBe(0.92);
  });

  test("PDF_PAGE_NUM_Y is 0.85", () => {
    expect(constants.PDF_PAGE_NUM_Y).toBe(0.85);
  });

  test("PDF_COLUMN_GAP is 40", () => {
    expect(constants.PDF_COLUMN_GAP).toBe(40);
  });

  test("PDF_COLUMN_SEPARATION is 80", () => {
    expect(constants.PDF_COLUMN_SEPARATION).toBe(80);
  });
});

describe("Constants — Tool Result Limits", () => {
  test("MAX_LIST_NOTES is 50", () => {
    expect(constants.MAX_LIST_NOTES).toBe(50);
  });

  test("MAX_FULLTEXT_MATCHES is 20", () => {
    expect(constants.MAX_FULLTEXT_MATCHES).toBe(20);
  });

  test("MAX_FILE_SEARCH is 15", () => {
    expect(constants.MAX_FILE_SEARCH).toBe(15);
  });

  test("MAX_CHAT_HISTORY is 50", () => {
    expect(constants.MAX_CHAT_HISTORY).toBe(50);
  });

  test("MAX_DISPLAY_HISTORY is 10", () => {
    expect(constants.MAX_DISPLAY_HISTORY).toBe(10);
  });

  test("MAX_READ_NOTE_PARTIAL is 10", () => {
    expect(constants.MAX_READ_NOTE_PARTIAL).toBe(10);
  });

  test("MAX_SNIPPET_CHARS is 500", () => {
    expect(constants.MAX_SNIPPET_CHARS).toBe(500);
  });

  test("MAX_MESSAGES_BEFORE_TRIM is 200", () => {
    expect(constants.MAX_MESSAGES_BEFORE_TRIM).toBe(200);
  });

  test("MESSAGES_TRIM_KEEP is 100", () => {
    expect(constants.MESSAGES_TRIM_KEEP).toBe(100);
  });
});

describe("Constants — Indexing", () => {
  test("CHUNK_OVERLAP_RATIO is 0.1", () => {
    expect(constants.CHUNK_OVERLAP_RATIO).toBe(0.1);
  });

  test("WORDS_PER_TOKEN is 0.75", () => {
    expect(constants.WORDS_PER_TOKEN).toBe(0.75);
  });

  test("INDEX_BATCH_SMALL is 10", () => {
    expect(constants.INDEX_BATCH_SMALL).toBe(10);
  });

  test("INDEX_BATCH_LARGE is 20", () => {
    expect(constants.INDEX_BATCH_LARGE).toBe(20);
  });

  test("PROGRESS_INTERVAL is 10", () => {
    expect(constants.PROGRESS_INTERVAL).toBe(10);
  });
});

describe("Constants — Cross-consistency", () => {
  test("CONTEXT_COMPACT_SKIP_ITERATIONS < LAYERS_PROMOTION_INTERVAL", () => {
    // Compaction skips first 2 iterations, promotion starts at 3
    expect(constants.CONTEXT_COMPACT_SKIP_ITERATIONS).toBeLessThan(constants.LAYERS_PROMOTION_INTERVAL);
  });

  test("MESSAGES_TRIM_KEEP is half of MAX_MESSAGES_BEFORE_TRIM", () => {
    expect(constants.MESSAGES_TRIM_KEEP).toBe(constants.MAX_MESSAGES_BEFORE_TRIM / 2);
  });

  test("COMPACTOR_PRESERVE_LAST equals COMPACTOR_MAX_BLOCKS", () => {
    expect(constants.COMPACTOR_PRESERVE_LAST).toBe(constants.COMPACTOR_MAX_BLOCKS);
  });

  test("HYBRID_VECTOR_WEIGHT is between 0 and 1", () => {
    expect(constants.HYBRID_VECTOR_WEIGHT).toBeGreaterThan(0);
    expect(constants.HYBRID_VECTOR_WEIGHT).toBeLessThan(1);
  });

  test("SIMILARITY_CUTOFF and RERANKER_THRESHOLD are valid thresholds", () => {
    expect(constants.SIMILARITY_CUTOFF).toBeGreaterThan(0);
    expect(constants.SIMILARITY_CUTOFF).toBeLessThan(1);
    expect(constants.RERANKER_THRESHOLD).toBeGreaterThan(0);
    expect(constants.RERANKER_THRESHOLD).toBeLessThan(1);
  });
});
