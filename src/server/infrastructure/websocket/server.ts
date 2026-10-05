import { WebSocketServer, WebSocket } from "ws";
import eventRouter from "./event-router.js";
import roomManager from "./room-manager.js";
import connectionManager from "./connection-manager.js";
import WebSocketError from "./websocket.error.js";
import { getAllFiles } from "./services/get.all.files.service.js";
import fileManager from "./file-manager.js";
import { getAllRooms } from "./services/get.all.rooms.service.js";

export function runWebSocketServer() {
  const server = new WebSocketServer({ port: 3002 });

  const alive = new Map<WebSocket, boolean>();

  server.on("listening", async () => {
    console.log(`WebSocket server is listening on port 3002`);

    const rooms = await getAllRooms();

    await roomManager.initializeRooms(rooms);

    const files = await getAllFiles();

    await fileManager.initializeDocs(files);
  });

  server.on("error", (error) => {
    console.log(`WebSocket server error: ${error}`);
  });

  server.on("close", () => {
    console.log(`WebSocket server closed !`);
  });

  server.on("connection", (socket: WebSocket) => {
    console.log("Client connected");

    socket.on("message", async (e) => {
      try {
        alive.set(socket, true);
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

    socket.on("pong", () => {
      alive.set(socket, true);
    });

    const hearbeat = setInterval(() => {
      server.clients.forEach((socket: WebSocket) => {
        if (alive.get(socket) === false) {
          alive.delete(socket);
          socket.terminate();
          return;
        }

        alive.set(socket, false);

        socket.ping();
      });
    }, 10000);

    socket.on("close", () => {
      console.log("killed connection");
      const room = roomManager.findRoomBySocket(socket);
      connectionManager.remove(socket);

      if (!room) {
        return;
      }

      roomManager.removeMember(socket, room.id);

      room.cursors.delete(socket);

      clearInterval(hearbeat);
    });
  });
}
