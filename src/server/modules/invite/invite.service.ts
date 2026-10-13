import AppError from "../../shared/errors/error.js";
import roomsService from "../rooms/rooms.service.js";
import inviteRepository from "./invite.repository.js";
import type { InvitedUser, RoomMember } from "./invite.type.js";
import memberRepository from "../member/member.repository.js";

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
    throw new AppError({
      statusCode: 403,
      errorCode: "USER_ALREADY_INVITED",
      errorMessage: "User has been already invited.",
    });
  }

  const isOwner: boolean = await roomsService.requireOwnerPermission(
    roomId,
    userId,
  );

  if (!isOwner) {
    throw new AppError({
      statusCode: 403,
      errorCode: "NOT_ENOUGH_PERMISSION_TO_INVITE_USERS",
      errorMessage: "You are not allowed to invite users.",
    });
  }

  const isAlreadyMember: boolean = await memberRepository.checkMembership(
    roomId,
    invitedUserId,
  );

  if (isAlreadyMember) {
    throw new AppError({
      statusCode: 403,
      errorCode: "SPECIFIED_USER_IS_ALREADY_A_MEMBER",
      errorMessage: "User is already member of this room.",
    });
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
    throw new AppError({
      statusCode: 403,
      errorCode: "NOT_ENOUGH_PERMISSION_TO_REVOKE_INVITES",
      errorMessage: "You are not allowed to revoke invites.",
    });
  }

  const deletedInvite: InvitedUser | undefined =
    await inviteRepository.revokeInvite(roomId, targetId);

  if (!deletedInvite) {
    throw new AppError({
      statusCode: 404,
      errorCode: "INVITE_NOT_FOUND",
      errorMessage: "Invite not found.",
    });
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
    throw new AppError({
      statusCode: 403,
      errorCode: "YOU_ARE_NOT_INVITED_TO_THIS_ROOM",
      errorMessage: "You are not invited to this room.",
    });
  }

  const isAlreadyMember: boolean = await memberRepository.checkMembership(
    roomId,
    userId,
  );

  if (isAlreadyMember) {
    throw new AppError({
      statusCode: 403,
      errorCode: "ALREADY_MEMBER_OF_ROOM",
      errorMessage: "You are alreay member of this room.",
    });
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
    throw new AppError({
      statusCode: 403,
      errorCode: "YOU_ARE_NOT_INVITED_TO_THIS_ROOM",
      errorMessage: "Yoi are not invited to this room.",
    });
  }

  const declinedInvite: InvitedUser = await inviteRepository.declineInvite(
    roomId,
    userId,
  );
  return declinedInvite;
}

async function getInvites(userId: string) {
  const userInvites = await inviteRepository.getInvites(userId);

  return userInvites;
}

export default {
  inviteUser,
  revokeInvite,
  acceptInvite,
  declineInvite,
  getInvites,
};
