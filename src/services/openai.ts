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

const collectTextSegments = (
  value: unknown,
  visited = new Set<unknown>()
): string[] => {
  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (typeof value !== "object") {
    return [];
  }

  if (visited.has(value)) {
    return [];
  }

  visited.add(value);

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTextSegments(item, visited));
  }

  const record = value as Record<string, unknown>;
  const candidateKeys = [
    "content",
    "text",
    "value",
    "output_text",
    "outputText",
    "output",
    "plain_text",
    "string_value",
    "values",
    "data",
    "responses",
    "response",
    "outputs",
    "message",
    "messages",
    "parts",
    "items",
    "segments",
    "children",
  ];

  let results: string[] = [];

  for (const key of candidateKeys) {
    if (key in record) {
      results = results.concat(collectTextSegments(record[key], visited));
    }
  }

  return results;
};

const normalizeMessageContent = (message: unknown): string => {
  const segments = collectTextSegments(message);

  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    cleaned.push(trimmed);
  }

  return cleaned.join("\n").trim();
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
