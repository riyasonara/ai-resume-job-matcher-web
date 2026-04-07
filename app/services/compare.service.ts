import { api } from "@/lib/api";

export const compareJob = async (jobDescription: string) => {
  const response = await api.post("/api/match/compare", {
    jobDescription,
  });

  return response.data;
};