import WebSocket from "ws";
type eventType = "join_room" | "leave_room" | "send_message";

type authEventType = "login";

interface Event {
  type: eventType;
  room: string;
  message?: string;
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
}

export type { Event, AuthEvent, Client, Room };
