import db from "../../infrastructure/postgres/pool.js";
import {
  type AuthSession,
  type User,
  type UserPasswordInfo,
} from "./auth.types.js";

async function signUp(email: string, passwordHash: string): Promise<User> {
  const query = await db.query<User>(
    "INSERT INTO users (email, password) VALUES($1, $2) RETURNING id, email;",
    [email, passwordHash],
  );

  const user = query.rows[0];

  if (!user) {
    throw new Error("Failed to create the user.");
  }

  return user;
}

async function userExists(email: string): Promise<boolean> {
  const query = await db.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  const found = query.rowCount === null ? false : query.rowCount > 0;

  return found;
}

async function findUser(email: string): Promise<UserPasswordInfo | undefined> {
  const query = await db.query<UserPasswordInfo>(
    "SELECT id, password FROM users WHERE email = $1",
    [email],
  );

  const result = query.rows[0];

  return result;
}

async function createAuthSession(
  tokenHash: string,
  userId: string,
): Promise<AuthSession> {
  const query = await db.query<AuthSession>(
    `
    INSERT INTO user_sessions 
      (token_hash, user_id, expires_at) 
    VALUES
      ($1, $2, NOW() + INTERVAL '7d')
    RETURNING 
      id,
      user_id AS "userId",
      token_hash AS "tokenHash",
      created_at AS "createdAt",
      expires_at AS "expiresAt"
    `,
    [tokenHash, userId],
  );

  const result = query.rows[0];

  if (!result) {
    throw new Error("Failed to create session.");
  }

  return result;
}

async function findSessionByTokenHash(
  tokenHash: string,
): Promise<AuthSession | undefined> {
  const query = await db.query(
    `
    SELECT 
      id, 
      user_id AS "userId",
      token_hash AS "tokenHash",
      created_at AS "createdAt",
      expires_at AS "expiresAt"
    FROM user_sessions
    WHERE 
      token_hash = $1
    `,
    [tokenHash],
  );

  const result = query.rows[0];

  return result;
}

export default {
  signUp,
  userExists,
  findUser,
  createAuthSession,
  findSessionByTokenHash,
};
