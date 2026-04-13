/** DTOs aligned with ResumeMatcher.API (camelCase JSON). */

export type LoginCommand = {
  email: string;
  password: string;
};

export type RegisterCommand = {
  email: string;
  password: string;
};

export type CompareWithJobCommand = {
  jobDescription: string;
  userId?: string;
};

export type RecommendedJob = {
  jobId: string;
  title: string;
  company: string;
  score: number;
};

export type ResumeUploadResponse = {
  id: string;
  fileName: string;
  message?: string;
};

export type ResumeAnalysisRequest = {
  resumeText: string;
};

export type ResumeAnalysisApiResponse = {
  score: number;
  analysis?: string;
  strengths?: string[];
  missingSkills?: string[];
  suggestions?: string;
  improvedResume?: string;
};

export type NormalizedResumeAnalysis = {
  score: number;
  strengths: string[];
  missingSkills: string[];
  suggestions: string;
  improvedResume: string;
};

export type InterviewQuestion = {
  question: string;
  answer: string;
};

/** API shape: parallel arrays keyed by index. */
export type InterviewApiResponse = {
  questions: string[];
  answers: string[];
};
