import connectionManager from "../connection-manager.js";
import roomManager from "../room-manager.js";
import { WebSocket } from "ws";

function moveCursor(client: WebSocket, roomId: string, dx: number, dy: number) {
  connectionManager.checkAuth(client);

  roomManager.requireRoomMember(client, roomId);

  roomManager.updateCursor(client, roomId, dx, dy);
}

export default {
  moveCursor,
};
