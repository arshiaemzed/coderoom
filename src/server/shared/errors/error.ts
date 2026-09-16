class AppError {
  statusCode: number;

  errorMessage: string;

  errorCode: string;

  constructor(statusCode: number, errorMessage: string, errorCode: string) {
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }
}

export default AppError;
