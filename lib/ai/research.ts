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
Be specific and realistic. Treat conclusions as hypotheses to validate, not facts. Do not invent citations, URLs, or fabricated statistics.

Scoring calibration — use the FULL 0-100 range honestly:
- 80+: rare; exceptional wedge, timing and demand evidence.
- 60-79: promising but with real, named risks.
- 40-59: crowded market or weak differentiation; proceed only with a sharper wedge.
- Below 40: serious structural problems (no demand, impossible economics, dominant incumbents).
Never default to the 65-75 comfort zone; justify the score in the summary.

Competitors: name REAL companies/products when they exist (not categories like "various apps").
Every list item must be specific to THIS idea — generic filler ("do marketing", "build an MVP") is a failure.

Quality bar for nextActions — each one must name WHO to reach, HOW MANY, WHERE to find them, and a measurable SUCCESS CRITERION.
BAD:  "Run customer interviews."
GOOD: "Interview 10 urban dog owners recruited from 3 local Facebook pet groups; success = 6+ paid for pet sitting in the last 3 months."`;

const REFINE_SYSTEM = `You are a demanding startup mentor reviewing a junior analyst's validation report (JSON).
Return ONLY the improved JSON object in the exact same shape. Improve it by:
- Rewriting any vague nextActions so each names WHO, HOW MANY, WHERE, and a measurable success criterion.
- Rewriting any generic risks/differentiators to be specific to this exact idea and market.
- Replacing competitor category labels with real company/product names where they exist.
- Keeping the score honest per the analyst's evidence (adjust only if clearly miscalibrated).
Do not add fields. Do not remove sections. Do not invent statistics or URLs.`;

/**
 * Two-pass research: a draft analysis, then a mentor-critique pass that
 * rewrites anything vague into concrete, measurable guidance. Falls back to
 * the draft if refinement fails — a run never gets worse.
 */
export async function runResearch(brief: ResearchBrief): Promise<ResearchResult> {
  const briefText = `Idea: ${brief.idea}\nAudience: ${brief.audience || "(not specified)"}\nProblem: ${brief.problem || "(not specified)"}`;

  const draftRaw = await groqJson(SYSTEM, `Analyze this startup idea and return the JSON object.\n\n${briefText}`);
  const draft = ResearchResultSchema.parse(draftRaw);

  try {
    const refinedRaw = await groqJson(
      REFINE_SYSTEM,
      `The idea being validated:\n${briefText}\n\nThe analyst's draft report JSON:\n${JSON.stringify(draft)}\n\nReturn the improved JSON now.`
    );
    return ResearchResultSchema.parse(refinedRaw);
  } catch {
    return draft;
  }
}
