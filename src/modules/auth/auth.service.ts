import authRepository from "./auth.repository.js";
import AppError from "../../shared/errors/error.js";
import argon2 from "argon2";
import errorCodes from "../../shared/errors/errorCodes.js";
import crypto from "crypto";

async function signUp(email: string, password: string) {
  const userExists: boolean = await authRepository.userExists(email);

  if (userExists) {
    throw new AppError(
      401,
      "User already exists with that email.",
      errorCodes.USER_ALREADY_EXISTS,
    );
  }

  // the default algorithm for hashing is argon2id
  const hashedPassword = await argon2.hash(password, {
    hashLength: 64,
    memoryCost: 2 ** 16, // 2^16 = 65536 KiB / 64 MIB
  });

  const user = await authRepository.signUp(email, hashedPassword);

  return user;
}

async function login(email: string, password: string) {
  const user = await authRepository.findUser(email);

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

  const sessionToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(sessionToken)
    .digest("hex");

  await authRepository.createAuthSession(tokenHash, user.id);

  return { id: user.id, token: sessionToken };
}

export default {
  login,
  signUp,
};
