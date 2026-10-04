import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type {
  ConnectionStatus,
  WebSocketProviderProps,
  WebSocketRequest,
} from "./types";
import { WebSocketContext } from "./WebSocketContext";

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

  const { status, user } = useAuth();

  async function connectToRoom(roomId: string): Promise<void> {
    try {
      // TODO: Fix hardcoded !
      await authWebSocket(user!.token);

      return new Promise((resolve, reject) => {
        if (socketRef.current?.readyState !== WebSocket.OPEN || !socketRef) {
          reject(new Error("You are not connected to the websocket server!"));
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

  function authWebSocket(token: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        if (socketRef.current?.readyState !== WebSocket.OPEN || !socketRef) {
          reject(new Error("You are not connected to the websocket server!"));
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
        const data = JSON.parse(ev["data"]);

        const eventType = data.type;
        const ok = data.success;
        const requestId = data.requestId;

        if (eventType === "response") {
          const action = data.action;

          if (action === "login") {
            if (ok) {
              const request = pendingRequests.current.get(requestId);
              request?.resolve();
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
          const errorObject = data.error;

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
      value={{ status: connectionStatus, joinRoom: connectToRoom }}
    >
      {children}
    </WebSocketContext>
  );
}
