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
      errorCodes.NOT_ENOUGH_PERMISSION_TO_INVITE_USERS,
    );
  }

  const invitedUser: InvitedUser = await inviteRepository.inviteUser(
    invitedUserId,
    roomId,
    userId,
  );

  return invitedUser;
}

async function revokeInvite(roomId: string, userId: string, targetId: string) {
  await roomsService.requireRoom(roomId);

  const isOwner: boolean = await roomsService.requireOwnerPermission(
    roomId,
    userId,
  );

  if (!isOwner) {
    throw new AppError(
      403,
      "You are not allowed to revoke invites.",
      errorCodes.NOT_ENOUGH_PERMISSION_TO_REVOKE_INVITES,
    );
  }

  const deletedInvite: InvitedUser | undefined =
    await inviteRepository.revokeInvite(roomId, targetId);

  if (!deletedInvite) {
    throw new AppError(404, "Invite not found.", errorCodes.INVITE_NOT_FOUND);
  }

  return deletedInvite;
}

export default {
  inviteUser,
  revokeInvite,
};
