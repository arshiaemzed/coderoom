interface User {
  user_id: string;
  display_name: string;
  token: string;
}

interface UserPasswordInfo {
  id: string;
  password: string;
}

interface AuthSession {
  id: string;
  userId: string;
  displayName: string;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
}

export type { User, UserPasswordInfo, AuthSession };
