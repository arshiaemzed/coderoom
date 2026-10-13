import type { Request, Response, NextFunction } from "express";
import validateRequestBody from "../../../shared/utils/validators/validateRequestBody.js";
import AppError from "../../../shared/errors/error.js";

function uploadFileMiddleware(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  validateRequestBody(body);

  const fileName = body.fileName;

  if (!fileName || typeof fileName !== "string") {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_FILE_NAME",
      errorMessage: "Invalid file name.",
    });
  }

  const fileContent = body.fileContent;

  if (!fileContent || typeof fileContent !== "string") {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_FILE_CONTENT",
      errorMessage: "Invalid file content.",
    });
  }

  next();
}

export default uploadFileMiddleware;
