import AppError from "../../errors/error.js";

function validateRequestBody(body: object) {
  if (!body) {
    throw new AppError({
      statusCode: 400,
      errorMessage: "Invalid body request.",
      errorCode: "INVALID_BODY_REQUEST",
    });
  }
}

export default validateRequestBody;
