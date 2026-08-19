import WebSocketError from "./websocket.error.js";
import { type Client } from "./websocket.types.js";
import { type WebSocket } from "ws";

let clients = new Map<WebSocket, Client>();

function add(socket: WebSocket, user: Client): void {
  clients.set(socket, user);
}

function remove(socket: WebSocket): void {
  clients.delete(socket);
}

function get(socket: WebSocket): Client | undefined {
  const user = clients.get(socket);

  return user;
}

function checkAuth(socket: WebSocket) {
  const user = get(socket);
  if (!user) {
    throw new WebSocketError(
      "USER_NOT_AUTHENTICATED",
      "You are not authenticated.",
    );
  }
}

function getAll(): Map<WebSocket, Client> {
  return clients;
}

export default {
  add,
  remove,
  get,
  getAll,
  checkAuth,
};
