import { type Request, type Response, type NextFunction } from "express";
import AppError from "../../../shared/errors/error.js";

function createRoomMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    const { name } = req.body;

    if (name) {
      if (typeof name != "string" || name.trim().length < 1) {
        throw new AppError({
          statusCode: 400,
          errorCode: "INVALID_ROOM_NAME",
          errorMessage: "Invalid name.",
        });
      }
    }
  }

  next();
}

export default createRoomMiddleware;
