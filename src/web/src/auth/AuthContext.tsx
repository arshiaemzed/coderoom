import {
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
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          setStatus("unauthenticated");
          setUser(null);
        }

        setUser(currentUser);
        setStatus("authenticated");
      } catch (error) {
        console.log(`Catched error ${error}`);
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    try {
      await requsetLogin(email, password);

      const currentUser: User | null = await getCurrentUser();

      if (!currentUser) {
        throw new Error("Unable to authenticated session.");
      }

      setStatus("authenticated");
      setUser(user);
    } catch (error) {
      console.log(`Catched error ${error}`);
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
