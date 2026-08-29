type codes = {
  USER_NOT_JOINED_IN_ROOM: string;
  USER_ALREADY_JOINED_IN_ROOM: string;
  ROOM_NOT_FOUND: string;
  USER_NOT_AUTHENTICATED: string;
  CURSOR_NOT_FOUND: string;
  ROOM_DOES_NOT_EXISTS: string;
  USER_NOT_MEMBER_OF_ROOM: string;
  INVALID_AUTH_SESSION: "INVALID_AUTH_SESSION";
};

type WebSocketErrorCode = keyof codes;

export type { WebSocketErrorCode };
