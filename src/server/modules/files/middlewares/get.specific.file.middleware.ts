import type { Request, Response, NextFunction } from "express";
import validateParam from "../../../shared/utils/validators/validateParam.js";

function getSpecificFileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const roomId = req.params.roomid;

  const fileId = req.params.fileid;

  validateParam(roomId, "Invalid value for roomid param.");

  validateParam(fileId, "Invalid value for fileid param.");

  next();
}

export default getSpecificFileMiddleware;
