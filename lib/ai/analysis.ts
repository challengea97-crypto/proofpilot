import { groqJson, groqText } from "@/lib/ai/groq";
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
Example of the bar:
BAD item:  "Promote on social media."
GOOD item: "Post 3x/week in r/sweatystartup and two local Facebook groups; target 50 waitlist signups in 30 days."
Treat conclusions as recommendations to validate. Do not invent statistics or citations.`;

/** Runs a real Groq analysis for the given module kind and validates it. */
export async function runAnalysis(kind: AnalysisKind, brief: ResearchBrief): Promise<AnalysisResult> {
  if (kind === "signals") return runWebSignals(brief);

  const config = ANALYSIS_CONFIG[kind];
  const raw = await groqJson(
    SYSTEM,
    `${config.instruction}\n\nIdea: ${brief.idea}\nAudience: ${brief.audience || "(not specified)"}\nProblem: ${brief.problem || "(not specified)"}\n\nReturn the JSON object now.`,
    config.model
  );
  return AnalysisResultSchema.parse(raw);
}

/**
 * Web Signals runs in two steps: a free-text browse on Groq's web-capable
 * compound model (JSON mode suppresses its web tool), then a structuring pass.
 * Returns a clear empty result if live retrieval genuinely fails.
 */
async function runWebSignals(brief: ResearchBrief): Promise<AnalysisResult> {
  const query =
    `Use web search to gather recent, real information about the MARKET for this idea. ` +
    `Run searches for: named direct competitors and their recent launches or news; funding rounds ` +
    `in this category; market-size or growth data; and relevant community / forum discussion.\n\n` +
    `Idea: ${brief.idea}\nAudience: ${brief.audience || "(not specified)"}\nProblem: ${brief.problem || "(not specified)"}\n\n` +
    `Report each concrete finding on its own line, with a date where known and always the source URL. ` +
    `Prefer citing several real URLs over saying nothing.`;

  const notes = await groqText(
    "You are a market-research analyst with live web access. Always run web searches and cite real source URLs for every claim.",
    query,
    ANALYSIS_CONFIG.signals.model
  );

  // Only treat it as usable if the browse actually produced source URLs.
  if (!notes || !/https?:\/\//i.test(notes)) {
    return {
      headline: "No sourced web signals could be retrieved for this idea right now — try again shortly.",
      sections: [
        { title: "Recent signals", items: [] },
        { title: "Sources", items: [] },
      ],
    };
  }

  const structured = await groqJson(
    `Convert the research notes into ONLY this JSON object (no prose): ` +
      `{"headline": string, "sections": [{"title": "Recent signals", "items": [string]}, {"title": "Sources", "items": [string]}]}. ` +
      `Put each distinct signal as an item under "Recent signals"; put every source URL as an item under "Sources". ` +
      `Do not invent facts or URLs beyond what the notes contain.`,
    `Research notes:\n${notes}\n\nReturn the JSON object now.`
  );
  return AnalysisResultSchema.parse(structured);
}
