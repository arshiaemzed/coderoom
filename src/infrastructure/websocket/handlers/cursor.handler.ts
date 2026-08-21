import connectionManager from "../connection-manager.js";
import roomManager from "../room-manager.js";
import { WebSocket } from "ws";
import roomHandler from "./room.handler.js";
import WebSocketError from "../websocket.error.js";

function moveCursor(client: WebSocket, roomId: string, dx: number, dy: number) {
  connectionManager.checkAuth(client);

  roomManager.requireRoomMember(client, roomId);

  roomManager.updateCursor(client, roomId, dx, dy);
}

export default {
  moveCursor,
};
