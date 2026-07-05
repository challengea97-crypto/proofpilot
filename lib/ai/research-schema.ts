import { z } from "zod";

/**
 * Structured shape of a Live AI Research run. Kept free of any server-only
 * imports (no Anthropic SDK) so both Server Components and Client Components
 * can import the types and validator.
 */

export const CompetitorSchema = z.object({
  name: z.string().catch(""),
  category: z.enum(["direct", "indirect", "substitute"]).catch("direct"),
  positioning: z.string().catch(""),
  pricingSignal: z.string().catch(""),
});

// `.catch(...)` keeps parsing resilient to small model deviations rather than
// hard-failing the whole run.
export const ResearchResultSchema = z.object({
  opportunityScore: z.number().min(0).max(100).catch(60),
  confidence: z.number().min(0).max(100).catch(55),
  summary: z.string().catch(""),
  competitors: z.array(CompetitorSchema).catch([]),
  demandSignals: z.array(z.string()).catch([]),
  reviewComplaints: z.array(z.string()).catch([]),
  differentiators: z.array(z.string()).catch([]),
  risks: z.array(z.string()).catch([]),
  nextActions: z.array(z.string()).catch([]),
});

export type Competitor = z.infer<typeof CompetitorSchema>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;

/** JSON Schema for the tool Claude is forced to call (structured output). */
export const RESEARCH_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    opportunityScore: { type: "number", description: "Overall opportunity score, 0-100." },
    confidence: { type: "number", description: "Confidence in this directional analysis, 0-100." },
    summary: { type: "string", description: "Honest 2-4 sentence assessment." },
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string", enum: ["direct", "indirect", "substitute"] },
          positioning: { type: "string" },
          pricingSignal: { type: "string", description: "What is known/inferable about their pricing." },
        },
        required: ["name", "category", "positioning", "pricingSignal"],
        additionalProperties: false,
      },
    },
    demandSignals: { type: "array", items: { type: "string" } },
    reviewComplaints: {
      type: "array",
      items: { type: "string" },
      description: "Common complaints about incumbent solutions.",
    },
    differentiators: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
  },
  required: [
    "opportunityScore",
    "confidence",
    "summary",
    "competitors",
    "demandSignals",
    "reviewComplaints",
    "differentiators",
    "risks",
    "nextActions",
  ],
  additionalProperties: false,
};
