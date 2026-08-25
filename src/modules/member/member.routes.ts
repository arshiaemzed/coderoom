import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import memberController from "./member.controller.js";
import kickMemberMiddleware from "./middlewares/kick.member.middleware.js";

const memberRouter = express.Router();

memberRouter.post(
  "/rooms/:roomid/members/kick",
  authMiddleware,
  kickMemberMiddleware,
  memberController.kickMember,
);

export default memberRouter;
