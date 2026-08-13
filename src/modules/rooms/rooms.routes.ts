import express, { type Router } from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import createRoomMiddleware from "./middlewares/createRoomMiddleware.js";
import roomsController from "./rooms.controller.js";
import { type Request, type Response, type NextFunction } from "express";
import deleteRoomMiddleware from "./middlewares/deleteRoomMiddleware.js";

const roomsRouter: Router = express.Router();

roomsRouter.get("/rooms", roomsController.getAllRooms);

roomsRouter.post("/rooms/create", authMiddleware, roomsController.createRoom);

roomsRouter.delete(
  "/rooms/:id/delete",
  authMiddleware,
  deleteRoomMiddleware,
  roomsController.deleteRoom,
);

export default roomsRouter;
