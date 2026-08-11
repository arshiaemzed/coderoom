import { type Response, type Request, type NextFunction } from "express";
import AppError from "../errors/error.js";
import errorCodes from "../errors/errorCodes.js";
import argon2 from "argon2";
import authRepository from "../../modules/auth/auth.repository.js";
import crypto from "crypto";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers;

  if (!header) {
    throw new AppError(
      400,
      "Invalid authorization.",
      errorCodes.NO_REQUEST_HEADER,
    );
  }

  const authorizationHeader = header.authorization;

  if (!authorizationHeader) {
    throw new AppError(
      400,
      "Invalid authorization.",
      errorCodes.NO_AUTHORIZATION_HEADER,
    );
  }

  const authorization: string | undefined = authorizationHeader?.split(" ")[1];

  if (!authorization) {
    throw new AppError(
      400,
      "Invalid authorization.",
      errorCodes.INVALID_AUTHORIZATION,
    );
  }

  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(authorization)
      .digest("hex");

    const userSession = await authRepository.findSessionByTokenHash(tokenHash);

    if (!userSession) {
      throw new AppError(
        401,
        "Invalid authorization",
        errorCodes.INVALID_AUTHORIZATION,
      );
    }

    console.log(userSession);

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

export default authMiddleware;
