import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import inviteController from "./invite.controller.js";
import inviteUserMiddleware from "./middlewares/invite.user.middleware.js";

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
  inviteController.revokeInvite,
);

export default inviteRouter;
