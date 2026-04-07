import { api } from "@/lib/api";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const registerUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};