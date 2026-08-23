import type { Request, Response, NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";
import errorCodes from "../../../shared/errors/errorCodes.js";

function uploadFileMiddleware(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  validateRequestBody(body);

  const fileName = body.fileName;

  if (!fileName || typeof fileName !== "string") {
    throw new AppError(400, "Invalid file name", errorCodes.INVALID_FILE_NAME);
  }

  const fileContent = body.fileContent;

  if (!fileContent || typeof fileContent !== "string") {
    throw new AppError(
      400,
      "Invalid file content",
      errorCodes.INVALID_FILE_CONTENT,
    );
  }

  next();
}

export default uploadFileMiddleware;
