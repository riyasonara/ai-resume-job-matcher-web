import { api } from "@/lib/api";
import type {
  InterviewQuestion,
  NormalizedResumeAnalysis,
  ResumeAnalysisApiResponse,
  ResumeAnalysisRequest,
} from "@/lib/api-types";
import { parseAnalysisResponse } from "@/lib/analysisParser";

export async function analyzeResume(
  body: ResumeAnalysisRequest
): Promise<NormalizedResumeAnalysis> {
  const { data } = await api.post<ResumeAnalysisApiResponse>(
    "/api/Ai/resume-analysis",
    body
  );

  if (typeof data.analysis === "string" && data.analysis.length > 0) {
    const parsed = parseAnalysisResponse({
      score: data.score,
      analysis: data.analysis,
    });
    return {
      ...parsed,
      suggestions:
        typeof data.suggestions === "string" && data.suggestions.length > 0
          ? data.suggestions
          : parsed.suggestions,
      improvedResume: data.improvedResume ?? "",
    };
  }

  return {
    score: Math.round(Number(data.score) || 0),
    strengths: Array.isArray(data.strengths) ? data.strengths.map(String) : [],
    missingSkills: Array.isArray(data.missingSkills)
      ? data.missingSkills.map(String)
      : [],
    suggestions: typeof data.suggestions === "string" ? data.suggestions : "",
    improvedResume: data.improvedResume ?? "",
  };
}

function normalizeInterviewResponse(data: unknown): InterviewQuestion[] {
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      return normalizeInterviewResponse(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(data)) {
    if (
      data.length > 0 &&
      data.every((item) => typeof item === "string")
    ) {
      return (data as string[])
        .map((q) => ({ question: q.trim(), answer: "" }))
        .filter((x) => x.question.length > 0);
    }

    return data
      .map((item): InterviewQuestion | null => {
        if (!item || typeof item !== "object") return null;
        const o = item as Record<string, unknown>;
        const question = String(
          o.question ?? o.Question ?? o.text ?? ""
        ).trim();
        const answer = String(
          o.answer ?? o.Answer ?? o.suggestedAnswer ?? o.response ?? ""
        ).trim();
        if (!question) return null;
        return { question, answer };
      })
      .filter((x): x is InterviewQuestion => x !== null);
  }

  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const qRaw = o.questions ?? o.Questions;
    const aRaw = o.answers ?? o.Answers;
    if (Array.isArray(qRaw) && Array.isArray(aRaw)) {
      const n = Math.min(qRaw.length, aRaw.length);
      const paired: InterviewQuestion[] = [];
      for (let i = 0; i < n; i++) {
        const question = String(qRaw[i] ?? "").trim();
        const answer = String(aRaw[i] ?? "").trim();
        if (question.length > 0) {
          paired.push({ question, answer });
        }
      }
      return paired;
    }

    const nested = o.questions ?? o.Questions ?? o.items ?? o.Items;
    if (Array.isArray(nested)) return normalizeInterviewResponse(nested);
  }

  return [];
}

/** OpenAPI: body is JSON string (resume text). */
export async function generateInterview(
  resumeText: string
): Promise<InterviewQuestion[]> {
  const { data } = await api.post<unknown>(
    "/api/Ai/interview",
    JSON.stringify(resumeText),
    { headers: { "Content-Type": "application/json" } }
  );
  return normalizeInterviewResponse(data);
}
