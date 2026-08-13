import { type Request, type Response, type NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
function deleteRoomMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const id = req.params.id;

  if (!id || typeof id != "string") {
    throw new AppError(400, "Invalid id param", "INVALID_PARAM");
  }
  next();
}

export default deleteRoomMiddleware;
