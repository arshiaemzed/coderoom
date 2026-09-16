import type { Request, Response, NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
import errorCodes from "../../../shared/errors/errorCodes.js";

function revokeInviteMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validateRequestBody(req.body);

  const userId = req.body.user_id;

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new AppError(
      400,
      "You should enter id of the user you are trying to invoke their invite.",
      errorCodes.INVALID_FIELD,
    );
  }
  next();
}

export default revokeInviteMiddleware;
