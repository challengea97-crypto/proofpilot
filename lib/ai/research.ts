import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic } from "@/lib/ai/anthropic";
import { getAnthropicModel } from "@/lib/env";
import { ResearchResultSchema, RESEARCH_TOOL_SCHEMA, type ResearchResult } from "@/lib/ai/research-schema";
import type { ResearchBrief } from "@/lib/report";

const SYSTEM_PROMPT = `You are a rigorous, honest startup-validation analyst.
Analyze the idea and produce a directional validation report.
Be specific and realistic. Treat every conclusion as a hypothesis to validate, not an established fact.
Do NOT invent citations, URLs, or fabricated statistics — reason from plausible market knowledge and clearly frame outputs as directional.`;

const TOOL_NAME = "submit_validation_report";

/**
 * Runs a real Claude analysis of the brief and returns a validated result.
 * Uses forced tool-use for reliable structured output across SDK versions.
 */
export async function runResearch(brief: ResearchBrief): Promise<ResearchResult> {
  const client = getAnthropic();

  const tool: Anthropic.Tool = {
    name: TOOL_NAME,
    description: "Submit the structured startup validation analysis.",
    input_schema: RESEARCH_TOOL_SCHEMA,
  };

  const message = await client.messages.create({
    model: getAnthropicModel(),
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [tool],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [
      {
        role: "user",
        content: `Analyze this startup idea and call ${TOOL_NAME} with your analysis.

Idea: ${brief.idea}
Audience: ${brief.audience || "(not specified)"}
Problem: ${brief.problem || "(not specified)"}`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("The model did not return a structured report. Please try again.");
  }

  return ResearchResultSchema.parse(toolUse.input);
}
