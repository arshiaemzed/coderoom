import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

import type { AuthStatus, User } from "./types";
import { getCurrentUser, requsetLogin } from "../api/auth";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    async function restoreSession() {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      setUser(currentUser);
      setStatus("authenticated");
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    try {
      const user: User = await requsetLogin(email, password);

      if (!user) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      setUser(user);
      setStatus("authenticated");
    } catch (err) {
      setUser(null);
      setStatus("unauthenticated");
      console.error(err);
    }
  }

  return <AuthContext value={{ user, status, login }}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
