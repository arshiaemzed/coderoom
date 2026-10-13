import type { Request, Response, NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";

function revokeInviteMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validateRequestBody(req.body);

  const userId = req.body.user_id;

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_FIELD",
      errorMessage:
        "You should enter id of the user you are trying to invoke their invite.",
    });
  }
  next();
}

export default revokeInviteMiddleware;
