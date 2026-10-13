import AppError from "../../errors/error.js";

function validateParam(
  param: string | string[] | undefined,
  errorMessage: string,
) {
  if (!param || typeof param !== "string" || param.trim() === "") {
    throw new AppError({
      statusCode: 400,
      errorCode: "INVALID_PARAM",
      errorMessage: errorMessage,
    });
  }
}

export default validateParam;
