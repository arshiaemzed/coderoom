import authRepository from "../../../modules/auth/auth.repository.js";
import crypto from "crypto";
import WebSocketError from "../websocket.error.js";
import type { AuthSession } from "../../../modules/auth/auth.types.js";

async function auth(token: string): Promise<AuthSession> {
  const tokenHash: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const valid: AuthSession | undefined =
    await authRepository.findSessionByTokenHash(tokenHash);

  if (!valid) {
    throw new WebSocketError("INVALID_AUTH_SESSION", "Auth session not found.");
  }

  return valid;
}

export default {
  auth,
};
