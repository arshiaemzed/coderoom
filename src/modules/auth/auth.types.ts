interface User {
  id: string;
  email: string;
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
