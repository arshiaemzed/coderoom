import type { ReactNode } from "react";
import * as Y from "yjs";

type ConnectionStatus = "connected" | "disconnected" | "connecting";

type WebSocketContextValue = {
  status: ConnectionStatus;
  joinRoom: Function;
  sendYjsUpdate: (roomId: string, data: Uint8Array) => Promise<void>;
  getRoomDocument: (roomId: string) => Y.Doc;
  files: Map<string, string>;
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
