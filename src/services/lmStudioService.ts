import { requestUrl } from "obsidian";

export interface LmStudioModel {
  id: string;
  object: string;
  owned_by: string;
}

export interface LmStudioModelsResponse {
  object: string;
  data: LmStudioModel[];
}

/**
 * Service to interact with LM Studio's API for model discovery.
 */
export class LmStudioService {
  /**
   * Fetch the list of loaded models from LM Studio's /v1/models endpoint.
   * Returns model IDs sorted alphabetically.
   */
  static async fetchModels(apiUrl: string, apiKey?: string): Promise<string[]> {
    const baseUrl = apiUrl.replace(/\/+$/, "");
    const url = `${baseUrl}/models`;

    const response = await requestUrl({
      url,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });

    if (response.status !== 200) {
      throw new Error(`LM Studio returned ${response.status}: ${response.text}`);
    }

    const data: LmStudioModelsResponse = response.json;
    const models = (data.data ?? [])
      .map((m) => m.id)
      .filter((id) => id && typeof id === "string")
      .sort();

    return models;
  }

  /**
   * Check if LM Studio is reachable.
   */
  static async isReachable(apiUrl: string): Promise<boolean> {
    try {
      await this.fetchModels(apiUrl);
      return true;
    } catch {
      return false;
    }
  }
}
