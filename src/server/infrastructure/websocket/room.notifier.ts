import type WebSocket from "ws";
import type { RoomFile } from "../../modules/rooms/rooms.type.js";
import roomManager from "./room-manager.js";
import type { Client, Room } from "./websocket.types.js";
import AppError from "../../shared/errors/error.js";

function notifyFileUpload(file: RoomFile) {
  const room: Room | undefined = roomManager.findRoomById(file.roomId);

  if (!room) {
    throw new AppError({
      errorCode: "ROOM_NOT_FOUND",
      errorMessage: "Room not found.",
    });
  }

  room.members.forEach((client: Client, member: WebSocket) => {
    const message = {
      type: "new_file_uploaded",
      data: {
        fileId: file.id,
        roomId: file.roomId,
        fileName: file.fileName,
        fileContent: file.content,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    };

    member.send(JSON.stringify(message));
  });
}

export default {
  notifyFileUpload,
};
