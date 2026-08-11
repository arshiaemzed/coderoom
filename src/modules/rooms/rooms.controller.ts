import { type Request, type Response } from "express";
import roomsService from "./rooms.service.js";

async function createRoom(req: Request, res: Response) {
  let roomName: string | undefined;

  if (req.body) {
    roomName = req.body.name;
  }

  const userId: string = req.user.userId;

  const newSession = await roomsService.createRoom(userId, roomName);

  return res.status(200).json(newSession);
}

async function deleteRoom(req: Request, res: Response) {
  const userId: string = req.user.userId;

  const roomId: string = req.params.id;

  const deletedRoom = await roomsService.deleteRoom(roomId, userId);
}

export default {
  createRoom,
  deleteRoom,
};
