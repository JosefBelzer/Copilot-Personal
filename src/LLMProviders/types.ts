export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatStreamChunk {
  content: string;
  done: boolean;
}
