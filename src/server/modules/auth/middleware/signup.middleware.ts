import { type Request, type Response, type NextFunction } from "express";
import AppError from "../../../shared/errors/error.js";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";

function signUpMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const email = req.body.email;
  const password = req.body.password;
  const displayName = req.body.display_name;

  if (!email || typeof email != "string" || email.length < 1) {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_EMAIL_ADDRESS",
      errorMessage: "Invalid email address.",
    });
  }

  if (!password || typeof password != "string" || password.length < 1) {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_PASSWORD",
      errorMessage: "Invalid password.",
    });
  }

  if (
    !displayName ||
    typeof displayName != "string" ||
    displayName.length < 6
  ) {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_DISPLAY_NAME",
      errorMessage: "Invalid displayName.",
    });
  }

  if (displayName.length < 6 || displayName.length > 60) {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_DISPLAY_NAME_LENGTH",
      errorMessage: "Display name length must be more than 6 and less than 60",
    });
  }

  if (password.length < 6) {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_PASSWORD_LENGTH",
      errorMessage: "Password length must be more than 6",
    });
  }

  next();
}

export default signUpMiddleware;
