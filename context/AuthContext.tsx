"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { loginUser, registerUser } from "@/services/auth.service";
import { extractAuthToken, extractUser } from "@/lib/auth-token";
import { getAxiosMessage } from "@/lib/api";
import { clearStoredToken, persistToken, readStoredToken } from "@/lib/session";
import type { User } from "@/lib/types";
import { queryKeys } from "@/lib/query-keys";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isSigningIn: boolean;
  isSigningUp: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = readStoredToken();
    if (t) setToken(t);
    setIsReady(true);
  }, []);

  const applySession = useCallback(
    (t: string, u: User | null) => {
      persistToken(t);
      setToken(t);
      setUser(u);
    },
    [queryClient]
  );

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const t = extractAuthToken(data);
      if (!t) {
        toast.error("Sign-in failed: no token returned from server.");
        return;
      }
      applySession(t, extractUser(data));
      toast.success("Signed in successfully");
      router.push("/upload");
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(getAxiosMessage(err, "Invalid email or password"));
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const t = extractAuthToken(data);
      if (t) {
        applySession(t, extractUser(data));
        toast.success("Welcome! Your account is ready.");
        router.push("/upload");
        router.refresh();
      } else {
        toast.success("Account created. Please sign in.");
        router.push("/login");
      }
    },
    onError: (err: unknown) => {
      toast.error(getAxiosMessage(err, "Registration failed"));
    },
  });

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    queryClient.clear();
    router.push("/login");
    router.refresh();
  }, [queryClient, router]);

  const value: AuthContextValue = {
    token,
    user,
    isReady,
    signIn: async (email, password) => {
      await loginMutation.mutateAsync({ email, password });
    },
    signUp: async (email, password) => {
      await registerMutation.mutateAsync({ email, password });
    },
    logout,
    isSigningIn: loginMutation.isPending,
    isSigningUp: registerMutation.isPending,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
