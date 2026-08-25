import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import inviteController from "./invite.controller.js";
import inviteUserMiddleware from "./middlewares/invite.user.middleware.js";
import acceptInviteMiddleware from "./middlewares/accept.invite.middleware.js";
import revokeInviteMiddleware from "./middlewares/revoke.invite.middleware.js";

const inviteRouter = express.Router();

inviteRouter.post(
  "/rooms/:roomid/members/invite",
  authMiddleware,
  inviteUserMiddleware,
  inviteController.inviteUser,
);

inviteRouter.post(
  "/rooms/:roomid/members/revokeInvite",
  authMiddleware,
  revokeInviteMiddleware,
  inviteController.revokeInvite,
);

inviteRouter.post(
  "/rooms/:roomid/invites/accept",
  authMiddleware,
  acceptInviteMiddleware,
  inviteController.acceptInvite,
);

inviteRouter.post(
  "/rooms/:roomid/invites/decline",
  authMiddleware,
  inviteController.declineInvite,
);

export default inviteRouter;
