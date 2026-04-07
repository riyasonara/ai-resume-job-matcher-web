import { api } from "@/lib/api";

export const uploadResume = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
        if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress?.(percent);
        }
    }
  });
  return response.data;
};
