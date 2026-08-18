import { WebSocket } from "ws";
import authHandler from "./handlers/auth.handler.js";
import connectionManager from "./connection-manager.js";
import roomHandler from "./handlers/room.handler.js";
import { type Event } from "./websocket.types.js";
import messageHandler from "./handlers/message.handler.js";
import cursorHandler from "./handlers/cursor.handler.js";

async function eventRouter(socket: WebSocket, data: any) {
  const event = JSON.parse(data.toString());

  // Authentication Events
  if (event.type === "login" && event.token) {
    await authHandler.auth(socket, event.token);
  }

  // Normal events
  if (connectionManager.get(socket) && event.type !== "login" && !event.token) {
    const userEvent: Event = event;

    switch (userEvent.type) {
      case "join_room":
        await roomHandler.checkRoomAndJoin(socket, userEvent.room);
        break;
      case "leave_room":
        await roomHandler.checkRoomAndLeave(socket, userEvent.room);
        break;
      case "send_message":
        messageHandler.sendMessage(
          socket,
          userEvent.room,
          userEvent.message ?? "",
        );
        break;
      case "move_cursor":
        cursorHandler.moveCursor(
          socket,
          userEvent.room,
          userEvent.dx ?? 0,
          userEvent.dy ?? 0,
        );
        break;
    }
  }
}

export default eventRouter;
