import type { RoomFile } from "../rooms/rooms.type.js";
import roomService from "../rooms/rooms.service.js";
import filesRepository from "./files.repository.js";
import AppError from "../../shared/errors/error.js";
import errorCodes from "../../shared/errors/errorCodes.js";
import memberService from "../member/member.service.js";
import roomNotifier from "../../infrastructure/websocket/room.notifier.js";
import roomManager from "../../infrastructure/websocket/room-manager.js";
import fileManager from "../../infrastructure/websocket/file-manager.js";

async function getSpecificFile(userId: string, roomId: string, fileId: string) {
  await roomService.requireRoom(roomId);

  await memberService.requireMembership(roomId, userId);

  const file: File | undefined = await filesRepository.getSpecificFile(fileId);

  if (!file) {
    throw new AppError(
      404,
      "Requested file not found.",
      errorCodes.FILE_NOT_FOUND,
    );
  }

  return file;
}

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

  fileManager.addFile(
    uploadedFile.id,
    uploadedFile.roomId,
    uploadedFile.fileName,
    uploadedFile.content,
  );

  roomNotifier.notifyFileUpload(uploadedFile);

  return uploadedFile;
}

async function getRoomFiles(roomId: string, userId: string) {
  await roomService.requireRoom(roomId);

  await memberService.requireMembership(roomId, userId);

  const files = await filesRepository.getRoomFiles(roomId);

  return files;
}
export default {
  uploadFile,
  getSpecificFile,
  getRoomFiles,
};
