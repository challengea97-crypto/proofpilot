import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic } from "@/lib/ai/anthropic";
import { getAnthropicModel } from "@/lib/env";
import {
  ANALYSIS_CONFIG,
  ANALYSIS_TOOL_SCHEMA,
  AnalysisResultSchema,
  type AnalysisKind,
  type AnalysisResult,
} from "@/lib/ai/analysis-kinds";
import type { ResearchBrief } from "@/lib/report";

const TOOL_NAME = "submit_analysis";

const SYSTEM_PROMPT = `You are a sharp startup advisor. Produce concrete, specific, honest analysis.
Treat conclusions as recommendations to validate, not guarantees. Do not invent statistics or citations.`;

/** Runs a real Claude analysis for the given module kind and validates it. */
export async function runAnalysis(kind: AnalysisKind, brief: ResearchBrief): Promise<AnalysisResult> {
  const client = getAnthropic();
  const config = ANALYSIS_CONFIG[kind];

  const tool: Anthropic.Tool = {
    name: TOOL_NAME,
    description: "Submit the structured analysis.",
    input_schema: ANALYSIS_TOOL_SCHEMA,
  };

  const message = await client.messages.create({
    model: getAnthropicModel(),
    max_tokens: 3072,
    system: SYSTEM_PROMPT,
    tools: [tool],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [
      {
        role: "user",
        content: `${config.instruction}

Idea: ${brief.idea}
Audience: ${brief.audience || "(not specified)"}
Problem: ${brief.problem || "(not specified)"}

Call ${TOOL_NAME} with your analysis.`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("The model did not return a structured analysis. Please try again.");
  }

  return AnalysisResultSchema.parse(toolUse.input);
}
