import { type Request, type Response } from "express";
import memberService from "./member.service.js";

async function kickMember(req: Request, res: Response) {
  const roomId = req.params.roomid as string;
  const userId = req.user.userId;
  const memberId = req.body.user_id;

  const kickedMember = await memberService.kickMember(roomId, userId, memberId);

  return res.status(200).json(kickedMember);
}

export default {
  kickMember,
};
