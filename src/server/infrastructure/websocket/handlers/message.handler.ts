import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import roomManager from "../room-manager.js";
import type { Message } from "../websocket.types.js";

function sendMessage(client: WebSocket, roomId: string, messageStr: string) {
  connectionManager.checkAuth(client);

  const data = roomManager.requireRoomMember(client, roomId);

  const message: Message = {
    displayName: data.member.displayName,
    userId: data.member.userId,
    message: messageStr,
  };

  roomManager.addMessage(client, roomId, message);

  data.room.members.forEach((client, socket) => {
    socket.send(
      JSON.stringify({
        code: "new_message",
        message: message,
      }),
    );
  });
}

export default { sendMessage };
