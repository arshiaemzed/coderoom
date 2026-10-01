import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { ConnectionStatus, WebSocketProviderProps } from "./types";
import { WebSocketContext } from "./WebSocketContext";

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  const { status, user } = useAuth();
  function connectToRoom(roomId: string) {
    if (socketRef.current != null) {
      const message = JSON.stringify({
        type: "join_room",
        room: roomId,
      });

      console.log(message);

      socketRef.current.send(message);
    }
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

      ws.addEventListener("open", handleOpen);

      ws.addEventListener("close", handleClose);

      return () => {
        ws.removeEventListener("open", handleOpen);

        ws.removeEventListener("close", handleClose);

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
