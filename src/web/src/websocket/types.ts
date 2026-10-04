import type { ReactNode } from "react";

type ConnectionStatus = "connected" | "disconnected" | "connecting";

type WebSocketContextValue = {
  status: ConnectionStatus;
  joinRoom: Function;
  sendYjsUpdate: Function;
};

type WebSocketProviderProps = {
  children: ReactNode;
};

interface WebSocketRequest {
  type: string;
  requestId: string;
  event: string;
  data: any;
}

export type {
  WebSocketContextValue,
  WebSocketProviderProps,
  ConnectionStatus,
  WebSocketRequest,
};
