import roomsRepository from "../../../modules/rooms/rooms.repository.js";
import type { DatabaseRoom } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import type { Client, Cursor, Message, Room } from "../websocket.types.js";
import roomManager from "../room-manager.js";

async function checkRoomAndJoin(client: WebSocket, roomId: string) {
  if (!connectionManager.get(client)) {
    client.send(
      JSON.stringify({
        code: "not_authenticated",
        roomId: roomId,
        message: "You are not authenticated",
      }),
    );
    client.close();
    return;
  }

  const clients = connectionManager.getAll();

  const databaseRoom: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!databaseRoom) {
    client.send(
      JSON.stringify({
        code: "room_does_not_exists",
        roomId: roomId,
        message: "Room does not exists.",
      }),
    );
    client.send("Room does not exists.");
    return;
  }

  const localRoom: Room | undefined = roomManager.findRoomById(databaseRoom.id);

  const user = clients.get(client);

  if (!user) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "Failed to find you as client disconnecting ...",
      }),
    );
    client.close();
    return;
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

    newRoom.members.set(client, {
      userId: user.userId,
      displayName: user.displayName,
    });

    newRoom.cursors.set(client, {
      userId: user.userId,
      dx: 0,
      dy: 0,
      displayName: user.displayName,
    });

    client.send(
      JSON.stringify({
        code: "you_joined_room",
        message: "You joined the room",
        members: Array.from(newRoom.members.values()),
        cursors: Array.from(newRoom.cursors.values()),
        messages: newRoom.messages,
        roomId: databaseRoom.id,
        roomName: newRoom.name,
      }),
    );

    updateRoomData(newRoom.id);

    return;
  }

  if (roomManager.isMember(client, localRoom.id)) {
    client.send(
      JSON.stringify({
        code: "already_joined_in_room",
        roomId: roomId,
        message: "You are already joined in this room.",
      }),
    );
    return;
  }

  localRoom.members.set(client, {
    userId: user.userId,
    displayName: user.displayName,
  });

  client.send(
    JSON.stringify({
      code: "you_joined_room",
      message: "You joined the room",
      members: Array.from(localRoom.members.values()),
      messages: localRoom.messages,
      roomId: localRoom.id,
      cursors: Array.from(localRoom.cursors.values()),
      roomName: localRoom.name,
    }),
  );
  updateRoomData(localRoom.id);
}

async function checkRoomAndLeave(client: WebSocket, roomId: string) {
  if (!connectionManager.get(client)) {
    client.send(
      JSON.stringify({
        code: "not_authenticated",
        roomId: roomId,
        message: "You are not authenticated",
      }),
    );
    client.close();
    return;
  }

  const rooms = roomManager.getAll();

  const databaseRoom: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!databaseRoom) {
    client.send(
      JSON.stringify({
        code: "room_does_not_exists",
        roomId: roomId,
        message: "Room does not exists",
      }),
    );
    return;
  }

  const localRoom: Room | undefined = roomManager.findRoomById(databaseRoom.id);

  if (!localRoom) {
    client.send(
      JSON.stringify({
        code: "room_not_active",
        roomId: roomId,
        message: "The room that you are trying to leave is not active.",
      }),
    );
    return;
  }

  if (!roomManager.isMember(client, localRoom.id)) {
    client.send(
      JSON.stringify({
        code: "not_joined_in_the_room",
        roomId: localRoom.id,
        message: "You are not joined in the room.",
      }),
    );
    return;
  }

  localRoom.members.delete(client);
  localRoom.cursors.delete(client);

  client.send(
    JSON.stringify({
      code: "leaved_room",
      roomId: localRoom.id,
      roomName: localRoom.name,
      members: Array.from(localRoom.members.values()),
      message: "You leaved the room.",
    }),
  );
  updateRoomData(localRoom.id);
}

function updateRoomData(roomId: string) {
  const room = roomManager.findRoomById(roomId);

  if (!room) {
    return;
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
