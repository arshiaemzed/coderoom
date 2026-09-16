import express, { type Router } from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import createRoomMiddleware from "./middlewares/createRoomMiddleware.js";
import roomsController from "./rooms.controller.js";
import { type Request, type Response, type NextFunction } from "express";
import deleteRoomMiddleware from "./middlewares/deleteRoomMiddleware.js";

const roomsRouter: Router = express.Router();

roomsRouter.get("/rooms", authMiddleware, roomsController.getAllRooms);

roomsRouter.post("/rooms", authMiddleware, roomsController.createRoom);

roomsRouter.delete(
  "/rooms/:id",
  authMiddleware,
  deleteRoomMiddleware,
  roomsController.deleteRoom,
);

export default roomsRouter;
