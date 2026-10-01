import authRepository from "./auth.repository.js";
import AppError from "../../shared/errors/error.js";
import argon2 from "argon2";
import errorCodes from "../../shared/errors/errorCodes.js";
import crypto from "crypto";
import type { AuthSession, User, UserPasswordInfo } from "./auth.types.js";

async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const userExists: boolean = await authRepository.userExists(email);

  if (userExists) {
    throw new AppError(
      401,
      "User already exists with that email.",
      errorCodes.USER_ALREADY_EXISTS,
    );
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
    throw new AppError(
      401,
      "Invalid credentials.",
      errorCodes.INVALID_CREDENTIALS,
    );
  }

  const passwordMatch: boolean = await argon2.verify(user.password, password);

  if (!passwordMatch) {
    throw new AppError(
      401,
      "Invalid credentials.",
      errorCodes.INVALID_CREDENTIALS,
    );
  }

  const rawToken: string = crypto.randomBytes(32).toString("hex");

  const tokenHash: string = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const createdSession: AuthSession | undefined =
    await authRepository.createAuthSession(tokenHash, user.id);

  if (!createdSession) {
    throw new AppError(
      500,
      "Failed to create session.",
      errorCodes.FAILED_TO_CREATE_AUTH_SESSION,
    );
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

  console.log(tokenHash);

  const authSession = await authRepository.validateSession(tokenHash);

  if (!authSession) {
    throw new AppError(
      401,
      "Unauthorized.",
      errorCodes.INVALID_COOKIE_BASED_TOKEN,
    );
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
