import filesRepository from "../../../modules/files/files.repository.js";
import memberRepository from "../../../modules/member/member.repository.js";
import roomsRepository from "../../../modules/rooms/rooms.repository.js";
import type {
  DatabaseRoom,
  RoomFile,
} from "../../../modules/rooms/rooms.type.js";
import WebSocketError from "../websocket.error.js";

async function loadFiles(
  roomId: string,
  userId: string,
): Promise<Array<RoomFile>> {
  const databaseRoom: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!databaseRoom) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  const member: boolean = await memberRepository.checkMembership(
    roomId,
    userId,
  );

  if (!member) {
    throw new WebSocketError(
      "USER_NOT_MEMBER_OF_ROOM",
      "You are not member of the room",
    );
  }

  const files: Array<RoomFile> = await filesRepository.getRoomFiles(roomId);

  return files;
}

export default {
  loadFiles,
};
