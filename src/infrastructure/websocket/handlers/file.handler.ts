import type { RoomFile } from "../../../modules/rooms/rooms.type.js";
import connectionManager from "../connection-manager.js";
import fileManager from "../file-manager.js";
import roomManager from "../room-manager.js";
import loadFilesService from "../services/load.files.service.js";
import type { WebSocket } from "ws";
import type { Delete, Insert } from "../websocket.types.js";

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

async function deleteOp(client: WebSocket, roomId: string, operation: Delete) {
  connectionManager.checkAuth(client);

  roomManager.requireRoomMember(client, roomId);

  const data = fileManager.deleteOperation(operation);

  const message = {
    type: "delete_operation",
    fileId: operation.fileId,
    position: operation.position,
  };

  data?.members.forEach((client, socket) => {
    console.log("send delete mssage to all sockets in the room");
    socket.send(JSON.stringify(message));
  });
}

async function insertOp(client: WebSocket, roomId: string, operation: Insert) {
  connectionManager.checkAuth(client);

  roomManager.requireRoomMember(client, roomId);

  const data = fileManager.insertOperation(operation);

  const message = {
    type: "insert_operation",
    fileId: operation.fileId,
    position: operation.position,
    inserted: operation.inserted,
  };

  data?.members.forEach((client, socket) => {
    console.log("send insert mssage to all sockets in the room");
    socket.send(JSON.stringify(message));
  });
}

export default {
  loadFiles,
  insertOp,
  deleteOp,
};
