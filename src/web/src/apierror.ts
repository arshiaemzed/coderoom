export class ApiError {
  status: number;
  code: string;
  message: string;

  constructor(statusCode: number, errorCode: string, errorMessage: string) {
    this.status = statusCode;
    this.code = errorCode;
    this.message = errorMessage;
  }
}
