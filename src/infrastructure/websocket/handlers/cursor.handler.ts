import connectionManager from "../connection-manager.js";
import roomManager from "../room-manager.js";
import { WebSocket } from "ws";

function moveCursor(client: WebSocket, roomId: string, dx: number, dy: number) {
  connectionManager.checkAuth(client);

  const roomMember = roomManager.requireRoomMember(client, roomId);

  const data = roomManager.updateCursor(
    client,
    roomMember.member,
    roomId,
    dx,
    dy,
  );

  data.room.members.forEach((client, socket) => {
    socket.send(
      JSON.stringify({ code: "cursor_updated", cursor: data.cursor }),
    );
  });
}

export default {
  moveCursor,
};
