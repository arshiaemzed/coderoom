import { error } from "node:console";
import AppError from "../../shared/errors/error.js";
import errorCodes from "../../shared/errors/errorCodes.js";
import roomsService from "../rooms/rooms.service.js";
import inviteRepository from "./invite.repository.js";
import type { InvitedUser, RoomMember } from "./invite.type.js";

async function requireMembership(roomId: string, userId: string) {
  const member = await inviteRepository.checkMembership(roomId, userId);

  if (!member) {
    throw new AppError(
      403,
      "You are not member of this room.",
      errorCodes.NOT_MEMBER_OF_ROOM,
    );
  }
}

async function requireTargetMembership(roomId: string, targetId: string) {
  const member = await inviteRepository.checkMembership(roomId, targetId);

  if (!member) {
    throw new AppError(
      403,
      "The specificed user is not member of the room.",
      errorCodes.NOT_MEMBER_OF_ROOM,
    );
  }
}

async function inviteUser(
  invitedUserId: string,
  roomId: string,
  userId: string,
) {
  await roomsService.requireRoom(roomId);

  const alreadyInvited: boolean = await inviteRepository.checkForInvite(
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

  const isAlreadyMember: boolean = await inviteRepository.checkMembership(
    roomId,
    invitedUserId,
  );

  if (isAlreadyMember) {
    throw new AppError(
      403,
      "User is already member of this room.",
      errorCodes.SPECIFIED_USER_IS_ALREADY_A_MEMBER,
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

async function acceptInvite(roomId: string, userId: string) {
  await roomsService.requireRoom(roomId);

  const hasBeenInvited: boolean = await inviteRepository.checkForInvite(
    roomId,
    userId,
  );

  if (!hasBeenInvited) {
    throw new AppError(
      403,
      "You are not invited to this room",
      errorCodes.YOU_ARE_NOT_INVITED_TO_THIS_ROOM,
    );
  }

  const isAlreadyMember: boolean = await inviteRepository.checkMembership(
    roomId,
    userId,
  );

  if (isAlreadyMember) {
    throw new AppError(
      403,
      "You are already member of this room.",
      errorCodes.ALREADY_MEMBER_OF_ROOM,
    );
  }

  const acceptedInvite: RoomMember = await inviteRepository.acceptInvite(
    roomId,
    userId,
  );

  return acceptedInvite;
}

async function declineInvite(roomId: string, userId: string) {
  await roomsService.requireRoom(roomId);

  const hasBeenInvited: boolean = await inviteRepository.checkForInvite(
    roomId,
    userId,
  );

  if (!hasBeenInvited) {
    throw new AppError(
      403,
      "You are not invited to this room",
      errorCodes.YOU_ARE_NOT_INVITED_TO_THIS_ROOM,
    );
  }

  const declinedInvite: InvitedUser = await inviteRepository.declineInvite(
    roomId,
    userId,
  );
  return declinedInvite;
}

export default {
  inviteUser,
  revokeInvite,
  acceptInvite,
  declineInvite,
};
