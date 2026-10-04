import { useParams } from "react-router";
import { useWebSocket } from "../websocket/useWebSocket";
import { useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";

import * as Y from "yjs";

type RoomStatus = "joined" | "joining" | "error" | "connecting";

const yDoc = new Y.Doc();

const yText = yDoc.getText("coderoom");

function uint8ArrayToBase64(data: Uint8Array) {
  let binary = "";

  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export function SessionScreen() {
  const params = useParams();

  const roomId = params.roomId;

  const ws = useWebSocket();

  const [roomStatus, setRoomStatus] = useState<RoomStatus>("joining");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoomStatus("error");
      return;
    }

    if (ws.status !== "connected") {
      setRoomStatus("connecting");
      return;
    }

    async function verifyAndJoin() {
      try {
        setRoomStatus("joining");

        await ws.joinRoom(roomId);

        setRoomStatus("joined");
      } catch (err: any) {
        const errorFormat = {
          success: false,
          error: {
            code: err.code || "INTERNAL_WEBSOCKET_ERROR",
            message: err.message || String(err),
          },
        };

        setRoomStatus("error");

        setErrorMessage(errorFormat.error.message);
      }
    }

    verifyAndJoin();
  }, [roomId, ws.status]);

  if (roomStatus === "connecting") {
    return <div>Connecting to the server ...</div>;
  }

  if (roomStatus === "joining") {
    return <div>Joining room ...</div>;
  }

  if (roomStatus === "joined") {
    return (
      <div>
        <SessionHeader />
        <CodeEditor />
      </div>
    );
  }

  if (roomStatus === "error" && errorMessage != null) {
    return <div>{errorMessage}</div>;
  }
}

function SessionHeader() {
  const ws = useWebSocket();

  return (
    <header className="session-header">
      <div className="session-coderoom">CodeRoom</div>

      <div>{ws.status}</div>

      <div>
        <button className="session-disconnect-btn">Disconnect</button>
      </div>
    </header>
  );
}

function CodeEditor() {
  const ws = useWebSocket();

  function handleMount(editor: any) {
    const model = editor.getModel();

    new MonacoBinding(yText, model, new Set([editor]));
  }

  async function handleUpdate(update: Uint8Array) {
    const encodedUpdate = uint8ArrayToBase64(update);

    ws.sendYjsUpdate(encodedUpdate);
  }

  useEffect(() => {
    yDoc.on("update", handleUpdate);

    return () => {
      yDoc.off("update", handleUpdate);
    };
  }, [ws]);

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// Hello welcome to coderoom"
        theme="vs-dark"
        onMount={handleMount}
      />
    </div>
  );
}
