import { userInfo } from "node:os";
import connectionManager from "./connection-manager.js";
import WebSocketError from "./websocket.error.js";
import type { Client, Cursor, Message, Room } from "./websocket.types.js";
import { WebSocket } from "ws";
import { Socket } from "node:dgram";

let rooms: Array<Room> = [];

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
  roomId: string,
  dx: number,
  dy: number,
): void {
  const user = connectionManager.get(socket);

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

  room.members.forEach((client, socket) => {
    socket.send(
      JSON.stringify({ code: "cursor_updated", cursor: newCursorData }),
    );
  });
}
function removeCursor(socket: WebSocket, roomId: string): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.cursors.delete(socket);
}

function addMessage(socket: WebSocket, roomId: string, message: Message): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  room.messages.push(message);
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

  const user = room.members.get(socket);

  if (!user) {
    throw new WebSocketError(
      "USER_NOT_JOINED_IN_ROOM",
      "You are not joined in the room",
    );
  }

  return { room: room, member: user };
}

function getAll(): Array<Room> {
  return rooms;
}

export default {
  getAll,
  isMember,
  addMember,
  findRoomBySocket,
  findRoomById,
  removeMember,
  addNewRoom,
  addCursor,
  removeCursor,
  requireRoomMember,
  addMessage,
  updateCursor,
};
