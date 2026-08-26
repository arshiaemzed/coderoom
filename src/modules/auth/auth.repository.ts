import db from "../../infrastructure/postgres/pool.js";
import {
  type AuthSession,
  type User,
  type UserPasswordInfo,
} from "./auth.types.js";

async function signUp(
  email: string,
  passwordHash: string,
  displayName: string,
): Promise<User> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const query = await client.query<User>(
      "INSERT INTO users (email, password) VALUES($1, $2) RETURNING id, email;",
      [email, passwordHash],
    );

    const user = query.rows[0];

    if (!user) {
      throw new Error("Failed to create the user.");
    }

    await client.query(
      "INSERT INTO profiles(user_id, display_name) VALUES ($1, $2)",
      [user.id, displayName],
    );

    await client.query("COMMIT;");

    return user;
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    await client.release();
  }
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
): Promise<AuthSession | undefined> {
  const query = await db.query(
    `
    WITH created_session AS (
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
    )
    SELECT 
      created_session.id, 
      created_session."userId",
      created_session."tokenHash",
      created_session."createdAt",
      profiles.display_name AS "displayName"
    FROM created_session
    JOIN profiles 
      ON profiles.user_id = created_session."userId"
  `,
    [tokenHash, userId],
  );

  const result: AuthSession | undefined = query.rows[0];

  return result;
}

async function findSessionByTokenHash(
  tokenHash: string,
): Promise<AuthSession | undefined> {
  const query = await db.query<AuthSession>(
    `
    SELECT 
      user_sessions.id, 
      user_sessions.user_id AS "userId",
      user_sessions.token_hash AS "tokenHash",
      user_sessions.created_at AS "createdAt",
      profiles.display_name AS "displayName",
      user_sessions.expires_at AS "expiresAt"
    FROM user_sessions
    JOIN profiles ON profiles.user_id = user_sessions.user_id
    WHERE user_sessions.token_hash = $1
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
