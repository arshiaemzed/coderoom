import filesRepository from "../../../modules/files/files.repository.js";
import memberRepository from "../../../modules/member/member.repository.js";
import roomsRepository from "../../../modules/rooms/rooms.repository.js";
import type {
  DatabaseRoom,
  RoomFile,
} from "../../../modules/rooms/rooms.type.js";
import AppError from "../../../shared/errors/error.js";

async function loadFiles(
  roomId: string,
  userId: string,
): Promise<Array<RoomFile>> {
  const databaseRoom: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!databaseRoom) {
    throw new AppError({
      errorCode: "ROOM_DOES_NOT_EXISTS",
      errorMessage: "Room does not exists.",
    });
  }

  const member: boolean = await memberRepository.checkMembership(
    roomId,
    userId,
  );

  if (!member) {
    throw new AppError({
      errorCode: "USER_NOT_MEMBER_OF_ROOM",
      errorMessage: "You are not member of this room.",
    });
  }

  const files: Array<RoomFile> = await filesRepository.getRoomFiles(roomId);

  return files;
}

export default {
  loadFiles,
};
