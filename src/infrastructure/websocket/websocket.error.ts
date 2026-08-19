import type { WebSocketErrorCode } from "./websocket.error.codes.js";

class WebSocketError {
  code: WebSocketErrorCode;

  message: string;

  constructor(errorCode: WebSocketErrorCode, errorMessage: string) {
    this.code = errorCode;
    this.message = errorMessage;
  }
}

export default WebSocketError;
