import AppError from "../../shared/errors/error.js";
import errorCodes from "../../shared/errors/errorCodes.js";
import roomsService from "../rooms/rooms.service.js";
import inviteRepository from "./invite.repository.js";
import type { InvitedUser } from "./invite.type.js";

async function inviteUser(
  invitedUserId: string,
  roomId: string,
  userId: string,
) {
  await roomsService.requireRoom(roomId);

  const alreadyInvited: boolean = await inviteRepository.hasBeenAlreadyInvited(
    roomId,
    invitedUserId,
  );

  if (alreadyInvited) {
    throw new AppError(
      403,
      "User has been already invited.",
      errorCodes.USER_ALREADY_INVITED,
    );
  }

  const isOwner: boolean = await roomsService.requireOwnerPermission(
    roomId,
    userId,
  );

  if (!isOwner) {
    throw new AppError(
      403,
      "You are not allowed to invite users.",
      errorCodes.NOT_ENOUGH_PERMISSION_TO_UPLOAD_FILES,
    );
  }

  const invitedUser: InvitedUser | undefined =
    await inviteRepository.inviteUser(invitedUserId, roomId, userId);

  if (!invitedUser) {
    throw new AppError(
      500,
      "Failed to invite the user.",
      errorCodes.FAILED_TO_INVITE_USER,
    );
  }

  return invitedUser;
}

export default {
  inviteUser,
};
