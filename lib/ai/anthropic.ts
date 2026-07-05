import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey } from "@/lib/env";

/** Anthropic client. Throws a clear error when ANTHROPIC_API_KEY is unset. */
export function getAnthropic(): Anthropic {
  return new Anthropic({ apiKey: getAnthropicApiKey() });
}
