import type { ReactNode } from "react";
import type { Awareness } from "y-protocols/awareness.js";
import * as Y from "yjs";

type ConnectionStatus = "connected" | "disconnected" | "connecting";

type WebSocketContextValue = {
  status: ConnectionStatus;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  getRoomDocument: (roomId: string) => Y.Doc;
  getAwareness: () => Awareness;
  files: Map<string, string>;
  members: Map<string, string>;
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
