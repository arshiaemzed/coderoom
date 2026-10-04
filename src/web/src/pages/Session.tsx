import { useParams } from "react-router";
import { useWebSocket } from "../websocket/useWebSocket";
import { useEffect, useState } from "react";

type RoomStatus = "joined" | "joining" | "error" | "connecting";

export function SessionScreen() {
  const params = useParams();

  const roomId = params.roomId;

  const ws = useWebSocket();

  const [roomStatus, setRoomStatus] = useState<RoomStatus>("joining");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoomStatus("error");
      return;
    }

    if (ws.status !== "connected") {
      setRoomStatus("connecting");
      return;
    }

    async function verifyAndJoin() {
      try {
        setRoomStatus("joining");

        await ws.joinRoom(roomId);

        setRoomStatus("joined");
      } catch (err: any) {
        const errorFormat = {
          success: false,
          error: {
            code: err.code || "INTERNAL_WEBSOCKET_ERROR",
            message: err.message || String(err),
          },
        };

        setRoomStatus("error");

        setErrorMessage(errorFormat.error.message);
      }
    }

    verifyAndJoin();
  }, [roomId, ws.status]);

  if (roomStatus === "connecting") {
    return <div>Connecting to the server ...</div>;
  }

  if (roomStatus === "joining") {
    return <div>Joining room ...</div>;
  }

  if (roomStatus === "joined") {
    return <div>Room: {roomId}</div>;
  }

  if (roomStatus === "error" && errorMessage != null) {
    return <div>{errorMessage}</div>;
  }
}
