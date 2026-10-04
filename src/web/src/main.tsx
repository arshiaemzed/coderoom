import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./auth/AuthContext.tsx";
import "./styles/login.css";
import "./styles/room.css";
import "./styles/global.css";
import "./styles/session.css";
import { RoomProvider } from "./room/RoomContext.tsx";
import { WebSocketProvider } from "./websocket/WebSocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WebSocketProvider>
          <RoomProvider>
            <App />
          </RoomProvider>
        </WebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
