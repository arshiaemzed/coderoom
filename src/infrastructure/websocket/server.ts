import { WebSocketServer, WebSocket } from "ws";
import eventRouter from "./event-router.js";
import roomManager from "./room-manager.js";
import connectionManager from "./connection-manager.js";

const server = new WebSocketServer({ port: 3002 });

server.on("connection", (socket: WebSocket) => {
  socket.on("message", async (e) => {
    await eventRouter(socket, e);
  });

  socket.on("close", () => {
    const room = roomManager.findRoomBySocket(socket);
    connectionManager.remove(socket);

    if (!room) {
      return;
    }

    roomManager.removeMember(socket, room.id);

    room.cursors.delete(socket);
  });
});

export default server;
