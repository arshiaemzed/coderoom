import type { RoomFile } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import fileManager from "../file-manager.js";
import roomManager from "../room-manager.js";
import loadFilesService from "../services/load.files.service.js";
import type { WebSocket } from "ws";
import type { WebSocketResponse } from "../websocket.types.js";
import * as Y from "yjs";

async function loadFiles(client: WebSocket, roomId: string, requestId: string) {
  connectionManager.checkAuth(client);

  const roomData = roomManager.requireRoomMember(client, roomId);

  const files: Array<RoomFile> = await loadFilesService.loadFiles(
    roomId,
    roomData.member.userId,
  );

  const roomDoc = fileManager.getRoomDocument(roomId);

  const state: Uint8Array = Y.encodeStateAsUpdate(roomDoc);

  const encodedState = Buffer.from(state).toString("base64");

  const message: WebSocketResponse = {
    type: "response",
    action: "received_files",
    requestId: requestId,
    success: true,
    data: {
      room: roomId,
      files: files.map((file) => ({
        id: file.id,
        name: file.fileName,
      })),
      state: encodedState,
    },
  };

  client.send(JSON.stringify(message));
}

export default {
  loadFiles,
};
