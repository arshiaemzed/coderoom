import type { RoomFile } from "../rooms/rooms.type.js";
import roomService from "../rooms/rooms.service.js";
import filesRepository from "./files.repository.js";
import AppError from "../../shared/errors/error.js";
import errorCodes from "../../shared/errors/errorCodes.js";

async function getSpecificFile(
  userId: string,
  roomId: string,
  fileId: string,
) {}

async function uploadFile(
  userId: string,
  roomId: string,
  fileName: string,
  content: string,
): Promise<RoomFile> {
  await roomService.requireRoom(roomId);

  const isOwner = await roomService.requireOwnerPermission(roomId, userId);

  if (!isOwner) {
    throw new AppError(
      403,
      "You are not allowed to upload files.",
      errorCodes.NOT_ENOUGH_PERMISSION_TO_UPLOAD_FILES,
    );
  }

  const uploadedFile: RoomFile | undefined = await filesRepository.uploadFile(
    userId,
    roomId,
    fileName,
    content,
  );

  if (!uploadedFile) {
    throw new AppError(
      500,
      "Failed to upload the file.",
      errorCodes.UPLOAD_FILE_FAILED,
    );
  }

  return uploadedFile;
}

export default {
  uploadFile,
};
