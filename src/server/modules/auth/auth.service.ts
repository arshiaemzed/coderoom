import authRepository from "./auth.repository.js";
import AppError from "../../shared/errors/error.js";
import argon2 from "argon2";
import crypto from "crypto";
import type { AuthSession, User, UserPasswordInfo } from "./auth.types.js";

async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const userExists: boolean = await authRepository.userExists(email);

  if (userExists) {
    throw new AppError({
      statusCode: 401,
      errorCode: "USER_ALREADY_EXISTS",
      errorMessage: "Account already exists.",
    });
  }

  // the default algorithm for hashing is argon2id
  const hashedPassword: string = await argon2.hash(password, {
    hashLength: 64,
    memoryCost: 2 ** 16, // 2^16 = 65536 KiB / 64 MIB
  });

  const user: User = await authRepository.signUp(
    email,
    hashedPassword,
    displayName,
  );

  return user;
}

async function login(email: string, password: string) {
  const user: UserPasswordInfo | undefined =
    await authRepository.findUser(email);

  if (!user) {
    throw new AppError({
      statusCode: 401,
      errorCode: "INVALID_CREDENTIALS",
      errorMessage: "Invalid credentials.",
    });
  }

  const passwordMatch: boolean = await argon2.verify(user.password, password);

  if (!passwordMatch) {
    throw new AppError({
      statusCode: 401,
      errorCode: "INVALID_CREDENTIALS",
      errorMessage: "Invalid credentials.",
    });
  }

  const rawToken: string = crypto.randomBytes(32).toString("hex");

  const tokenHash: string = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const createdSession: AuthSession | undefined =
    await authRepository.createAuthSession(tokenHash, user.id);

  if (!createdSession) {
    throw new AppError({
      statusCode: 500,
      errorCode: "FAILED_TO_CREATE_AUTH_SESSION",
      errorMessage: "Failed to create session.",
    });
  }

  return {
    id: createdSession.userId,
    displayName: createdSession.displayName,
    token: rawToken,
  };
}

async function authMe(rawToken: string) {
  const tokenHash: string = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const authSession = await authRepository.validateSession(tokenHash);

  if (!authSession) {
    throw new AppError({
      statusCode: 401,
      errorCode: "INVALID_COOKIE_BASED_TOKEN",
      errorMessage: "Unauthorized.",
    });
  }
  return {
    displayName: authSession.displayName,
    userId: authSession.userId,
    token: rawToken,
  };
}

export default {
  login,
  signUp,
  authMe,
};
