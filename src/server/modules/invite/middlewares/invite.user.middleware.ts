import type { Request, Response, NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";

function inviteUserMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const invitedUserId = req.body.user_id;

  if (
    !invitedUserId ||
    typeof invitedUserId !== "string" ||
    invitedUserId.trim() === ""
  ) {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_FIELD",
      errorMessage: "Invalid user_id provided for inviting a user.",
    });
  }

  next();
}

export default inviteUserMiddleware;
