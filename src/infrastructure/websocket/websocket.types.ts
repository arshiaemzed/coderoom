import WebSocket from "ws";
type eventType = "join_room" | "leave_room" | "send_message" | "move_cursor";

type authEventType = "login";

interface Event {
  type: eventType;
  room: string;
  message?: string;
  dx?: number;
  dy?: number;
}

interface AuthEvent {
  type: authEventType;
  token: string;
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

export type { Event, AuthEvent, Client, Room, Cursor, Message };
