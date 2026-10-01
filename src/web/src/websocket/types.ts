import type { ReactNode } from "react";

type ConnectionStatus = "connected" | "disconnected" | "connecting";

type WebSocketContextValue = {
  status: ConnectionStatus;
  joinRoom: Function;
};

type WebSocketProviderProps = {
  children: ReactNode;
};

export type { WebSocketContextValue, WebSocketProviderProps, ConnectionStatus };
