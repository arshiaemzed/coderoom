import type { RoomFile } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import fileManager from "../file-manager.js";
import roomManager from "../room-manager.js";
import loadFilesService from "../services/load.files.service.js";
import { WebSocket } from "ws";
import type { Client, Room, WebSocketResponse } from "../websocket.types.js";
import * as Y from "yjs";
import helper from "../../../helpers/helper.js";

async function loadFiles(client: WebSocket, requestId: string, roomId: string) {
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

function updateDoc(
  client: WebSocket,
  requestId: string,
  roomId: string,
  update: string,
) {
  connectionManager.checkAuth(client);

  const roomData = roomManager.requireRoomMember(client, roomId);

  const yDoc: Y.Doc = fileManager.getRoomDocument(roomData.room.id);

  const encodedData = helper.base64ToUint8Array(update);

  Y.applyUpdate(yDoc, encodedData);

  const message: WebSocketResponse = {
    type: "response",
    action: "doc_updated",
    requestId: requestId,
    success: true,
    data: {
      room: roomId,
      update: update,
    },
  };

  roomData.room.members.forEach((value: Client, socket: WebSocket) => {
    if (socket === client) {
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  });
}

export default {
  loadFiles,
  updateDoc,
};
