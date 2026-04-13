import type { User } from "@/lib/types";

export function extractAuthToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const t = o.token ?? o.accessToken ?? o.Token ?? o.access_token;
  return typeof t === "string" && t.length > 0 ? t : null;
}

export function extractUser(data: unknown): User | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const u = o.user;
  if (u && typeof u === "object") {
    const ur = u as Record<string, unknown>;
    const id = ur.id ?? ur.userId;
    const email = ur.email;
    if (typeof id === "string" && typeof email === "string") {
      return {
        id,
        email,
        fullName: typeof ur.fullName === "string" ? ur.fullName : undefined,
      };
    }
  }
  if (typeof o.email === "string") {
    return {
      id: typeof o.id === "string" ? o.id : "me",
      email: o.email,
    };
  }
  return null;
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function userIdFromToken(token: string | null): string | undefined {
  if (!token) return undefined;
  const p = parseJwtPayload(token);
  if (!p) return undefined;
  const sub = p.sub ?? p.userId ?? p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  return typeof sub === "string" ? sub : undefined;
}
