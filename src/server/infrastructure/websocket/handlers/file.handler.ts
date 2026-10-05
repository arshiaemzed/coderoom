import type { RoomFile } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import fileManager from "../file-manager.js";
import roomManager from "../room-manager.js";
import loadFilesService from "../services/load.files.service.js";
import type { WebSocket } from "ws";
import type { WebSocketResponse } from "../websocket.types.js";

async function loadFiles(client: WebSocket, roomId: string, requestId: string) {
  connectionManager.checkAuth(client);

  const roomData = roomManager.requireRoomMember(client, roomId);

  const files: Array<RoomFile> = await loadFilesService.loadFiles(
    roomId,
    roomData.member.userId,
  );

  const message: WebSocketResponse = {
    type: "response",
    action: "received_files",
    requestId: requestId,
    success: true,
    data: {
      room: roomId,
      files: files,
    },
  };

  files.forEach((v: RoomFile) => {
    fileManager.addFile(v.id, v.roomId, v.fileName, v.content);
  });

  client.send(JSON.stringify(message));
}

export default {
  loadFiles,
};
