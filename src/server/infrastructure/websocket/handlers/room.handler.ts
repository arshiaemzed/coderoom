import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import roomManager from "../room-manager.js";
import joinRoomService from "../services/join.room.service.js";
import type { DatabaseRoom } from "../../../modules/rooms/rooms.type.js";
import leaveRoomService from "../services/leave.room.service.js";
import type { Client, Room, WebSocketResponse } from "../websocket.types.js";

async function checkRoomAndJoin(
  client: WebSocket,
  roomId: string,
  requestId: string,
) {
  const user: Client = connectionManager.checkAuth(client);

  const data: DatabaseRoom = await joinRoomService.joinRoom(
    roomId,
    user.userId,
  );

  const room: Room = roomManager.join(client, user, data);

  const message: WebSocketResponse = {
    type: "response",
    requestId: requestId,
    action: "you_joined_room",
    success: true,
    data: {
      members: Array.from(room.members.values()),
      cursors: Array.from(room.cursors.values()),
      messages: room.messages,
      roomId: room.id,
      roomName: room.name,
    },
  };

  client.send(JSON.stringify(message));

  room.members.forEach((_, socket: WebSocket) => {
    // Notifiying other sockets that a new user has joined the room
    if (socket !== client) {
      const userJoinedResponse = {
        type: "event",
        event: "user_joined",
        success: true,
        data: {
          userId: user.userId,
          displayName: user.displayName,
        },
      };

      socket.send(JSON.stringify(userJoinedResponse));
    }
  });
}

async function checkRoomAndLeave(
  client: WebSocket,
  roomId: string,
  requestId: string,
) {
  const user: Client = connectionManager.checkAuth(client);

  const databaseRoom: DatabaseRoom = await leaveRoomService.leaveRoom(
    roomId,
    user.userId,
  );

  const data: Room = roomManager.leave(client, user, databaseRoom);

  const message: WebSocketResponse = {
    type: "response",
    requestId: requestId,
    action: "leaved_room",
    success: true,
    data: {
      room: data.id,
    },
  };

  client.send(JSON.stringify(message));

  data.members.forEach((_, socket: WebSocket) => {
    if (socket !== client) {
      const userLeavedMessage = {
        type: "event",
        event: "user_leaved",
        success: true,
        data: {
          userId: user.userId,
        },
      };

      socket.send(JSON.stringify(userLeavedMessage));
    }
  });
}

export default {
  checkRoomAndJoin,
  checkRoomAndLeave,
};
