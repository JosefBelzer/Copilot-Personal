import { AgentTool } from "../agent/ToolRegistry";
// @ts-ignore - youtube-transcript no tiene tipos
import { YoutubeTranscript } from "youtube-transcript";
import { t } from "../i18n";

/**
 * extract_youtube_transcript — obtiene la transcripción de un video de YouTube.
 */
export function createYoutubeTranscriptTool(): AgentTool {
  return {
    name: "extract_youtube_transcript",
    description:
      t("tools.extractYoutubeTranscript.description"),
    parameters: {
      type: "object",
      properties: {
        videoUrl: {
          type: "string",
          description:
            t("tools.extractYoutubeTranscript.paramVideoUrl"),
        },
      },
      required: ["videoUrl"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const videoUrl = params.videoUrl as string;
      if (!videoUrl) return t("tools.extractYoutubeTranscript.error.noUrl");

      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        return t("tools.extractYoutubeTranscript.error.invalidUrl", { url: videoUrl });
      }

      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        if (!transcript || transcript.length === 0) {
          return t("tools.extractYoutubeTranscript.noTranscript");
        }

        const fullText = transcript
          .map((item: { text: string }) => item.text)
          .join(" ");

        return t("tools.extractYoutubeTranscript.header", { videoId }) + `\n\n${fullText}`;
      } catch (err) {
        return t("tools.extractYoutubeTranscript.error.generic", { error: err instanceof Error ? err.message : String(err) });
      }
    },
  };
}

function extractVideoId(url: string): string | null {
  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];

  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}
