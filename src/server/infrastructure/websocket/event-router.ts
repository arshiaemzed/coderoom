import { WebSocket } from "ws";
import authHandler from "./handlers/auth.handler.js";
import connectionManager from "./connection-manager.js";
import roomHandler from "./handlers/room.handler.js";
import { type AuthEvent, type Event } from "./websocket.types.js";
import messageHandler from "./handlers/message.handler.js";
import cursorHandler from "./handlers/cursor.handler.js";
import fileHandler from "./handlers/file.handler.js";

async function eventRouter(socket: WebSocket, data: any) {
  let clientMessage: any;

  try {
    clientMessage = JSON.parse(data.toString());
  } catch (error) {
    socket.send(
      JSON.stringify({
        type: "error",
        error: {
          code: "MALFORMED_JSON",
          message: "Message must contain valid JSON",
        },
      }),
    );
  }

  const userEvent: Event = clientMessage;

  const authEvent: AuthEvent = clientMessage;

  try {
    // Authentication Events
    if (
      clientMessage.type === "request" &&
      clientMessage.event === "login" &&
      clientMessage.data.token
    ) {
      await authHandler.auth(socket, authEvent.data.token, authEvent.requestId);
    }

    // Normal Room events
    if (
      connectionManager.get(socket) &&
      clientMessage.type === "request" &&
      clientMessage.event !== "login"
    ) {
      switch (userEvent.event) {
        case "join_room":
          await roomHandler.checkRoomAndJoin(
            socket,
            userEvent.data.room,
            userEvent.requestId,
          );

          await fileHandler.loadFiles(
            socket,
            userEvent.requestId,
            userEvent.data.room,
          );

          break;
        case "leave_room":
          await roomHandler.checkRoomAndLeave(
            socket,
            userEvent.data.room,
            userEvent.requestId,
          );
          break;
        case "yjs_update":
          if (!userEvent.data.update) {
            break;
          }

          await fileHandler.updateDoc(
            socket,
            userEvent.requestId,
            userEvent.data.room,
            userEvent.data.update,
          );
          break;
        case "send_message":
          if (!userEvent.data.message) {
            break;
          }

          messageHandler.sendMessage(
            socket,
            userEvent.data.room,
            userEvent.data.message,
          );
          break;
        case "move_cursor":
          if (!userEvent.data.dx || !userEvent.data.dy) {
            break;
          }

          cursorHandler.moveCursor(
            socket,
            userEvent.data.room,
            userEvent.data.dx,
            userEvent.data.dy,
          );
          break;
      }
    }
  } catch (err: any) {
    const errorFormat = {
      type: "error",
      requestId: userEvent.requestId,
      success: false,
      error: {
        code: err.code || "INTERNAL_WEBSOCKET_ERROR",
        message: err.message || String(err),
      },
    };

    socket.send(JSON.stringify(errorFormat));
  }
}

export default eventRouter;
