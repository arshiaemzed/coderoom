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
  const user: Client | undefined = clients.get(socket);

  return user;
}

function findById(userId: string): Client | undefined {
  const values: MapIterator<Client> = clients.values();
  const user: Client | undefined = values.find((e) => e.userId === userId);

  return user;
}

function checkAuth(socket: WebSocket): Client {
  const user: Client | undefined = get(socket);

  if (!user) {
    throw new WebSocketError(
      "USER_NOT_AUTHENTICATED",
      "Specified user is not authenticated.",
    );
  }

  return user;
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
  findById,
};
