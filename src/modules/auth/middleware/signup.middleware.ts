import { type Request, type Response, type NextFunction } from "express";
import AppError from "../../../shared/errors/error.js";
import errorCodes from "../../../shared/errors/errorCodes.js";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";

function signUpMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const email = req.body.email;
  const password = req.body.password;

  if (!email || typeof email != "string" || email.length < 1) {
    throw new AppError(
      400,
      "Invalid email address.",
      errorCodes.INVALID_EMAIL_ADDRESS,
    );
  }

  if (!password || typeof password != "string" || password.length < 1) {
    throw new AppError(400, "Invalid password.", errorCodes.INVALID_PASSWORD);
  }

  if (password.length < 6) {
    throw new AppError(
      400,
      "Password length must be more than 6",
      errorCodes.INVALID_PASSWORD_LENGTH,
    );
  }

  next();
}

export default signUpMiddleware;
