import { WebSocketServer, WebSocket } from "ws";
import eventRouter from "./event-router.js";
import roomManager from "./room-manager.js";
import connectionManager from "./connection-manager.js";
import WebSocketError from "./websocket.error.js";

const server = new WebSocketServer({ port: 3002 });

server.on("connection", (socket: WebSocket) => {
  console.log("client connected");

  socket.on("message", async (e) => {
    try {
      await eventRouter(socket, e);
    } catch (error) {
      if (error instanceof WebSocketError) {
        socket.send(
          JSON.stringify({ code: error.code, message: error.message }),
        );
        console.log(`catched error: ${error.message}`);
      }
    }
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
