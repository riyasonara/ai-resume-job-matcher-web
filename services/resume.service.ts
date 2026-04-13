import { api } from "@/lib/api";
import type { ResumeUploadResponse } from "@/lib/api-types";

export type UploadResumeOptions = {
  onUploadProgress?: (percent: number) => void;
};

export async function uploadResume(
  file: File,
  options?: UploadResumeOptions
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ResumeUploadResponse>(
    "/api/resume/upload",
    formData,
    {
      onUploadProgress: (event) => {
        const total = event.total;
        if (!options?.onUploadProgress || total == null || total === 0) {
          return;
        }
        const percent = Math.round((event.loaded * 100) / total);
        options.onUploadProgress(percent);
      },
    }
  );

  return data;
}
