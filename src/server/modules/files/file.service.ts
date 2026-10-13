import type { RoomFile } from "../rooms/rooms.type.js";
import roomService from "../rooms/rooms.service.js";
import filesRepository from "./files.repository.js";
import AppError from "../../shared/errors/error.js";
import memberService from "../member/member.service.js";
import roomNotifier from "../../infrastructure/websocket/room.notifier.js";
import roomManager from "../../infrastructure/websocket/room-manager.js";
import fileManager from "../../infrastructure/websocket/file-manager.js";

async function getSpecificFile(userId: string, roomId: string, fileId: string) {
  await roomService.requireRoom(roomId);

  await memberService.requireMembership(roomId, userId);

  const file: File | undefined = await filesRepository.getSpecificFile(fileId);

  if (!file) {
    throw new AppError({
      statusCode: 404,
      errorCode: "FILE_NOT_FOUND",
      errorMessage: "Requested file not found.",
    });
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
    throw new AppError({
      statusCode: 403,
      errorCode: "NOT_ENOUGH_PERMISSION_TO_UPLOAD_FILES",
      errorMessage: "You are not allowed to upload files.",
    });
  }

  const uploadedFile: RoomFile | undefined = await filesRepository.uploadFile(
    userId,
    roomId,
    fileName,
    content,
  );

  if (!uploadedFile) {
    throw new AppError({
      statusCode: 500,
      errorCode: "UPLOAD_FILE_FAILED",
      errorMessage: "Failed to upload the file.",
    });
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
