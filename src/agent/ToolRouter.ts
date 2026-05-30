/**
 * ToolRouter — classifies the user's query to determine which tool categories
 * are needed. Uses LLM-based classification as the PRIMARY method (not fragile
 * regex keyword matching). Only one fast-path for the unambiguous case of
 * wiki-link lists with create verbs.
 */

import { LLMProvider, ToolDefinition } from "../LLMProviders/providerTypes";
import { AgentTool } from "./ToolRegistry";

export type ToolCategory = "read" | "write" | "search" | "semantic" | "web" | "media";

export interface RoutedTools {
  categories: ToolCategory[];
  tools: ToolDefinition[];
  toolsByCategory: Map<ToolCategory, AgentTool[]>;
}

const CATEGORY_MAP: Record<string, ToolCategory[]> = {
  read_note: ["read"],
  read_pdf: ["read"],
  get_active_file: ["read"],
  get_frontmatter: ["read"],
  create_note: ["write"],
  update_note: ["write"],
  find_files: ["search"],
  list_notes: ["search"],
  search_vault_fulltext: ["search"],
  get_vault_stats: ["search"],
  search_vault_semantic: ["semantic"],
  search_vault_by_timeframe: ["semantic"],
  search_web: ["web"],
  analyze_image: ["media"],
  extract_youtube_transcript: ["media"],
  render_pdf_pages: ["read", "media"],
  extract_pdf_images: ["read", "media"],
};

const CLASSIFICATION_PROMPT = `Classify this user request into tool categories. Return ONLY a JSON array of strings from: "read", "write", "search", "semantic", "web", "media".

Categories explained:
- "read": user wants to READ content (notes, PDFs, frontmatter, active file)
- "write": user wants to CREATE or MODIFY notes (crea, actualiza, poblar, escribe, modifica, genera, añade, completa, reescribe, etc.)
- "search": user wants to FIND or LOCATE files, list notes, fulltext search, vault stats
- "semantic": user wants semantic/vector search (busca información, encuentra conceptos)
- "web": user wants internet/web search
- "media": user wants image analysis OR PDF page rendering OR PDF image extraction OR YouTube transcripts

Examples:
"crea una nota para cada uno: [[A]], [[B]]" → ["write"]
"lee la nota X y dime qué dice" → ["read"]
"busca todas las notas sobre calidad" → ["search", "semantic"]
"revisa la nota X según el PDF Y pag 27" → ["read", "search", "write"]
"crea notas para: [[A]], [[B]], [[C]]" → ["write"]
"busca en internet sobre ISO 9001" → ["web"]
"analiza esta imagen" → ["media"]
"actualiza la nota X con info del PDF" → ["read", "write", "search"]
"pobla las notas X, Y, Z con contenido del PDF páginas 30-40" → ["read", "write", "search", "media"]
"resume el capítulo del PDF e incluye las imágenes" → ["read", "write", "search", "media"]
"pobles la nota X" → ["read", "write", "search"]

Request: `;

export class ToolRouter {
  private provider: LLMProvider | null;
  private allTools: Map<string, AgentTool>;

  constructor(provider: LLMProvider | null, allTools: Map<string, AgentTool>) {
    this.provider = provider;
    this.allTools = allTools;
  }

  /**
   * Classify the user's query using the LLM (primary) or fast-path (fallback).
   * LLM classification is robust against typos, conjugations, and variations.
   */
  async route(userQuery: string): Promise<RoutedTools> {
    // Fast path: unambiguous wiki-link list with create verbs — skip LLM to save tokens
    const wikiLinks = userQuery.match(/\[\[([^\]]+)\]\]/g);
    if (wikiLinks && wikiLinks.length >= 2 && /\b(crea|genera|crear|generar|a[nñ]ade)\b/i.test(userQuery)) {
      return this.buildRouted(["write"]);
    }

    // LLM classification (primary method)
    if (this.provider) {
      try {
        const response = await this.provider.chat([
          { role: "system", content: "You are a task classifier. Output only valid JSON arrays." },
          { role: "user", content: CLASSIFICATION_PROMPT + userQuery.substring(0, 600) },
        ]);

        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const categories = JSON.parse(jsonMatch![0]) as ToolCategory[];
          if (categories.length > 0) {
            return this.buildRouted(categories);
          }
        }
      } catch {
        // LLM failed — fall through to safe default
      }
    }

    // Safe default: read + search + write (most common combination)
    return this.buildRouted(["read", "search", "write"]);
  }

  private buildRouted(categories: ToolCategory[]): RoutedTools {
    const tools: ToolDefinition[] = [];
    const toolsByCategory = new Map<ToolCategory, AgentTool[]>();

    for (const cat of categories) {
      toolsByCategory.set(cat, []);
    }

    for (const [name, tool] of this.allTools) {
      const cats = CATEGORY_MAP[name] || [];
      for (const cat of cats) {
        if (categories.includes(cat)) {
          tools.push({
            type: "function",
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          });
          toolsByCategory.get(cat)?.push(tool);
          break;
        }
      }
    }

    return { categories, tools, toolsByCategory };
  }
}
