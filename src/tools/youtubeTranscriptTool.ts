import { AgentTool } from "../agent/ToolRegistry";
// @ts-ignore - youtube-transcript no tiene tipos
import { YoutubeTranscript } from "youtube-transcript";

/**
 * extract_youtube_transcript — obtiene la transcripción de un video de YouTube.
 */
export function createYoutubeTranscriptTool(): AgentTool {
  return {
    name: "extract_youtube_transcript",
    description:
      "Gets the transcript (subtitles) of a YouTube video from its URL.",
    parameters: {
      type: "object",
      properties: {
        videoUrl: {
          type: "string",
          description:
            "YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).",
        },
      },
      required: ["videoUrl"],
    },
    execute: async (params: Record<string, unknown>): Promise<string> => {
      const videoUrl = params.videoUrl as string;
      if (!videoUrl) return "Error: no video URL provided.";

      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        return `Error: could not extract video ID from URL: ${videoUrl}`;
      }

      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        if (!transcript || transcript.length === 0) {
          return "No transcript found for this video (subtitles may not be available).";
        }

        const fullText = transcript
          .map((item: { text: string }) => item.text)
          .join(" ");

        return `Transcript of video ${videoId}:\n\n${fullText}`;
      } catch (err) {
        return `Error getting transcript: ${err instanceof Error ? err.message : String(err)}`;
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
