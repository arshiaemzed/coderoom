import {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

import * as EmailValidator from "email-validator";

import type { AuthStatus, User } from "./types";
import { getCurrentUser, requsetLogin } from "../api/auth";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  error: AuthError;
  login: (email: string, password: string) => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

type errorTypes = "email-field" | "password" | "system";

type AuthError = {
  type: errorTypes;
  hasError: boolean;
  message: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [status, setStatus] = useState<AuthStatus>("loading");

  const [error, setError] = useState<AuthError>({
    hasError: false,
    type: "system",
    message: "",
  });

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
      if (!EmailValidator.validate(email)) {
        setUser(null);
        setStatus("unauthenticated");
        setError({
          type: "email-field",
          hasError: true,
          message: "Please enter a valid email.",
        });
        return;
      }

      const user: User | undefined = await requsetLogin(email, password);

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
      setError({
        hasError: true,
        type: "system",
        message: String(err),
      });
      console.error(error);
    }
  }

  return (
    <AuthContext value={{ user, status, login, error }}>{children}</AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
