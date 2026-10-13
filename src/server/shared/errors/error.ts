import type { ErrorCode } from "./errorCodes.js";

interface AppErrorProps {
  statusCode?: number;
  errorMessage: string;
  errorCode: ErrorCode;
}

class AppError extends Error {
  statusCode?: number;

  errorCode: ErrorCode;

  constructor(args: AppErrorProps) {
    super(args.errorMessage);

    if (args.statusCode !== undefined) {
      this.statusCode = args.statusCode;
    }

    this.name = "AppError";
    this.errorCode = args.errorCode;
  }
}

export default AppError;
