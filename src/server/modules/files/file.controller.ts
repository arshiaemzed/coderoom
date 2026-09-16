import { type Request, type Response } from "express";

import fileService from "./file.service.js";

async function uploadFile(req: Request, res: Response) {
  const userId: string = req.user.userId;

  const roomId = req.params.id as string;

  const { fileName, fileContent } = req.body;

  const uploadedFile = await fileService.uploadFile(
    userId,
    roomId,
    fileName,
    fileContent,
  );

  return res.status(200).json(uploadedFile);
}

async function getSpecificFile(req: Request, res: Response) {
  const roomId = req.params.roomid as string;

  const fileId = req.params.fileid as string;

  const userId = req.user.userId;

  const file = await fileService.getSpecificFile(userId, roomId, fileId);

  return res.status(200).json(file);
}

async function getRoomFiles(req: Request, res: Response) {
  const userId = req.user.userId;
  const roomId = req.params.roomid as string;

  const files = await fileService.getRoomFiles(roomId, userId);

  return res.status(200).json(files);
}

export default {
  uploadFile,
  getSpecificFile,
  getRoomFiles,
};
