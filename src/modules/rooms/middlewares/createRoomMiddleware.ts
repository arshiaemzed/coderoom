import { type Request, type Response, type NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
import errorCodes from "../../../shared/errors/errorCodes.js";

function createRoomMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    const { name } = req.body;

    if (name) {
      if (typeof name != "string" || name.trim().length < 1) {
        throw new AppError(400, "Invalid name.", errorCodes.INVALID_ROOM_NAME);
      }
    }
  }

  next();
}

export default createRoomMiddleware;
