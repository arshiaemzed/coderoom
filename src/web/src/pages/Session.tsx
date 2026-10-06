import { useParams } from "react-router";
import { useWebSocket } from "../websocket/useWebSocket";
import { useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";

type RoomStatus = "joined" | "joining" | "error" | "connecting";

type CodeEditorProps = {
  roomId: string;
  fileId: string;
};

type FilesSideBarProps = {
  onClick: Function;
};

export function SessionScreen() {
  const params = useParams();

  const roomId = params.roomId;

  const ws = useWebSocket();

  const [roomStatus, setRoomStatus] = useState<RoomStatus>("joining");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [file, setFile] = useState<string | null>();

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
        <div className="editor-and-files-sidebar-div">
          <FilesSideBar onClick={setFile} />
          {file && <CodeEditor key={file} fileId={file} roomId={roomId!} />}
        </div>
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

function FilesSideBar({ onClick }: FilesSideBarProps) {
  const ws = useWebSocket();

  return (
    <div className="file-name-side-bar">
      {[...ws.files.entries()].map(([key, value]) => (
        <button onClick={() => onClick(key)} key={key}>
          {value}
        </button>
      ))}
    </div>
  );
}

function CodeEditor({ roomId, fileId }: CodeEditorProps) {
  const ws = useWebSocket();

  console.log("hey");
  console.log(`fileId: ${fileId}`);

  function handleMount(editor: any) {
    const yDoc = ws.getRoomDocument(roomId);

    const yText = yDoc.getText(fileId);

    const model = editor.getModel();

    console.log(yText.toString());

    new MonacoBinding(yText, model, new Set([editor]));
  }

  return (
    <div className="editor">
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        onMount={handleMount}
      />
    </div>
  );
}
