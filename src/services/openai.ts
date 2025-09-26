import Constants from "expo-constants";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-5";

const getApiKey = (): string => {
  const extra = Constants.expoConfig?.extra || Constants.manifestExtra || {};
  const apiKey = (extra as Record<string, string | undefined>).openaiApiKey;
  if (!apiKey) {
    throw new Error(
      "Missing OpenAI API key. Add 'openai_api' to your .env file."
    );
  }
  return apiKey;
};

const normalizeMessageContent = (message: unknown): string => {
  if (!message || typeof message !== "object") {
    return "";
  }

  const content = (message as { content?: unknown }).content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const combined = content
      .map((part) => {
        if (!part) {
          return "";
        }

        if (typeof part === "string") {
          return part;
        }

        if (typeof part === "object") {
          const maybeText =
            (part as { text?: unknown }).text ??
            (part as { content?: unknown }).content ??
            (part as { value?: unknown }).value;

          if (typeof maybeText === "string") {
            return maybeText;
          }
        }

        return "";
      })
      .filter((segment) => typeof segment === "string" && segment.trim().length > 0)
      .join("\n")
      .trim();

    return combined;
  }

  return "";
};

export async function requestAssistantReply(
  messages: ChatMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const apiKey = getApiKey();

  const payload: Record<string, unknown> = {
    model: MODEL,
    messages,
    max_completion_tokens: options?.maxTokens ?? 512,
  };

  if (options?.temperature !== undefined) {
    payload.temperature = options.temperature;
  }

  console.log("[OpenAI] sending chat completion", {
    endpoint: OPENAI_ENDPOINT,
    model: MODEL,
    payload,
  });

  let response: Response;
  try {
    response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    console.error("[OpenAI] network error while calling chat completions", {
      endpoint: OPENAI_ENDPOINT,
      model: MODEL,
      error: networkError,
    });
    throw networkError;
  }

  const data = await response.json();

  console.log("[OpenAI] raw response received", {
    status: response.status,
    statusText: response.statusText,
    data,
  });

  if (!response.ok) {
    const message = data?.error?.message || "OpenAI request failed";
    console.error("OpenAI chat request failed", {
      status: response.status,
      statusText: response.statusText,
      message,
      endpoint: OPENAI_ENDPOINT,
      model: MODEL,
    });
    throw new Error(message);
  }

  const message = data?.choices?.[0]?.message;
  const content = normalizeMessageContent(message);

  console.log("[OpenAI] parsed assistant content", { content });

  if (!content) {
    throw new Error("OpenAI response missing content");
  }

  return content;
}
