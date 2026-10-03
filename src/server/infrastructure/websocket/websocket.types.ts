import WebSocket from "ws";
import type { DatabaseRoom, RoomFile } from "../../modules/rooms/rooms.type.js";
type eventType =
  | "join_room"
  | "leave_room"
  | "send_message"
  | "move_cursor"
  | "insert_operation"
  | "delete_operation"
  | "upload_file";

type messageType = "request";

type authEventType = "login";

interface Event {
  requestId: string;
  type: messageType;
  event: eventType;
  data: {
    room: string;
    message?: string;
    dx?: number;
    dy?: number;
    insert?: Insert;
    delete?: Delete;
  };
}

interface AuthEvent {
  requestId: string;
  type: messageType;
  event: authEventType;
  data: {
    token: string;
  };
}

interface Client {
  userId: string;
  displayName: string;
}

interface Room {
  id: string;
  name: string;
  owner: string;
  members: Map<WebSocket, Client>;
  cursors: Map<WebSocket, Cursor>;
  messages: Array<Message>;
}

interface File {
  id: string;
  roomId: string;
  name: string;
  content: string;
}

interface Cursor {
  userId: string;
  displayName: string;
  dx: number;
  dy: number;
}

interface Message {
  userId: string;
  displayName: string;
  message: string;
}

interface Insert {
  fileId: string;
  position: number;
  inserted: string;
}

interface Delete {
  fileId: string;
  position: number;
}

interface WebSocketResponse {
  type: string;
  requestId: string;
  success: boolean;
  action: string;
  data: any;
}

export type {
  Insert,
  Delete,
  Event,
  AuthEvent,
  Client,
  Room,
  Cursor,
  Message,
  File,
  WebSocketResponse,
};
