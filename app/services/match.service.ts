import { api } from "@/lib/api";

export type RecommendedJob = {
  jobId: string;
  title: string;
  company: string;
  score: number;
};

export const getRecommendedJobs = async () => {
  const response = await api.get<RecommendedJob[]>(`/api/match/recommend`);
  return response.data;
};

