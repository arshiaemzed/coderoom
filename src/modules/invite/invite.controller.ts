import type { Request, Response } from "express";
import inviteService from "./invite.service.js";
import type { InvitedUser } from "./invite.type.js";

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

export default {
  inviteUser,
};
