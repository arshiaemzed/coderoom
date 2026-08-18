import connectionManager from "../connection-manager.js";
import roomManager from "../room-manager.js";
import { WebSocket } from "ws";
import roomHandler from "./room.handler.js";

function moveCursor(client: WebSocket, roomId: string, dx: number, dy: number) {
  if (!connectionManager.get(client)) {
    client.send(
      JSON.stringify({ type: "message", message: "You are not authenticated" }),
    );
    // client.close();
    return;
  }

  if (!roomManager.isMember(client, roomId)) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "You are not authorized to send message in this room.",
      }),
    );
    return;
  }

  const room = roomManager.findRoomById(roomId);

  if (!room) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "Failed to find the room.",
      }),
    );
    return;
  }

  const user = room.members.get(client);

  if (!user) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "Failed to find you as a member of this room.",
      }),
    );
    return;
  }

  room.cursors.set(client, {
    userId: user.userId,
    dx: dx,
    dy: dy,
    displayName: user.displayName,
  });
  roomHandler.updateRoomData(room.id);
}

export default {
  moveCursor,
};
