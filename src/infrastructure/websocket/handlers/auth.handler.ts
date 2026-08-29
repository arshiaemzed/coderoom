import type { AuthSession } from "../../../modules/auth/auth.types.js";
import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";
import authService from "../services/auth.service.js";

async function auth(client: WebSocket, token: string) {
  if (connectionManager.get(client)) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "You are already connected to the server",
      }),
    );
    client.close();
  }

  const clients = connectionManager.getAll();

  const authSession: AuthSession = await authService.auth(token);

  if (clients.values().find((e) => e.userId == authSession.userId)) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "There is someone already connected using the same creds.",
      }),
    );
    client.close();
    return;
  }

  connectionManager.add(client, {
    userId: authSession.userId,
    displayName: authSession.displayName,
  });

  client.send(
    JSON.stringify({ type: "login_success", userId: authSession.userId }),
  );
}

export default {
  auth,
};
