import crypto from "crypto";
import authRepository from "../../../modules/auth/auth.repository.js";
import connectionManager from "../connection-manager.js";
import { WebSocket } from "ws";

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

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const valid = await authRepository.findSessionByTokenHash(tokenHash);

  if (!valid) {
    client.send(JSON.stringify({ type: "message", message: "Invalid token." }));
    client.close();
    return;
  }

  if (clients.values().find((e) => e.userId == valid.userId)) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "There is someone already connected using the same creds.",
      }),
    );
    client.close();
    return;
  }

  clients.set(client, { userId: valid.userId, displayName: valid.displayName });
  client.send(JSON.stringify({ type: "login_success", userId: valid.userId }));
}

export default {
  auth,
};
