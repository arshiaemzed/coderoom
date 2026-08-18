import type { Client, Room } from "./websocket.types.js";
import { WebSocket } from "ws";

let rooms: Array<Room> = [];

function addNewRoom(room: Room) {
  rooms.push(room);
}

function addMember(socket: WebSocket, roomId: string, client: Client): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    return;
  }

  room.members.set(socket, client);
}

function removeMember(socket: WebSocket, roomId: string): void {
  const room: Room | undefined = findRoomById(roomId);

  if (!room) {
    return;
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
    return false;
  }

  const member: Client | undefined = room.members.get(socket);

  return member ? true : false;
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
};
