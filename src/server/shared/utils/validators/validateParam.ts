import AppError from "../../errors/error.js";
import errorCodes from "../../errors/errorCodes.js";

function validateParam(
  param: string | string[] | undefined,
  errorMessage: string,
) {
  if (!param || typeof param !== "string" || param.trim() === "") {
    throw new AppError(400, errorCodes.INVALID_PARAM, errorMessage);
  }
}

export default validateParam;
