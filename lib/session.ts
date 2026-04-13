import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = "token";

export function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function persistToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  Cookies.set(AUTH_TOKEN_KEY, token, { path: "/" });
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
}

/** Hard redirect after 401 so all client state resets. */
export function redirectToLogin(): void {
  clearStoredToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
