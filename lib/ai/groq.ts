import { getGroqKey, getGroqModel } from "@/lib/env";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 529]);
const TIMEOUT_MS = 60_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function friendlyStatusError(status: number, detail: string): Error {
  if (status === 429) return new Error("The AI is at capacity right now — try again in about 30 seconds.");
  if (status === 401 || status === 403) {
    return new Error("AI authentication failed on the server. (GROQ_API_KEY needs attention.)");
  }
  return new Error(`AI request failed (${status}). ${detail.slice(0, 160)}`);
}

/**
 * Calls Groq (OpenAI-compatible) in JSON mode and returns the parsed object.
 * Hardened: one automatic retry on rate-limit/server errors/timeouts/network
 * failures, explicit empty-output handling, and human-readable error messages.
 * `model` overrides the default (e.g. groq/compound-mini for web-search runs).
 */
export async function groqJson(system: string, user: string, model?: string): Promise<unknown> {
  let lastError: Error = new Error("AI request failed. Please try again.");

  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await sleep(1500);
    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getGroqKey()}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: model ?? getGroqModel(),
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
          max_tokens: 4096,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        lastError = friendlyStatusError(response.status, detail);
        if (RETRYABLE_STATUS.has(response.status) && attempt === 0) continue;
        throw lastError;
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || content.trim().length === 0) {
        lastError = new Error("The AI returned an empty response. Please try again.");
        if (attempt === 0) continue;
        throw lastError;
      }

      try {
        return JSON.parse(content);
      } catch {
        lastError = new Error("The AI returned an unreadable response. Please try again.");
        if (attempt === 0) continue;
        throw lastError;
      }
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "TimeoutError" || name === "AbortError") {
        lastError = new Error("The AI took too long to respond. Please try again.");
        if (attempt === 0) continue;
        throw lastError;
      }
      if (err instanceof TypeError) {
        // Network-level failure (DNS, connection reset).
        lastError = new Error("Could not reach the AI service. Please try again.");
        if (attempt === 0) continue;
        throw lastError;
      }
      throw err;
    }
  }

  throw lastError;
}

/**
 * Free-text Groq call (no JSON mode) — used for the web-search/browse step,
 * where forcing JSON suppresses the model's tool use. Returns "" on failure.
 */
export async function groqText(system: string, user: string, model?: string): Promise<string> {
  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getGroqKey()}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: model ?? getGroqModel(),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return "";
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data?.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}
