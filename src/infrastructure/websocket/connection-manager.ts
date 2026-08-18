import { type Client } from "./websocket.types.js";
import { type WebSocket } from "ws";

let clients = new Map<WebSocket, Client>();

function add(socket: WebSocket, user: Client): void {
  clients.set(socket, user);
}

function remove(socket: WebSocket): void {
  clients.delete(socket);
}

function get(socket: WebSocket): Client | undefined {
  const user = clients.get(socket);

  return user;
}

function getAll(): Map<WebSocket, Client> {
  return clients;
}

export default {
  add,
  remove,
  get,
  getAll,
};

// async function onMessage(socket: WebSocket, data) {
//   try {
//     const event = JSON.parse(data.toString());

//     // Authentication Events
//     if (event.type === "login" && event.token) {
//       await auth(socket, event.token);
//     }

//     // Normal events
//     if (clients.get(socket) && event.type !== "login" && !event.token) {
//       const userEvent: Event = event;

//       switch (userEvent.type) {
//         case "join_room":
//           await checkRoomAndJoin(socket, userEvent.room);
//           break;
//         case "leave_room":
//           await checkRoomAndLeave(socket, userEvent.room);
//           break;
//         case "send_message":
//           sendMessage(socket, userEvent.room, userEvent.message ?? "");
//           break;
//         case "move_cursor":
//           moveCursor(
//             socket,
//             userEvent.room,
//             userEvent.dx ?? 0,
//             userEvent.dy ?? 0,
//           );
//           break;
//       }
//     }
//   } catch (error) {
//     throw error;
//   }
// }
