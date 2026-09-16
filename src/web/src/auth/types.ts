type User = {
  user_id: string;
  display_name: string;
};

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export type { User, AuthStatus };
