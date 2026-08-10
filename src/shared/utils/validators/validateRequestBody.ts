import AppError from "../../errors/error.js";
import errorCodes from "../../errors/errorCodes.js";

function validateRequestBody(body: object) {
  if (!body) {
    throw new AppError(
      400,
      "Invalid body request.",
      errorCodes.INVALID_BODY_REQUEST,
    );
  }
}

export default validateRequestBody;
