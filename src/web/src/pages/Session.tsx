import { useParams } from "react-router";

export function SessionScreen() {
  const params = useParams();

  return (
    <div>
      <p>Room {params.roomId}</p>
    </div>
  );
}
