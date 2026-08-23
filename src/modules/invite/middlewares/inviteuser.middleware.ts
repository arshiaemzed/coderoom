import type { Request, Response, NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
import errorCodes from "../../../shared/errors/errorCodes.js";

function inviteUserMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const invitedUserId = req.body.user_id;

  if (
    !invitedUserId ||
    typeof invitedUserId !== "string" ||
    invitedUserId.trim() === ""
  ) {
    throw new AppError(
      400,
      "Invalid user_id provided for inviting a user.",
      errorCodes.INVALID_USER_ID_FOR_INVITING_FIELD,
    );
  }

  next();
}

export default inviteUserMiddleware;
