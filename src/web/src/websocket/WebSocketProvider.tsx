import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { ConnectionStatus, WebSocketProviderProps } from "./types";
import { WebSocketContext } from "./WebSocketContext";

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  const pendingJoinRef = useRef<{
    roomId: string;
    resolve: () => void;
    reject: (error: Error) => void;
  } | null>(null);

  const { status, user } = useAuth();

  function connectToRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (socketRef.current?.readyState !== WebSocket.OPEN || !socketRef) {
        reject(new Error("You are not connected to the websocket server!"));
      }

      pendingJoinRef.current = {
        roomId: roomId,
        resolve: resolve,
        reject: reject,
      };

      const message = JSON.stringify({
        type: "join_room",
        room: roomId,
      });

      socketRef.current?.send(message);
    });
  }

  function authWebSocket(token: string) {
    if (socketRef.current != null) {
      const message = JSON.stringify({
        type: "login",
        token: token,
      });

      socketRef.current.send(message);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      setConnectionStatus("connecting");

      const ws = new WebSocket("ws://localhost:3002");

      socketRef.current = ws;

      function handleOpen() {
        setConnectionStatus("connected");
        authWebSocket(user!.token);
        console.log(`Connected to websocket server.`);
      }

      function handleClose() {
        socketRef.current = null;
        setConnectionStatus("disconnected");
        console.log(`Disconnected from websocket server.`);
      }

      function handleMessage(ev: MessageEvent<any>) {
        const data = JSON.parse(ev["data"]);

        const messageCode = data.code;

        // listening for joining room message
        if (messageCode === "you_joined_room") {
          pendingJoinRef.current?.resolve();
          pendingJoinRef.current = null;
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
