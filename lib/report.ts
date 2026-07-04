export type ResearchBrief = {
  idea: string;
  audience: string;
  problem: string;
};

export function scoreBrief(brief: ResearchBrief) {
  const raw = brief.idea.length + brief.audience.length + brief.problem.length;
  return Math.max(55, Math.min(94, 62 + (raw % 30)));
}

export function generateLocalReport(brief: ResearchBrief) {
  const score = scoreBrief(brief);
  return {
    score,
    confidence: Math.max(50, score - 7),
    summary:
      "This is a directional AI validation report. Treat conclusions as hypotheses until backed by interviews, payment tests, and source-linked evidence.",
    competitors: [
      "Direct validators",
      "Market research platforms",
      "SEO and competitor intelligence suites",
      "Spreadsheets plus general AI chat"
    ],
    evidence: [
      "Need source-backed competitor analysis.",
      "Need real complaint mining.",
      "Need paid CTA validation before building deeply."
    ],
    nextActions: [
      "Run 10 buyer interviews.",
      "Add 5 competitor URLs.",
      "Test a paid Founder Report CTA.",
      "Publish a sample report.",
      "Collect review snippets from public sources."
    ]
  };
}
