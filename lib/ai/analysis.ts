import { groqJson } from "@/lib/ai/groq";
import {
  ANALYSIS_CONFIG,
  AnalysisResultSchema,
  type AnalysisKind,
  type AnalysisResult,
} from "@/lib/ai/analysis-kinds";
import type { ResearchBrief } from "@/lib/report";

const SYSTEM = `You are a sharp startup advisor.
Respond with ONLY a valid JSON object (no prose, no markdown fences) of the shape:
{ "headline": <string>, "sections": [{ "title": <string>, "items": [<string>] }] }
Rules for quality:
- Every item must be concrete and specific to THIS idea: name real channels, realistic price points, actual competitor names, measurable targets.
- Banned: generic filler like "leverage social media", "focus on quality", "do market research".
- The headline is a sharp one-sentence takeaway, not a restatement of the task.
Treat conclusions as recommendations to validate. Do not invent statistics or citations.`;

/** Runs a real Groq analysis for the given module kind and validates it. */
export async function runAnalysis(kind: AnalysisKind, brief: ResearchBrief): Promise<AnalysisResult> {
  const config = ANALYSIS_CONFIG[kind];
  const raw = await groqJson(
    SYSTEM,
    `${config.instruction}\n\nIdea: ${brief.idea}\nAudience: ${brief.audience || "(not specified)"}\nProblem: ${brief.problem || "(not specified)"}\n\nReturn the JSON object now.`,
    config.model
  );
  return AnalysisResultSchema.parse(raw);
}
