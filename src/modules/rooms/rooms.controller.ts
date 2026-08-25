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

  const roomId = req.params.id as string;

  const deletedRoom = await roomsService.deleteRoom(roomId, userId);

  return res.status(200).json(deletedRoom);
}

async function getAllRooms(req: Request, res: Response) {
  const userId = req.user.userId;

  const rooms = await roomsService.getUserRooms(userId);

  return res.status(200).json(rooms);
}

export default {
  createRoom,
  deleteRoom,
  getAllRooms,
};
