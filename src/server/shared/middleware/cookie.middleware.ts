import { type Request, type Response, type NextFunction } from "express";
import crypto from "node:crypto";
import type { AuthSession } from "../../modules/auth/auth.types.js";
import authRepository from "../../modules/auth/auth.repository.js";
import AppError from "../errors/error.js";

async function cookieMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    throw new AppError({
      statusCode: 401,
      errorCode: "INVALID_AUTHORIZATION",
      errorMessage: "Invalid authorization.",
    });
  }

  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const userSession: AuthSession | undefined =
      await authRepository.findSessionByTokenHash(tokenHash);

    if (!userSession) {
      throw new AppError({
        statusCode: 401,
        errorCode: "INVALID_AUTHORIZATION",
        errorMessage: "Invalid authorization.",
      });
    }

    Object.defineProperty(req, "user", {
      configurable: false,
      value: userSession,
      writable: false,
      enumerable: true,
    });
  } catch (err) {
    throw err;
  }

  next();
}

export default cookieMiddleware;
