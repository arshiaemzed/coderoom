import roomsRepository from "../../../modules/rooms/rooms.repository.js";
import type { DatabaseRoom } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import type { Client, Cursor, Message, Room } from "../websocket.types.js";
import roomManager from "../room-manager.js";
import WebSocketError from "../websocket.error.js";

async function checkRoomAndJoin(client: WebSocket, roomId: string) {
  connectionManager.checkAuth(client);

  const databaseRoom: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!databaseRoom) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  const localRoom: Room | undefined = roomManager.findRoomById(databaseRoom.id);
  const user = connectionManager.get(client);

  if (!user) {
    client.close();
    throw new WebSocketError(
      "USER_NOT_AUTHENTICATED",
      "You are not authenticated.",
    );
  }

  if (!localRoom) {
    const newRoom = {
      id: databaseRoom.id,
      name: databaseRoom.name,
      members: new Map<WebSocket, Client>(),
      cursors: new Map<WebSocket, Cursor>(),
      messages: new Array<Message>(),
      owner: databaseRoom.userId,
    };

    roomManager.addNewRoom(newRoom);

    roomManager.addMember(client, newRoom.id, {
      userId: user.userId,
      displayName: user.displayName,
    });

    roomManager.addCursor(client, newRoom.id, {
      userId: user.userId,
      dx: 0,
      dy: 0,
      displayName: user.displayName,
    });

    const newRoomData = {
      code: "you_joined_room",
      message: "You joined the room",
      members: Array.from(newRoom.members.values()),
      cursors: Array.from(newRoom.cursors.values()),
      messages: newRoom.messages,
      roomId: databaseRoom.id,
      roomName: newRoom.name,
    };

    client.send(JSON.stringify(newRoomData));

    updateRoomData(newRoom.id);

    return;
  }

  if (roomManager.isMember(client, localRoom.id)) {
    throw new WebSocketError(
      "USER_ALREADY_JOINED_IN_ROOM",
      "You are already joined  this room.",
    );
  }

  roomManager.addMember(client, localRoom.id, {
    userId: user.userId,
    displayName: user.displayName,
  });

  roomManager.addCursor(client, localRoom.id, {
    userId: user.userId,
    dx: 0,
    dy: 0,
    displayName: user.displayName,
  });

  const localRoomData = {
    code: "you_joined_room",
    message: "You joined the room",
    members: Array.from(localRoom.members.values()),
    messages: localRoom.messages,
    roomId: localRoom.id,
    cursors: Array.from(localRoom.cursors.values()),
    roomName: localRoom.name,
  };

  client.send(JSON.stringify(localRoomData));
  updateRoomData(localRoom.id);
}

async function checkRoomAndLeave(client: WebSocket, roomId: string) {
  connectionManager.checkAuth(client);

  const data = roomManager.requireRoomMember(client, roomId);

  roomManager.removeMember(client, data.room.id);
  roomManager.removeCursor(client, data.room.id);

  const leavedRoomData = {
    code: "leaved_room",
    roomId: data.room.id,
    roomName: data.room.name,
    members: Array.from(data.room.members.values()),
    cursors: Array.from(data.room.cursors.values()),
    messages: data.room.messages,
    message: "You leaved the room.",
  };

  leavedRoomData;

  client.send(JSON.stringify(leavedRoomData));
  updateRoomData(data.room.id);
}

function updateRoomData(roomId: string) {
  const room = roomManager.findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.members.forEach((e, k) => {
    k.send(
      JSON.stringify({
        code: "room_updated",
        roomId: room.id,
        name: room.name,
        owner: room.owner,
        messages: room.messages,
        members: Array.from(room.members.values()),
        cursors: Array.from(room.cursors.values()),
      }),
    );
  });
}

export default {
  checkRoomAndJoin,
  checkRoomAndLeave,
  updateRoomData,
};
