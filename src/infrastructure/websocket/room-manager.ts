import WebSocketError from "./websocket.error.js";
import type { Client, Cursor, Message, Room } from "./websocket.types.js";
import { WebSocket } from "ws";
import type { DatabaseRoom } from "../../modules/rooms/rooms.type.js";

let rooms: Array<Room> = [];

function join(
  client: WebSocket,
  user: Client,
  databaseRoom: DatabaseRoom,
): Room {
  const localRoom: Room | undefined = findRoomById(databaseRoom.id);

  if (!localRoom) {
    const newRoom = {
      id: databaseRoom.id,
      name: databaseRoom.name,
      members: new Map<WebSocket, Client>(),
      cursors: new Map<WebSocket, Cursor>(),
      messages: new Array<Message>(),
      owner: databaseRoom.userId,
    };

    addNewRoom(newRoom);

    addMember(client, newRoom.id, {
      userId: user.userId,
      displayName: user.displayName,
    });

    addCursor(client, newRoom.id, {
      userId: user.userId,
      dx: 0,
      dy: 0,
      displayName: user.displayName,
    });

    return newRoom;
  }

  if (isMember(client, localRoom.id)) {
    throw new WebSocketError(
      "USER_ALREADY_JOINED_IN_ROOM",
      "You are already joined  this room.",
    );
  }

  addMember(client, localRoom.id, {
    userId: user.userId,
    displayName: user.displayName,
  });

  addCursor(client, localRoom.id, {
    userId: user.userId,
    dx: 0,
    dy: 0,
    displayName: user.displayName,
  });

  return localRoom;
}

function leave(client: WebSocket, user: Client, databaseRoom: DatabaseRoom) {
  const localRoom: Room | undefined = findRoomById(databaseRoom.id);

  if (!localRoom) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  requireRoomMember(client, localRoom.id);

  removeMember(client, localRoom.id);
  removeCursor(client, localRoom.id);

  return localRoom;
}

function addNewRoom(room: Room) {
  rooms.push(room);
}

function addMember(socket: WebSocket, roomId: string, client: Client): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.members.set(socket, client);
}

function addCursor(socket: WebSocket, roomId: string, cursor: Cursor): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.cursors.set(socket, cursor);
}

function updateCursor(
  socket: WebSocket,
  user: Client,
  roomId: string,
  dx: number,
  dy: number,
) {
  if (!user) {
    throw new WebSocketError(
      "USER_NOT_AUTHENTICATED",
      "You are not authenticated.",
    );
  }

  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  const cursor = room.cursors.get(socket);

  if (!cursor) {
    throw new WebSocketError("CURSOR_NOT_FOUND", "Cursor not found.");
  }

  cursor.dx = dx;
  cursor.dy = dy;

  const newCursorData: Cursor = {
    userId: user.userId,
    displayName: user.displayName,
    dx: cursor.dx,
    dy: cursor.dy,
  };

  return { room: room, cursor: newCursorData };
}

function removeCursor(socket: WebSocket, roomId: string): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.cursors.delete(socket);
}

function addMessage(socket: WebSocket, roomId: string, message: Message) {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.messages.push(message);

  return { room: room, message: message };
}

function removeMember(socket: WebSocket, roomId: string): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.members.delete(socket);
}

function findRoomBySocket(socket: WebSocket): Room | undefined {
  const room: Room | undefined = rooms.find((e) => e.members.get(socket));

  return room;
}

function findRoomById(roomId: string): Room | undefined {
  const room: Room | undefined = rooms.find((e) => e.id === roomId);

  return room;
}

function isMember(socket: WebSocket, roomId: string): boolean {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  const member: Client | undefined = room.members.get(socket);

  return member ? true : false;
}

function requireRoomMember(socket: WebSocket, roomId: string) {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  const user: Client | undefined = room.members.get(socket);

  if (!user) {
    throw new WebSocketError(
      "USER_NOT_JOINED_IN_ROOM",
      "You are not joined in the room",
    );
  }

  return { room: room, member: user };
}

export default {
  addMember,
  findRoomBySocket,
  findRoomById,
  removeMember,
  requireRoomMember,
  addMessage,
  updateCursor,
  join,
  leave,
};
