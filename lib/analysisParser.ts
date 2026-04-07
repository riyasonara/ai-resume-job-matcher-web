export function parseAnalysisResponse(data: {
  score: number;
  analysis: string;
}) {
  const text = data.analysis;

  const extractSection = (title: string) => {
    const regex = new RegExp(`\\*\\*${title}:\\*\\*([\\s\\S]*?)(\\n\\n|$)`);
    const match = text.match(regex);

    if (!match) return [];

    return match[1]
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  };

  return {
    score: Math.round(data.score),
    strengths: extractSection("Strengths"),
    missingSkills: extractSection("Missing Skills"),
    suggestions:
      extractSection("Suggestions").join(" ") || text,
  };
}