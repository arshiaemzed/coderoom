import express from "express";
import memberController from "./member.controller.js";
import kickMemberMiddleware from "./middlewares/kick.member.middleware.js";
import cookieMiddleware from "../../shared/middleware/cookie.middleware.js";

const memberRouter = express.Router();

memberRouter.post(
  "/rooms/:roomid/members/kick",
  cookieMiddleware,
  kickMemberMiddleware,
  memberController.kickMember,
);

export default memberRouter;
