import { getGroqKey, getGroqModel } from "@/lib/env";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Calls Groq (OpenAI-compatible) in JSON mode and returns the parsed object.
 * Throws a clear error on transport/parse failure; callers validate with zod.
 */
export async function groqJson(system: string, user: string): Promise<unknown> {
  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqKey()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: getGroqModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`AI request failed (${response.status}). ${detail.slice(0, 180)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("AI returned no content.");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }
}
