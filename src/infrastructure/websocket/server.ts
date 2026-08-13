import { WebSocketServer, WebSocket } from "ws";
import {
  type AuthEvent,
  type Client,
  type Event,
  type Room,
} from "./websocket.types.js";
import authRepository from "../../modules/auth/auth.repository.js";
import crypto from "crypto";
import roomsRepository from "../../modules/rooms/rooms.repository.js";
import type { DatabaseRoom } from "../../modules/rooms/rooms.type.js";

const server = new WebSocketServer({ port: 3002 });

let clients = new Map<WebSocket, Client>();
let rooms: Array<Room> = [];

server.on("connection", (socket: WebSocket) => {
  console.log("Client connected");

  socket.send(
    JSON.stringify({ type: "message", message: "Hello welcome to coderoom" }),
  );

  socket.on("message", async (data) => {
    try {
      const event = JSON.parse(data.toString());

      // Authentication Events
      if (event.type === "login" && event.token) {
        await auth(socket, event.token);
      }

      // Normal events
      if (clients.get(socket) && event.type !== "login" && !event.token) {
        const userEvent: Event = event;

        switch (userEvent.type) {
          case "join_room":
            await checkRoomAndJoin(socket, userEvent.room);
            break;
          case "leave_room":
            await checkRoomAndLeave(socket, userEvent.room);
            break;
          case "send_message":
            sendMessage(socket, userEvent.room, userEvent.message || "");
            break;
        }
      }
    } catch (error) {
      throw error;
    }
  });

  socket.on("close", () => {
    const room = rooms.find((e) => e.members.get(socket));

    console.log("Client disconnected");
    clients.delete(socket);
    room?.members.delete(socket);
  });
});

function sendMessage(client: WebSocket, roomId: string, message: string) {
  if (!clients.get(client)) {
    client.send(
      JSON.stringify({ type: "message", message: "You are not authenticated" }),
    );
    // client.close();
    return;
  }

  if (!isMemberOfRoom(client, roomId)) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "You are not authorized to send message in this room.",
      }),
    );
    return;
  }

  const room = rooms.find((e) => e.id === roomId);
  const user = room?.members.get(client);

  room!.members.forEach((e, k) => {
    k.send(JSON.stringify({ type: "message", message: message }));
  });
}

async function auth(client: WebSocket, token: string) {
  if (clients.get(client)) {
    client.send(
      JSON.stringify({
        type: "message",
        message: "This session credential is already begin used.",
      }),
    );
    client.close();
    return;
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const valid = await authRepository.findSessionByTokenHash(tokenHash);

  if (!valid) {
    client.send(JSON.stringify({ type: "message", message: "Invalid token." }));
    client.close();
    return;
  }

  clients.set(client, { userId: valid.userId });
  client.send(JSON.stringify({ type: "login_success", userId: valid.userId }));
}

function isMemberOfRoom(client: WebSocket, roomId: string): boolean {
  const room: Room | undefined = rooms.find((e) => e.id === roomId);

  const find = room?.members.has(client) ? true : false;

  return find;
}

async function checkRoomAndJoin(client: WebSocket, roomId: string) {
  if (!clients.get(client)) {
    client.send(
      JSON.stringify({ type: "message", message: "You are not authenticated" }),
    );
    // client.close();
    return;
  }

  const room: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!room) {
    client.send("Room does not exists.");
    return;
  }

  const localRoom: Room | undefined = rooms.find((e) => e.id === room.id);

  const user = clients.get(client);

  if (!localRoom) {
    const newRoom = {
      id: room.id,
      members: new Map<WebSocket, Client>(),
      owner: room.userId,
    };

    rooms.push(newRoom);

    if (isMemberOfRoom(client, roomId)) {
      client.send("You are already joined in this room");
      return;
    }

    // at this point user.userId is not null because we checked user authentication at the beginning
    newRoom.members.set(client, { userId: user!.userId });
    client.send("You joined the room.");
    return;
  }

  if (isMemberOfRoom(client, roomId)) {
    client.send("You are already joined in this room");
    return;
  }

  // at this point user.userId is not null because we checked user authentication at the beginning
  localRoom.members.set(client, { userId: user?.userId! });
}

async function checkRoomAndLeave(client: WebSocket, roomId: string) {
  if (!clients.get(client)) {
    client.send("You are not authenticated");
    // client.close();
    return;
  }

  const room: DatabaseRoom | undefined =
    await roomsRepository.doesRoomExists(roomId);

  if (!room) {
    client.send("Room does not exists.");
    return;
  }

  const localRoom: Room | undefined = rooms.find((e) => e.id === room.id);

  if (!localRoom) {
    client.send("The room that you are trying to leave is not active.");
    return;
  }

  if (!isMemberOfRoom(client, roomId)) {
    client.send("You are not joined in the room.");
    return;
  }

  localRoom.members.delete(client);
  client.send("You leaved the room.");
}

export default server;
