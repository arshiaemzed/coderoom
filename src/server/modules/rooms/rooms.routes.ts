import express, { type Router } from "express";
import roomsController from "./rooms.controller.js";
import deleteRoomMiddleware from "./middlewares/deleteRoomMiddleware.js";
import cookieMiddleware from "../../shared/middleware/cookie.middleware.js";

const roomsRouter: Router = express.Router();

roomsRouter.get("/rooms", cookieMiddleware, roomsController.getAllRooms);

roomsRouter.post("/rooms", cookieMiddleware, roomsController.createRoom);

roomsRouter.delete(
  "/rooms/:id",
  cookieMiddleware,
  deleteRoomMiddleware,
  roomsController.deleteRoom,
);

export default roomsRouter;
