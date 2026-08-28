import memberRepository from "../../../modules/member/member.repository.js";
import roomsRepository from "../../../modules/rooms/rooms.repository.js";
import type { DatabaseRoom } from "../../../modules/rooms/rooms.type.js";
import WebSocketError from "../websocket.error.js";

async function leaveRoom(roomId: string, userId: string) {
  const databaseRoom: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!databaseRoom) {
    throw new WebSocketError("ROOM_NOT_FOUND", "Room not found.");
  }

  const member = await memberRepository.checkMembership(roomId, userId);

  if (!member) {
    throw new WebSocketError(
      "USER_NOT_MEMBER_OF_ROOM",
      "You are not member of the room",
    );
  }

  return databaseRoom;
}

export default {
  leaveRoom,
};
