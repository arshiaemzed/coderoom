import type { AuthSession } from "../../../modules/auth/auth.types.js";
import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import authService from "../services/auth.service.js";
import type { Client, WebSocketResponse } from "../websocket.types.js";
import { connect } from "node:http2";

async function auth(client: WebSocket, token: string, requestId: string) {
  if (connectionManager.get(client)) {
    throw new Error("You are already connected to the server.");
  }

  const clients = connectionManager.getAll();

  const authSession: AuthSession = await authService.auth(token);

  const user = clients.values().find((e) => e.userId == authSession.userId);

  if (user) {
    clients.forEach((v: Client, k: WebSocket) => {
      if (v.userId === authSession.userId) {
        connectionManager.remove(k);
        k.close();
      }
    });
  }

  connectionManager.add(client, {
    userId: authSession.userId,
    displayName: authSession.displayName,
  });

  const response: WebSocketResponse = {
    type: "response",
    requestId: requestId,
    action: "login",
    success: true,
    data: {
      userId: authSession.userId,
    },
  };

  client.send(JSON.stringify(response));
}

export default {
  auth,
};
