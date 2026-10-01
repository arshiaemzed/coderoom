import { useContext } from "react";
import type { WebSocketContextValue } from "./types";
import { WebSocketContext } from "./WebSocketContext";

export function useWebSocket(): WebSocketContextValue {
  const context: WebSocketContextValue | null = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be inside WebSocketProvider");
  }

  return context;
}
