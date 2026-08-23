import type { DatabaseRoom, RoomFile } from "./rooms.type.js";
import roomsRepository from "./rooms.repository.js";
import AppError from "../../shared/errors/error.js";
import errorCodes from "../../shared/errors/errorCodes.js";

async function requireRoom(roomId: string) {
  const room = await roomsRepository.doesRoomExists(roomId);

  if (!room) {
    throw new AppError(404, "Room not found.", errorCodes.ROOM_DOES_NOT_EXISTS);
  }
}

async function requireOwnerPermission(roomId: string, userId: string) {
  const isOwner: boolean = await roomsRepository.isOwnerOfTheRoom(
    roomId,
    userId,
  );

  return isOwner;
}

async function createRoom(
  userId: string,
  name: string | undefined,
): Promise<DatabaseRoom> {
  const newRoom = await roomsRepository.createRoom(userId, name);

  return newRoom;
}

async function deleteRoom(
  roomId: string,
  userId: string,
): Promise<DatabaseRoom> {
  await requireRoom(roomId);

  const isOwner = await roomsRepository.isOwnerOfTheRoom(roomId, userId);

  if (!isOwner) {
    throw new AppError(
      401,
      "You are not allowed to delete this room.",
      errorCodes.NOT_ALLOWED_TO_DELETE_ROOM,
    );
  }

  const deletedRoom = await roomsRepository.deleteRoom(roomId, userId);

  if (!deleteRoom) {
    throw new Error("Failed to delete the room");
  }

  return deletedRoom!;
}

async function getAllRooms() {
  const rooms = await roomsRepository.getAllRooms();

  return rooms;
}

export default {
  createRoom,
  deleteRoom,
  getAllRooms,
  requireRoom,
  requireOwnerPermission,
};
