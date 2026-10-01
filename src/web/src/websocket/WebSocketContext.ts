import { createContext } from "react";
import type { WebSocketContextValue } from "./types";

export const WebSocketContext = createContext<WebSocketContextValue | null>(
  null,
);
