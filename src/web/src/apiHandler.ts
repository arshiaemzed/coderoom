import { ApiError } from "./apierror";

export async function apiHandler(response: any) {
  const statusCode: number = response.status;

  const data = await response.json();

  if (statusCode >= 200 && statusCode <= 299) {
    return data;
  }

  const errorMessage: string = data["error"]["message"];
  const errorCode: string = data["error"]["code"];

  console.log(`errorCode: ${errorCode}`);
  console.log(`errorMessage: ${errorMessage}`);

  switch (errorCode) {
    case "INVALID_CREDENTIALS":
      throw new ApiError(statusCode, errorCode, errorMessage);
    default:
      throw new ApiError(statusCode, errorCode, "Unexpected error occured.");
  }
}
