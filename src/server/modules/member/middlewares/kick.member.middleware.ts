import { type Request, type Response, type NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
import validateParam from "../../../shared/utils/validators/validateParam.js";

function kickMemberMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const roomid = req.params.roomid;

  validateParam(roomid, "Invalid param value for roomid.");

  const memberId = req.body.user_id;

  if (!memberId || typeof memberId !== "string" || memberId.trim() === "") {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_USER_ID_FOR_KICKING_MEMBER_FIELD",
      errorMessage: "Invalid user id.",
    });
  }

  next();
}

export default kickMemberMiddleware;
