import type { DatabaseRoom } from "./rooms.type.js";
import roomsRepository from "./rooms.repository.js";
import AppError from "../../shared/errors/error.js";

async function requireRoom(roomId: string): Promise<DatabaseRoom | undefined> {
  const room: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!room) {
    throw new AppError({
      statusCode: 404,
      errorCode: "ROOM_DOES_NOT_EXISTS",
      errorMessage: "Room not found.",
    });
  }

  return room;
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
    throw new AppError({
      statusCode: 401,
      errorCode: "NOT_ALLOWED_TO_DELETE_ROOM",
      errorMessage: "You are not allowed to delete this room.",
    });
  }

  const deletedRoom: DatabaseRoom | undefined =
    await roomsRepository.deleteRoom(roomId, userId);

  if (!deletedRoom) {
    throw new AppError({
      statusCode: 500,
      errorCode: "FAILED_TO_CREATE_ROOM",
      errorMessage: "Failed to delete room.",
    });
  }

  return deletedRoom;
}

async function getUserRooms() {
  const rooms = await roomsRepository.getUserRooms();

  return rooms;
}

async function searchRooms(searchQuery: string) {
  const rooms = await roomsRepository.searchRooms(searchQuery);

  return rooms;
}

export default {
  createRoom,
  deleteRoom,
  getUserRooms,
  requireRoom,
  requireOwnerPermission,
  searchRooms,
};
