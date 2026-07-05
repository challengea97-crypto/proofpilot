import { groqJson } from "@/lib/ai/groq";
import { ResearchResultSchema, type ResearchResult } from "@/lib/ai/research-schema";
import type { ResearchBrief } from "@/lib/report";

const SYSTEM = `You are a rigorous, honest startup-validation analyst.
Respond with ONLY a valid JSON object (no prose, no markdown fences) matching exactly this shape:
{
  "opportunityScore": <number 0-100>,
  "confidence": <number 0-100>,
  "summary": <string, 2-4 sentences>,
  "competitors": [{ "name": <string>, "category": "direct" | "indirect" | "substitute", "positioning": <string>, "pricingSignal": <string> }],
  "demandSignals": [<string>],
  "reviewComplaints": [<string>],
  "differentiators": [<string>],
  "risks": [<string>],
  "nextActions": [<string>]
}
Be specific and realistic. Treat conclusions as hypotheses to validate, not facts. Do not invent citations, URLs, or fabricated statistics.`;

/** Runs a real Groq analysis of the brief and returns a validated result. */
export async function runResearch(brief: ResearchBrief): Promise<ResearchResult> {
  const raw = await groqJson(
    SYSTEM,
    `Analyze this startup idea and return the JSON object.\n\nIdea: ${brief.idea}\nAudience: ${brief.audience || "(not specified)"}\nProblem: ${brief.problem || "(not specified)"}`
  );
  return ResearchResultSchema.parse(raw);
}
