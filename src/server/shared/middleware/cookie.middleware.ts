import { type Request, type Response, type NextFunction } from "express";
import crypto from "node:crypto";
import type { AuthSession } from "../../modules/auth/auth.types.js";
import authRepository from "../../modules/auth/auth.repository.js";
import AppError from "../errors/error.js";
import errorCodes from "../errors/errorCodes.js";

async function cookieMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const userSession: AuthSession | undefined =
      await authRepository.findSessionByTokenHash(tokenHash);

    if (!userSession) {
      throw new AppError(
        401,
        "Invalid authorization",
        errorCodes.INVALID_AUTHORIZATION,
      );
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
