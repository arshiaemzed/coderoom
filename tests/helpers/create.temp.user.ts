import db from "../test.db.pool";
import type { TestUser } from "../test.types";
import argon2 from "argon2";

async function createTempUser(
  email: string,
  password: string,
): Promise<TestUser> {
  // the default algorithm for hashing is argon2id
  const hashedPassword = await argon2.hash(password, {
    hashLength: 64,
    memoryCost: 2 ** 16, // 2^16 = 65536 KiB / 64 MIB
  });

  const query = await db.query(
    `
    INSERT INTO users 
        (email, password) 
        VALUES($1, $2)
    RETURNING 
        id,
        email, 
        created_at AS "createdAt";
    `,
    [email, hashedPassword],
  );

  return {
    id: query.rows[0].id,
    email: query.rows[0].email,
    password: password,
    createdAt: query.rows[0].createdAt,
  };
}

export default createTempUser;
