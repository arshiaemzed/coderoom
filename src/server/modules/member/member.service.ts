import AppError from "../../shared/errors/error.js";
import memberRepository from "./member.repository.js";
import roomsService from "../rooms/rooms.service.js";
import type { DatabaseRoomMember } from "./member.type.js";

async function requireMembership(roomId: string, userId: string) {
  const member = await memberRepository.checkMembership(roomId, userId);

  if (!member) {
    throw new AppError({
      statusCode: 403,
      errorMessage: "You are not member of this room.",
      errorCode: "NOT_MEMBER_OF_ROOM",
    });
  }
}

async function requireTargetMembership(roomId: string, targetId: string) {
  const member = await memberRepository.checkMembership(roomId, targetId);

  if (!member) {
    throw new AppError({
      statusCode: 403,
      errorMessage: "The specificed user is not member of the room.",
      errorCode: "NOT_MEMBER_OF_ROOM",
    });
  }
}

async function kickMember(roomId: string, userId: string, targetId: string) {
  await roomsService.requireRoom(roomId);

  await requireTargetMembership(roomId, targetId);

  await roomsService.requireOwnerPermission(roomId, userId);

  const kickedMember: DatabaseRoomMember = await memberRepository.kickMember(
    roomId,
    targetId,
  );
  return kickedMember;
}

export default {
  kickMember,
  requireMembership,
};
