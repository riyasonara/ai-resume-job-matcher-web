import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { readStoredToken, redirectToLogin } from "@/lib/session";

function normalizeApiBase(raw: string | undefined): string {
  const fallback = "http://localhost:5000";
  if (!raw?.trim()) return fallback;
  let u = raw.trim().replace(/\/$/, "");
  if (u.endsWith("/api")) u = u.slice(0, -4);
  return u || fallback;
}

const baseURL = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; title?: string }>) => {
    const status = error.response?.status;

    if (status === 401) {
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export function getAxiosMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      const msg =
        (data as { message?: string }).message ??
        (data as { title?: string }).title;
      if (typeof msg === "string" && msg.length > 0) return msg;
    }
    if (typeof error.message === "string" && error.message.length > 0) {
      return error.message;
    }
  }
  return fallback;
}
