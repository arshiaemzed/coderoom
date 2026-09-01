import type { File } from "./websocket.types.js";

let files: Array<File> = [];

function addFile(
  id: string,
  roomId: string,
  fileName: string,
  fileContent: string,
): File {
  files.push({ id: id, roomId: roomId, name: fileName, content: fileContent });

  return { id: id, roomId: roomId, name: fileName, content: fileContent };
}

export default {
  addFile,
};
