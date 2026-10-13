import authRepository from "../../../modules/auth/auth.repository.js";
import crypto from "crypto";
import type { AuthSession } from "../../../modules/auth/auth.types.js";
import AppError from "../../../shared/errors/error.js";

async function auth(token: string): Promise<AuthSession> {
  const tokenHash: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const valid: AuthSession | undefined =
    await authRepository.findSessionByTokenHash(tokenHash);

  if (!valid) {
    throw new AppError({
      errorCode: "AUTH_SESSION_NOT_FOUND",
      errorMessage: "Auth session not found.",
    });
  }

  return valid;
}

export default {
  auth,
};
