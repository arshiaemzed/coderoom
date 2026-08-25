import type { Request, Response } from "express";
import inviteService from "./invite.service.js";
import type { InvitedUser, RoomMember } from "./invite.type.js";

async function inviteUser(req: Request, res: Response) {
  const roomId = req.params.roomid as string;

  const userId: string = req.user.userId;

  const invitedUserId: string = req.body.user_id;

  const invitedUser: InvitedUser = await inviteService.inviteUser(
    invitedUserId,
    roomId,
    userId,
  );

  return res.status(200).json(invitedUser);
}

async function revokeInvite(req: Request, res: Response) {
  const roomId = req.params.roomid as string;

  const userId: string = req.user.userId;

  const targetId = req.body.user_id;

  const revokedInviteUser: InvitedUser = await inviteService.revokeInvite(
    roomId,
    userId,
    targetId,
  );

  return res.status(200).json(revokedInviteUser);
}

async function acceptInvite(req: Request, res: Response) {
  const roomId = req.params.roomid as string;

  const userId = req.user.userId;

  const acceptedInvite: RoomMember = await inviteService.acceptInvite(
    roomId,
    userId,
  );

  return res.status(200).json(acceptedInvite);
}

async function declineInvite(req: Request, res: Response) {
  const roomId = req.params.roomid as string;

  const userId = req.user.userId;

  const declinedInvite: RoomMember = await inviteService.acceptInvite(
    roomId,
    userId,
  );

  return res.status(200).json(declinedInvite);
}

export default {
  inviteUser,
  revokeInvite,
  acceptInvite,
  declineInvite,
};
