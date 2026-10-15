import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type {
  ConnectionStatus,
  WebSocketProviderProps,
  WebSocketRequest,
} from "./types";
import * as Y from "yjs";
import helper from "../helpers/helper";
import { useNavigate } from "react-router";
import { WebSocketContext } from "./WebSocketContext";

const REMOTE_UPADTE = Symbol("REMOTE_UPDATE");

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const authPromiseRef = useRef<Promise<void> | null>(null);

  const joinRoomPromiseRef = useRef<Promise<void> | null>(null);

  const pendingRequests = useRef<
    Map<
      string,
      {
        reject: (err: Error) => void;
        resolve: () => void;
      }
    >
  >(new Map());

  const roomDocument = useRef<Y.Doc>(new Y.Doc());

  const [files, setFiles] = useState<Map<string, string>>(new Map());

  const [members, setMembers] = useState<Map<string, string>>(new Map());

  function addMember(userId: string, displayName: string) {
    setMembers((prev) => {
      const updated = new Map(prev);

      updated.set(userId, displayName);

      return updated;
    });
  }

  function removeMember(userId: string) {
    setMembers((prev) => {
      const updated = new Map(prev);

      updated.delete(userId);
      return updated;
    });
  }

  const { status, user } = useAuth();

  const roomRef = useRef<string | null>(null);

  const navigate = useNavigate();

  function getRoomDocument(): Y.Doc {
    const doc = roomDocument.current;

    if (doc) {
      return doc;
    }

    const newDoc = new Y.Doc();

    roomDocument.current = newDoc;

    return newDoc;
  }

  function handleUpdate(value: Uint8Array, origin: any) {
    const roomId: string | null = roomRef.current;

    if (origin === REMOTE_UPADTE) {
      return;
    }

    if (!roomId) {
      return;
    }

    sendYjsUpdate(roomId, value);
  }

  async function leaveRoom(roomId: string): Promise<void> {
    try {
      return new Promise<void>((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket || socket?.readyState !== WebSocket.OPEN) {
          reject(new Error("You are not connected to the websocket server!"));
          return;
        }

        const requestId = crypto.randomUUID();

        const message: WebSocketRequest = {
          type: "request",
          event: "leave_room",
          requestId: requestId,
          data: {
            room: roomId,
          },
        };

        pendingRequests.current.set(requestId, {
          reject: reject,
          resolve: resolve,
        });

        socket.send(JSON.stringify(message));
      });
    } catch (err) {
      throw err;
    }
  }

  async function joinRoom(roomId: string) {
    if (joinRoomPromiseRef.current !== null) {
      return joinRoomPromiseRef.current;
    }

    try {
      joinRoomPromiseRef.current = new Promise<void>((resolve, reject) => {
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

        socket.send(JSON.stringify(message));
      }).then(() => {
        const doc = getRoomDocument();

        doc.on("update", handleUpdate);
      });
      console.log("joinRoomPromiseRef", joinRoomPromiseRef.current);

      await joinRoomPromiseRef.current;

      return joinRoomPromiseRef.current;
    } catch (error) {
      console.log(error);
      joinRoomPromiseRef.current = null;
    }
  }

  function authWebSocket(token: string): Promise<void> {
    if (authPromiseRef.current != null) {
      return authPromiseRef.current;
    }

    console.log("authPromiseRef", authPromiseRef.current);

    try {
      authPromiseRef.current = new Promise((resolve, reject) => {
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
      return authPromiseRef.current;
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

  useEffect(() => {
    if (status === "authenticated") {
      const ws = new WebSocket("ws://localhost:3002");

      const doc: Y.Doc = getRoomDocument();

      socketRef.current = ws;

      async function handleOpen() {
        if (!user || !user.token) {
          ws.close();
          throw new Error("Failed to retrieve user session token.");
        }
        await authWebSocket(user.token);
        console.log("Connected to websocket server.");
        setConnectionStatus("connected");
      }

      function handleClose() {
        socketRef.current = null;
        roomRef.current = null;
        ws.close();
        console.log("Disconnected from websocket server.");
        setConnectionStatus("disconnected");
      }

      function handleMessage(ev: MessageEvent<any>) {
        const response = JSON.parse(ev["data"]);

        const eventType = response.type;
        const ok = response.success;
        const requestId = response.requestId;
        const data = response.data;

        if (eventType === "event") {
          const event = response.event;

          if (event === "user_joined") {
            if (ok) {
              const userId = data.userId;
              const displayName = data.displayName;

              addMember(userId, displayName);
            }
          }

          if (event === "user_leaved") {
            if (ok) {
              const userId = data.userId;

              removeMember(userId);
            }
          }
        }

        if (eventType === "response") {
          const action = response.action;

          if (action === "login") {
            if (ok) {
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
              pendingRequests.current.delete(requestId);
              pendingRequests.current.delete(requestId);
              // authPromiseRef.current = null;
            }
          }

          if (action === "you_joined_room") {
            if (ok) {
              const users = data.members;

              for (let i = 0; i < users.length; i++) {
                const userId = users[i].userId;
                const displayName = users[i].displayName;

                addMember(userId, displayName);
              }

              console.log("you_joined_room");
              roomRef.current = data.roomId;
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
              pendingRequests.current.delete(requestId);
            }
          }

          if (action === "leaved_room") {
            if (ok) {
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
              pendingRequests.current.delete(requestId);
              authPromiseRef.current = null;
              joinRoomPromiseRef.current = null;
              roomRef.current = null;
              setMembers(new Map());
              navigate("/rooms", { replace: true });
            }
          }

          if (action === "doc_updated") {
            if (ok) {
              console.log("doc updated received");
              const update = data.update;

              const encodedUpdate = helper.base64ToUint8Array(update);

              console.log("doc updated");

              Y.applyUpdate(doc, encodedUpdate, REMOTE_UPADTE);

              const request = pendingRequests.current.get(requestId);
              request?.resolve();
              pendingRequests.current.delete(requestId);
            }
          }

          if (action === "received_files") {
            if (ok) {
              const decodedState: Uint8Array = helper.base64ToUint8Array(
                data.state,
              );

              Y.applyUpdate(doc, decodedState, REMOTE_UPADTE);

              const files = data.files;

              let roomFiles: Map<string, string> = new Map();

              for (let i = 0; i < files.length; i++) {
                roomFiles.set(files[i].id, files[i].name);
              }

              setFiles(roomFiles);
            }
          }
        }

        if (eventType === "error") {
          const errorObject = response.error;

          if (!ok) {
            const request = pendingRequests.current.get(requestId);
            request?.reject(errorObject.message);
            roomRef.current = null;
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

        doc.off("update", handleUpdate);

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
        files: files,
        getRoomDocument: getRoomDocument,
        joinRoom: joinRoom,
        leaveRoom: leaveRoom,
        status: connectionStatus,
        members: members,
      }}
    >
      {children}
    </WebSocketContext>
  );
}
