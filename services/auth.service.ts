import { api } from "@/lib/api";
import type { LoginCommand, RegisterCommand } from "@/lib/api-types";

export async function loginUser(body: LoginCommand): Promise<unknown> {
  const { data } = await api.post<unknown>("/api/Auth/login", body);
  return data;
}

export async function registerUser(body: RegisterCommand): Promise<unknown> {
  const { data } = await api.post<unknown>("/api/Auth/register", body);
  return data;
}
