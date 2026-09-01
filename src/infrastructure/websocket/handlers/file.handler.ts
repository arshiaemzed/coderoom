import type { RoomFile } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import fileManager from "../file-manager.js";
import roomManager from "../room-manager.js";
import loadFilesService from "../services/load.files.service.js";
import type { WebSocket } from "ws";

async function loadFiles(client: WebSocket, roomId: string) {
  connectionManager.checkAuth(client);

  const roomData = roomManager.requireRoomMember(client, roomId);

  const files: Array<RoomFile> = await loadFilesService.loadFiles(
    roomId,
    roomData.member.userId,
  );

  const message = {
    type: "received_files",
    files: files,
  };

  files.forEach((v: RoomFile) => {
    fileManager.addFile(v.id, v.roomId, v.fileName, v.content);
  });

  client.send(JSON.stringify(message));
}

export default {
  loadFiles,
};
