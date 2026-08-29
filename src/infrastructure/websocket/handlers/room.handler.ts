import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import type { Client, Room } from "../websocket.types.js";
import roomManager from "../room-manager.js";
import WebSocketError from "../websocket.error.js";
import joinRoomService from "../services/join.room.service.js";
import type { DatabaseRoom } from "../../../modules/rooms/rooms.type.js";
import leaveRoomService from "../services/leave.room.service.js";

async function checkRoomAndJoin(client: WebSocket, roomId: string) {
  const user: Client = connectionManager.checkAuth(client);

  const databaseRoom: DatabaseRoom = await joinRoomService.joinRoom(
    roomId,
    user.userId,
  );

  const data: Room = roomManager.join(client, user, databaseRoom);

  const message = {
    code: "you_joined_room",
    message: "You joined the room",
    members: Array.from(data.members.values()),
    cursors: Array.from(data.cursors.values()),
    messages: data.messages,
    roomId: data.id,
    roomName: data.name,
  };

  client.send(JSON.stringify(message));

  data.members.forEach((client: Client, socket: WebSocket) => {
    socket.send(
      JSON.stringify({
        code: "user_joined",
        user: { userId: user.userId, displayName: user.displayName },
      }),
    );
  });
}

async function checkRoomAndLeave(client: WebSocket, roomId: string) {
  const user: Client = connectionManager.checkAuth(client);

  const databaseRoom: DatabaseRoom = await leaveRoomService.leaveRoom(
    roomId,
    user.userId,
  );

  const data: Room = roomManager.leave(client, user, databaseRoom);

  const message = {
    code: "leaved_room",
    roomId: data.id,
    roomName: data.name,
    members: Array.from(data.members.values()),
    cursors: Array.from(data.cursors.values()),
    messages: data.messages,
    message: "You leaved the room.",
  };

  client.send(JSON.stringify(message));

  data.members.forEach((client: Client, socket: WebSocket) => {
    socket.send(
      JSON.stringify({
        code: "user_leaved",
        user: {
          userId: user.userId,
          displayName: user.displayName,
        },
      }),
    );
  });
}

export default {
  checkRoomAndJoin,
  checkRoomAndLeave,
};
