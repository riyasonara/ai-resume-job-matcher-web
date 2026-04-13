import { api } from "@/lib/api";
import type { CompareWithJobCommand, RecommendedJob } from "@/lib/api-types";

export type CompareMatchResult = {
  score: number;
  matchLevel: string;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  insights: string[];
};

function normalizeCompare(data: unknown): CompareMatchResult {
  if (!data || typeof data !== "object") {
    return {
      score: 0,
      matchLevel: "Unknown",
      summary: "",
      matchingSkills: [],
      missingSkills: [],
      insights: [],
    };
  }

  const o = data as Record<string, unknown>;
  const score = Number(o.score ?? o.matchScore ?? 0);
  const strengths = o.strengths ?? o.matchingSkills ?? o.MatchingSkills;
  const missing = o.missingSkills ?? o.MissingSkills;
  const insightsRaw = o.insights ?? o.suggestions ?? o.Suggestions;

  let insights: string[] = [];
  if (Array.isArray(insightsRaw)) {
    insights = insightsRaw.map(String);
  } else if (typeof insightsRaw === "string") {
    insights = insightsRaw ? [insightsRaw] : [];
  }

  const matchingSkills = Array.isArray(strengths)
    ? strengths.map(String)
    : [];
  const missingSkills = Array.isArray(missing) ? missing.map(String) : [];

  const summary =
    typeof o.summary === "string"
      ? o.summary
      : typeof o.suggestions === "string" && !Array.isArray(insightsRaw)
        ? o.suggestions
        : "";

  const rounded = Math.round(score);
  const matchLevel =
    typeof o.matchLevel === "string"
      ? o.matchLevel
      : rounded >= 80
        ? "High Match"
        : rounded >= 50
          ? "Medium Match"
          : "Low Match";

  return {
    score: rounded,
    matchLevel,
    summary,
    matchingSkills,
    missingSkills,
    insights,
  };
}

export async function compareWithJob(
  body: CompareWithJobCommand
): Promise<CompareMatchResult> {
  const { data } = await api.post<unknown>("/api/Match/compare", body);
  return normalizeCompare(data);
}

export async function getRecommendedJobs(): Promise<RecommendedJob[]> {
  const { data } = await api.get<unknown>("/api/Match/recommend");
  if (!Array.isArray(data)) return [];
  return data
    .map((row): RecommendedJob | null => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const jobId = String(r.jobId ?? r.id ?? r.JobId ?? "");
      const title = String(r.title ?? r.Title ?? "");
      const company = String(r.company ?? r.Company ?? "");
      const score = Number(r.score ?? r.Score ?? 0);
      if (!jobId || !title) return null;
      return { jobId, title, company, score };
    })
    .filter((x): x is RecommendedJob => x !== null);
}
