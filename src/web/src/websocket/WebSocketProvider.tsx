import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type {
  ConnectionStatus,
  WebSocketProviderProps,
  WebSocketRequest,
} from "./types";
import { WebSocketContext } from "./WebSocketContext";
import * as Y from "yjs";
import helper from "../helpers/helper";

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  const pendingRequests = useRef<
    Map<
      string,
      {
        reject: (err: Error) => void;
        resolve: () => void;
      }
    >
  >(new Map());

  const roomDocuments = useRef<Map<string, Y.Doc>>(new Map());

  const [files, setFiles] = useState<Map<string, string>>(new Map());

  const { status, user } = useAuth();

  function getRoomDocument(roomId: string): Y.Doc {
    const doc = roomDocuments.current.get(roomId);

    if (doc) {
      return doc;
    }

    const newDoc = new Y.Doc();

    roomDocuments.current.set(roomId, newDoc);

    return newDoc;
  }

  async function connectToRoom(roomId: string): Promise<void> {
    try {
      // TODO: Fix hardcoded !
      await authWebSocket(user!.token);

      return new Promise((resolve, reject) => {
        const socket = socketRef.current;

        if (!socket || socket?.readyState !== WebSocket.OPEN) {
          reject(new Error("You are not connected to the websocket server!"));
          return;
        }

        const requestId: string = crypto.randomUUID();

        pendingRequests.current.set(requestId, {
          resolve: resolve,
          reject: reject,
        });

        const message: WebSocketRequest = {
          type: "request",
          requestId: requestId,
          event: "join_room",
          data: {
            room: roomId,
          },
        };

        socketRef.current?.send(JSON.stringify(message));
      });
    } catch (error) {
      throw error;
    }
  }

  function sendYjsUpdate(roomId: string, data: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;

      if (!socket || socket?.readyState !== WebSocket.OPEN) {
        reject(new Error("You are not connected to the websocket server!"));
        return;
      }

      const requestId: string = crypto.randomUUID();

      const message: WebSocketRequest = {
        type: "request",
        requestId: requestId,
        event: "yjs_update",
        data: { room: roomId, update: helper.uInt8ArrayToBase64(data) },
      };

      pendingRequests.current.set(requestId, {
        resolve: resolve,
        reject: reject,
      });

      socketRef.current?.send(JSON.stringify(message));
    });
  }

  function authWebSocket(token: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket || socket?.readyState !== WebSocket.OPEN) {
          reject(new Error("You are not connected to the websocket server!"));
          return;
        }

        const requestId: string = crypto.randomUUID();

        const message: WebSocketRequest = {
          type: "request",
          requestId: requestId,
          event: "login",
          data: {
            token: token,
          },
        };

        pendingRequests.current.set(requestId, {
          resolve: resolve,
          reject: reject,
        });

        socketRef.current?.send(JSON.stringify(message));
      });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      setConnectionStatus("connecting");

      const ws = new WebSocket("ws://localhost:3002");

      socketRef.current = ws;

      function handleOpen() {
        setConnectionStatus("connected");
        console.log("Connected to websocket server.");
      }

      function handleClose() {
        socketRef.current = null;
        setConnectionStatus("disconnected");
        console.log("Disconnected from websocket server.");
      }

      function handleMessage(ev: MessageEvent<any>) {
        const response = JSON.parse(ev["data"]);

        const eventType = response.type;
        const ok = response.success;
        const requestId = response.requestId;

        if (eventType === "response") {
          const action = response.action;

          if (action === "login") {
            if (ok) {
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
            }
          }

          if (action === "doc_updated") {
            if (ok) {
              const data = response.data;
              const update = data.update;

              const roomId = data.room;

              const doc = getRoomDocument(roomId);

              const encodedUpdate = helper.base64ToUint8Array(update);

              Y.applyUpdate(doc, encodedUpdate);
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
              pendingRequests.current.delete(requestId);
            }
          }

          if (action === "received_files") {
            if (ok) {
              const data = response.data;

              const roomId: string = data.room;

              const doc: Y.Doc = getRoomDocument(roomId);

              const decodedState: Uint8Array = helper.base64ToUint8Array(
                data.state,
              );

              Y.applyUpdate(doc, decodedState);

              roomDocuments.current.set(roomId, doc);

              const files = data.files;

              let roomFiles: Map<string, string> = new Map();

              for (let i = 0; i < files.length; i++) {
                roomFiles.set(files[i].id, files[i].name);
              }

              setFiles(roomFiles);
            }
          }

          if (action === "you_joined_room") {
            if (ok) {
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
            }
          }
        }

        if (eventType === "error") {
          const errorObject = response.error;

          if (!ok) {
            const request = pendingRequests.current.get(requestId);
            request?.reject(errorObject.message);
          }
        }
      }

      ws.addEventListener("open", handleOpen);

      ws.addEventListener("close", handleClose);

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("open", handleOpen);

        ws.removeEventListener("close", handleClose);

        ws.removeEventListener("message", handleMessage);

        if (socketRef.current === ws) {
          socketRef.current = null;
        }

        ws.close();
      };
    }
  }, [status]);

  return (
    <WebSocketContext
      value={{
        status: connectionStatus,
        joinRoom: connectToRoom,
        sendYjsUpdate: sendYjsUpdate,
        getRoomDocument: getRoomDocument,
        files: files,
      }}
    >
      {children}
    </WebSocketContext>
  );
}
