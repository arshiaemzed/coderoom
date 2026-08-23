import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import roomManager from "../room-manager.js";

function sendMessage(client: WebSocket, roomId: string, message: string) {
  connectionManager.checkAuth(client);

  const data = roomManager.requireRoomMember(client, roomId);

  roomManager.addMessage(client, data.room.id, {
    userId: data.member.userId,
    displayName: data.member.displayName,
    message: message,
  });
}

export default { sendMessage };
