/**
 * Expanded live test — ToolRouter classification + iteration estimation.
 * 35 diverse queries covering all categories and complexity levels.
 */
import { ToolRouter, ToolCategory } from "../agent/ToolRouter";
import { AgentTool } from "../agent/ToolRegistry";

const ALL_TOOLS = new Map<string, AgentTool>();
const makeTool = (name: string, desc: string): AgentTool => ({
  name, description: desc, parameters: {}, execute: async () => "",
});
ALL_TOOLS.set("read_note", makeTool("read_note", "Read a note"));
ALL_TOOLS.set("read_pdf", makeTool("read_pdf", "Read a PDF"));
ALL_TOOLS.set("render_pdf_pages", makeTool("render_pdf_pages", "Render PDF pages to images"));
ALL_TOOLS.set("get_active_file", makeTool("get_active_file", "Get active file"));
ALL_TOOLS.set("get_frontmatter", makeTool("get_frontmatter", "Get frontmatter"));
ALL_TOOLS.set("create_note", makeTool("create_note", "Create a note"));
ALL_TOOLS.set("update_note", makeTool("update_note", "Update a note"));
ALL_TOOLS.set("find_files", makeTool("find_files", "Find files"));
ALL_TOOLS.set("list_notes", makeTool("list_notes", "List notes"));
ALL_TOOLS.set("search_vault_fulltext", makeTool("search_vault_fulltext", "Fulltext search"));
ALL_TOOLS.set("get_vault_stats", makeTool("get_vault_stats", "Vault stats"));
ALL_TOOLS.set("search_vault_semantic", makeTool("search_vault_semantic", "Semantic search"));
ALL_TOOLS.set("search_vault_by_timeframe", makeTool("search_vault_by_timeframe", "Timeframe search"));
ALL_TOOLS.set("search_web", makeTool("search_web", "Web search"));
ALL_TOOLS.set("analyze_image", makeTool("analyze_image", "Analyze image"));
ALL_TOOLS.set("extract_youtube_transcript", makeTool("extract_youtube_transcript", "YouTube transcript"));

// Estimate items and iterations (mirrors AgentModeRunner logic)
function estimateItems(q: string): number {
  const wikiCount = (q.match(/\[\[([^\]]+)\]\]/g)?.length ?? 0);
  if (wikiCount >= 2) return wikiCount;
  const listItems = (q.match(/^[\s]*[-*•]\s+.+$/gm)?.length ?? 0) ||
                    (q.match(/^[\s]*\d+[\.\)]\s+.+$/gm)?.length ?? 0);
  if (listItems >= 2) return listItems;
  const commaItems = q.split(/,\s*(?=\w)/g).filter(s => s.trim().length > 10).length;
  if (commaItems >= 3) return commaItems;
  const lines = q.split("\n").filter(l => l.trim().length > 5);
  if (lines.length >= 4) return lines.length;
  return 1;
}
function estimateIters(items: number, cats: string[], hasPDF: boolean): number {
  let ipi = 1;
  if (cats.includes("read") && hasPDF) ipi = 2;
  if (cats.includes("search") && hasPDF) ipi = 3;
  if (cats.includes("media")) ipi += 1;
  return Math.max(8, Math.min(40, Math.ceil(items * ipi) + 3));
}

interface TestQuery {
  query: string;
  expectedCats: ToolCategory[];
}

const QUERIES: TestQuery[] = [
  // ═══ WRITE — simple creation ═══
  { query: "crea una nota para cada uno: [[A]], [[B]], [[C]]", expectedCats: ["write"] },
  { query: "genera notas vacías para estos temas: Introducción, Métodos, Resultados, Conclusión, Referencias", expectedCats: ["write"] },
  { query: "- Tema 1\n- Tema 2\n- Tema 3\n- Tema 4\ncrea una nota para cada uno", expectedCats: ["write"] },

  // ═══ WRITE — batch large lists ═══
  { query: `crea una nota para cada uno de los siguientes puntos:
- [[05_01_Ziele_und_ihre_Abhaengigkeit]]
- [[05_01_01_Gesamtheitlicher_Fokus_Prozessgestaltung]]
- [[05_01_02_Prozessinterner_Fokus_Prozessoptimierung]]
- [[05_02_Kontinuierlicher_Verbesserungsprozess]]
- [[05_02_01_Verbesserung_und_Eigenverantwortung]]
- [[05_02_02_Grundlagen_des_KVP]]
- [[05_02_03_Prozessorientierung_und_Standardisierung]]
- [[05_02_04_3_Mu_Checkliste]]
- [[05_02_05_5_S_Bewegungen]]
- [[05_02_06_7_M_Checkliste]]
- [[05_02_07_7_W_Checkliste]]
- [[05_02_08_Qualitaetszirkel]]
- [[05_03_Six_Sigma]]
- [[05_03_01_Methodik_von_Six_Sigma]]
- [[05_03_02_Define_Definitionsphase]]
- [[05_03_03_Measure_Messphase]]
- [[05_03_04_Analyze_Analysephase]]
- [[05_03_05_Improve_Verbesserungsphase]]
- [[05_03_06_Control_Kontrollphase]]
- [[05_04_Prozesswirkungsgrad]]
- [[05_04_01_Methodik_des_Prozesswirkungsgrades]]
- [[05_04_02_Prozesswirkungsgradanalyse]]
- [[05_05_Wertstromanalyse]]
- [[05_05_01_Methodik_der_Wertstromanalyse]]
- [[05_05_02_Vorgehensweise_und_Verbesserungspotenzial]]
- [[05_06_8D_Methodik]]
- [[05_07_Sonstige_Strategien]]
- [[05_07_01_Just_in_Time]]
- [[05_07_02_Lean_Management]]
- [[05_07_03_Single_Minute_Exchange_of_Die]]
- [[05_07_04_Kanban]]
- [[05_07_05_Simultaneous_Engineering]]`, expectedCats: ["write"] },

  // ═══ READ — single note ═══
  { query: "lee la nota 01_02_Qualitaet_als_Erfolgsfaktor y dime qué contiene", expectedCats: ["read"] },
  { query: "¿qué archivo tengo abierto ahora mismo?", expectedCats: ["read"] },
  { query: "extrae el frontmatter de la nota 01_01_Einfuehrung", expectedCats: ["read"] },

  // ═══ SEARCH — vault lookup ═══
  { query: "busca todas las notas que mencionen ISO 9001", expectedCats: ["search"] },
  { query: "encuentra el archivo diagrama.png en el vault", expectedCats: ["search"] },
  { query: "¿cuántas notas hay en mi vault?", expectedCats: ["search"] },
  { query: "lista las notas en la carpeta Grundlagen_QM/Kapitel 01", expectedCats: ["search"] },
  { query: "encuentra todas las notas modificadas entre el 2026-01-01 y el 2026-05-20", expectedCats: ["search"] },

  // ═══ WEB ═══
  { query: "busca información sobre Total Quality Management en internet", expectedCats: ["web"] },

  // ═══ MEDIA ═══
  { query: "analiza esta imagen: carpeta/diagrama.png", expectedCats: ["media"] },
  { query: "obtén la transcripción de https://www.youtube.com/watch?v=abc123", expectedCats: ["media"] },

  // ═══ PDF — review / verify ═══
  { query: "revisa la nota 01_03_01_Reklamationen según el PDF Grundlagen_des_Qualitätsmanagements.pdf páginas 27", expectedCats: ["read", "search", "write"] },
  { query: "verifica que la nota 01_03_02_Haftung sea fiel al PDF obsidian://open?vault=QM&file=Grundlagen_des_Qualit%C3%A4tsmanagements.pdf páginas 27-28", expectedCats: ["read", "search", "write"] },
  { query: "comprueba si la nota 01_03_05_Kritischer_Einsatz_einer_Software coincide con el PDF páginas 33-34", expectedCats: ["read", "search", "write"] },

  // ═══ PDF — populate / update ═══
  { query: "actualiza la nota 01_03_Nichtqualitaet con la información del PDF páginas 25-34", expectedCats: ["read", "search", "write"] },
  { query: "pobla la nota 01_03_04 con el contenido del capítulo 1.3.4 del PDF páginas 30-32", expectedCats: ["read", "search", "write"] },
  { query: "lee la nota 01_02 para entender la estructura, luego pobla la nota 01_03_03 con el PDF páginas 28-30", expectedCats: ["read", "search", "write"] },

  // ═══ PDF + images ═══
  { query: "resume el capítulo 1.3 del PDF páginas 25-34 e incluye las imágenes", expectedCats: ["media", "read", "search", "write"] },
  { query: "renderiza las páginas 30-33 del PDF y crea una nota con las figuras", expectedCats: ["media", "read", "search", "write"] },
  { query: "extrae las imágenes del PDF y descríbelas", expectedCats: ["media", "read", "search"] },
  { query: "necesito las figuras del PDF páginas 28-30 para la nota 01_03_03", expectedCats: ["media", "read", "search", "write"] },

  // ═══ MULTI-NOTE + PDF ═══
  { query: "revisa las notas 01_01_Einfuehrung, 01_02_Qualitaet_als_Erfolgsfaktor, 01_03_Nichtqualitaet según el PDF", expectedCats: ["read", "search", "write"] },
  { query: "crea notas para 1.3.1 Reklamationen, 1.3.2 Haftung, 1.3.3 Abgasmanipulation con contenido del PDF páginas 27-30", expectedCats: ["read", "search", "write"] },
];

describe("ToolRouter live classification", () => {

// Skip if no real LLM available (CI / no API key)
const hasLLM = typeof process !== "undefined" && process.env.COPILOT_TEST_API_KEY;
const testOrSkip = hasLLM ? test : test.skip;

testOrSkip("correctly classifies 35 diverse queries", async () => {
  console.log("══════════════════════════════════════════════════════");
  console.log("  ToolRouter + Iteration Estimator — 35 queries");
  console.log("══════════════════════════════════════════════════════\n");

  const router = new ToolRouter(null as any, ALL_TOOLS);
  let catOk = 0, catFail = 0;

  for (const { query, expectedCats } of QUERIES) {
    const result = await router.route(query);
    const gotCats = result.categories.sort().join(",");
    const wantCats = expectedCats.sort().join(",");
    const catCorrect = gotCats === wantCats;
    if (catCorrect) catOk++; else catFail++;

    const items = estimateItems(query);
    const hasPDF = /\bpdf\b|\.pdf/i.test(query);
    const iters = estimateIters(items, result.categories, hasPDF);
    const label = query.length > 70 ? query.substring(0, 67) + "..." : query;

    const status = catCorrect ? "✅" : "❌";
    console.log(`${status} [${gotCats}] items=${items} iters=${iters} | ${label}`);
    if (!catCorrect) {
      console.log(`   Expected categories: [${wantCats}]`);
    }
  }

  console.log(`\n──────────────────────────────────────────────────────`);
  console.log(`  Categories: ${catOk}/${QUERIES.length} correct (${catFail} wrong)`);
  console.log(`──────────────────────────────────────────────────────`);

  expect(catFail).toBe(0);
});
});
