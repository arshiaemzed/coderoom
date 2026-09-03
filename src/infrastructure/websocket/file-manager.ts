import type { RoomFile } from "../../modules/rooms/rooms.type.js";
import WebSocketError from "./websocket.error.js";
import type { File } from "./websocket.types.js";

let files: Array<File> = [];

function addFile(
  id: string,
  roomId: string,
  fileName: string,
  fileContent: string,
): File | undefined {
  const file: File | undefined = files.find((e) => e.id === id);

  if (file) {
    return;
  }

  files.push({ id: id, roomId: roomId, name: fileName, content: fileContent });

  return { id: id, roomId: roomId, name: fileName, content: fileContent };
}

export default {
  addFile,
};
