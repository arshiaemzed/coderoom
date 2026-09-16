import type WebSocket from "ws";
import type { RoomFile } from "../../modules/rooms/rooms.type.js";
import roomManager from "./room-manager.js";
import WebSocketError from "./websocket.error.js";
import type { Client, Room } from "./websocket.types.js";

function notifyFileUpload(file: RoomFile) {
  const room: Room | undefined = roomManager.findRoomById(file.roomId);

  if (!room) {
    throw new WebSocketError(
      "ROOM_NOT_FOUND",
      "File uploaded to a room that hasnt been created in the server memory.",
    );
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
