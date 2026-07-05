import { z } from "zod";

/**
 * Generic analysis framework. Every Phase-3 module (Strategy, MVP, Pricing,
 * Landing) produces the same `{ headline, sections[] }` shape, so one engine,
 * one validator and one renderer drive them all — no duplicated components.
 * (The richer Research module keeps its own bespoke shape.)
 */

export const AnalysisSectionSchema = z.object({
  title: z.string().catch(""),
  items: z.array(z.string()).catch([]),
});

export const AnalysisResultSchema = z.object({
  headline: z.string().catch(""),
  sections: z.array(AnalysisSectionSchema).catch([]),
});

export type AnalysisSection = z.infer<typeof AnalysisSectionSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export const ANALYSIS_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    headline: { type: "string", description: "One-line takeaway for this analysis." },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["title", "items"],
        additionalProperties: false,
      },
    },
  },
  required: ["headline", "sections"],
  additionalProperties: false,
};

export const ANALYSIS_KINDS = ["signals", "swot", "strategy", "mvp", "pricing", "landing"] as const;
export type AnalysisKind = (typeof ANALYSIS_KINDS)[number];

export function isAnalysisKind(value: string): value is AnalysisKind {
  return (ANALYSIS_KINDS as readonly string[]).includes(value);
}

export const ANALYSIS_CONFIG: Record<
  AnalysisKind,
  { title: string; description: string; instruction: string; model?: string }
> = {
  signals: {
    title: "Web Signals",
    description: "Live web scan — recent market signals with their sources.",
    instruction:
      "Search the web for recent, real market signals relevant to this idea (funding news, competitor launches, trend data, community discussion). Use sections titled exactly: Recent signals, Sources. Each signal item must be a specific, dated-where-possible fact from your search — no invented facts. The Sources section items must be the URLs you actually used.",
    model: "groq/compound-mini",
  },
  swot: {
    title: "SWOT",
    description: "Strengths, weaknesses, opportunities and threats — the classic lens.",
    instruction:
      "Produce a rigorous SWOT analysis of this idea. Use sections titled exactly: Strengths, Weaknesses, Opportunities, Threats. 3-5 items per section, each specific to THIS idea and market — no generic filler.",
  },
  strategy: {
    title: "AI Strategy",
    description: "Positioning, USP, go-to-market and a 30-day launch plan.",
    instruction:
      "Produce a go-to-market strategy. Use sections titled exactly: Positioning, Unique value proposition, Go-to-market channels, Pricing recommendation, 30-day launch plan, Key metrics to watch. Each section's items should be concrete and specific.",
  },
  mvp: {
    title: "MVP Planner",
    description: "Scope the smallest lovable product worth building.",
    instruction:
      "Plan the smallest lovable MVP. Use sections titled exactly: Must-have features, Should-have (next), Explicitly out of scope, Build milestones, Success metrics. Be ruthless about scope.",
  },
  pricing: {
    title: "Pricing",
    description: "Model, tiers and willingness-to-pay.",
    instruction:
      "Recommend pricing. Use sections titled exactly: Recommended pricing model, Suggested tiers, Willingness-to-pay signals, Benchmarks and risks. For tiers, each item should read 'Name — price — who it is for'.",
  },
  landing: {
    title: "Landing Page",
    description: "High-converting structure and copy.",
    instruction:
      "Design a high-converting landing page. Use sections titled exactly: Headline options, Hero subcopy, Recommended page structure, Primary call-to-action, Conversion best-practices. Headline options should be 3-5 distinct, punchy candidates.",
  },
};
