import { type Request, type Response, type NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
import validateParam from "../../../shared/utils/validators/validateParam.js";
function deleteRoomMiddleware(req: Request, res: Response, next: NextFunction) {
  validateRequestBody(req.body);

  const id = req.params.id;

  validateParam(id, "Invalid param value for id.");

  next();
}

export default deleteRoomMiddleware;
