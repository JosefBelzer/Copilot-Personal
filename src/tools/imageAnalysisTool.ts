import { App, requestUrl } from "obsidian";
import { AgentTool } from "../agent/ToolRegistry";
import { ProviderManager } from "../LLMProviders/providerManager";
import { t } from "../i18n";

const TAG = "[analyze_image]";

/**
 * analyze_image — analiza una imagen del vault usando el provider de visión.
 * Con multi-provider fallback, usa automáticamente el proveedor configurado
 * si el principal no soporta visión (ej: DeepSeek → LM Studio con Qwen2.5-VL).
 */
export function createImageAnalysisTool(
  app: App,
  providerManager: ProviderManager
): AgentTool {
  return {
    name: "analyze_image",
    description:
      t("tools.analyzeImage.description"),
    parameters: {
      type: "object",
      properties: {
        imagePath: { type: "string", description: t("tools.analyzeImage.paramImagePath") },
      },
      required: ["imagePath"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const imagePath = params.imagePath as string;
      if (!imagePath) return t("tools.analyzeImage.error.noPath");

      let provider;
      try {
        provider = providerManager.getProviderFor("vision");
      } catch (err) {
        return t("tools.analyzeImage.error.configError", { error: err instanceof Error ? err.message : String(err) });
      }

      const config = provider.config;
      const apiUrl = config.apiUrl.replace(/\/+$/, "") + (config.apiUrl.endsWith("/v1") ? "" : "/v1");
      const visionModel = config.visionModel || config.chatModel;

      try {
        const arrayBuffer = await app.vault.adapter.readBinary(imagePath);
        const base64 = arrayBufferToBase64(arrayBuffer);
        const ext = (imagePath.split(".").pop()?.toLowerCase() ?? "png");
        const mimeType = ext === "jpg" ? "jpeg" : ext;

        const body: Record<string, unknown> = {
          model: visionModel,
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Describe this image in detail. If it contains text, diagrams, charts or tables, describe them accurately." },
              { type: "image_url", image_url: { url: `data:image/${mimeType};base64,${base64}` } },
            ],
          }],
          max_tokens: config.maxTokens,
          temperature: config.temperature,
        };

        const response = await requestUrl({
          url: `${apiUrl}/chat/completions`,
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.apiKey}` },
          body: JSON.stringify(body),
        });

        const data = response.json;
        if (data.error) return t("tools.analyzeImage.error.apiError", { message: data.error.message || JSON.stringify(data.error) });
        return data.choices?.[0]?.message?.content ?? t("tools.analyzeImage.noResponse");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`${TAG} Failed:`, msg);
        if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
          return t("tools.analyzeImage.error.connectionRefused");
        }
        return t("tools.analyzeImage.error.generic", { error: msg });
      }
    },
  };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
