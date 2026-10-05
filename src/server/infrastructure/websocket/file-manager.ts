import type { File } from "./websocket.types.js";

import * as Y from "yjs";

// each room got its own document
let docs: Map<string, Y.Doc> = new Map();

let files: Array<File> = [];

function initializeDocs(files: any) {
  for (let i = 0; i < files.length; i++) {
    const yDoc = new Y.Doc();

    docs.set(files[i].room_id, yDoc);

    const yText = yDoc.getText(files[i].id);

    yText.insert(0, files[i].content);
  }
}

function getRoomDocument(roomId: string): Y.Doc {
  const doc: Y.Doc | undefined = docs.get(roomId);

  if (doc) {
    return doc;
  }

  const newDoc = new Y.Doc();

  docs.set(roomId, newDoc);

  return newDoc;
}

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
  getRoomDocument,
  initializeDocs,
};
