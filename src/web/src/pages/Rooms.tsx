import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";

function Rooms() {
  const { user } = useAuth();

  const { rooms } = useRoom();

  return (
    <>
      <div>Hello {user?.display_name}</div> <div>Welcome to CodeRoom</div>
    </>
  );
}

export default Rooms;
