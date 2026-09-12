import roomManager from "./room-manager.js";
import type { Delete, File, Insert } from "./websocket.types.js";

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

function deleteOperation(operation: Delete) {
  const file = files.find((e) => e.id === operation.fileId);

  if (!file) {
    return;
  }

  const room = roomManager.findRoomById(file.roomId);

  const fileContentArray = file.content.split("");

  console.log(operation.position);

  fileContentArray.splice(operation.position, 1);

  let updatedFileContent: string = fileContentArray.join("");
  file.content = updatedFileContent;

  console.log(fileContentArray);

  console.log(updatedFileContent);

  return room;
}

function insertOperation(operation: Insert) {
  const file = files.find((e) => e.id === operation.fileId);

  if (!file) {
    return;
  }

  const room = roomManager.findRoomById(file.roomId);

  const fileContentArray = file.content.split("");

  console.log(operation.position);
  fileContentArray.splice(operation.position, 0, operation.inserted);
  let updatedFileContent: string = fileContentArray.join("");
  file.content = updatedFileContent;

  console.log(fileContentArray);

  console.log(updatedFileContent);

  return room;
}

export default {
  addFile,
  insertOperation,
  deleteOperation,
};
