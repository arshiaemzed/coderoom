import { type NextFunction, type Request, type Response } from "express";
import AppError from "../errors/error.js";

interface ApiError {
  code: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: ApiError;
}

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
): Response<ErrorResponse> {
  if (err instanceof AppError) {
    const statusCode: number = err.statusCode;

    const errorMessage: string = err.errorMessage;

    const errorCode: string = err.errorCode;

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };

    return res.status(statusCode).json(errorResponse);
  }

  console.log(err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error.",
    },
  });
}

export default globalErrorHandler;
