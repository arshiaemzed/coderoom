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

export default {
  uploadFile,
};
