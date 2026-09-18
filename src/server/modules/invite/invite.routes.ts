import express from "express";
import inviteController from "./invite.controller.js";
import inviteUserMiddleware from "./middlewares/invite.user.middleware.js";
import acceptInviteMiddleware from "./middlewares/accept.invite.middleware.js";
import revokeInviteMiddleware from "./middlewares/revoke.invite.middleware.js";
import cookieMiddleware from "../../shared/middleware/cookie.middleware.js";

const inviteRouter = express.Router();

inviteRouter.post(
  "/rooms/:roomid/members/invite",
  cookieMiddleware,
  inviteUserMiddleware,
  inviteController.inviteUser,
);

inviteRouter.post(
  "/rooms/:roomid/members/revokeInvite",
  cookieMiddleware,
  revokeInviteMiddleware,
  inviteController.revokeInvite,
);

inviteRouter.post(
  "/rooms/:roomid/invites/accept",
  cookieMiddleware,
  acceptInviteMiddleware,
  inviteController.acceptInvite,
);

inviteRouter.post(
  "/rooms/:roomid/invites/decline",
  cookieMiddleware,
  inviteController.declineInvite,
);

inviteRouter.get(
  "/rooms/:roomid/invites",
  cookieMiddleware,
  inviteController.getUserInvites,
);

export default inviteRouter;
