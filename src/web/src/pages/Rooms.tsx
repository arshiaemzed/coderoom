import { useAuth } from "../auth/AuthContext";

function Rooms() {
  const { user } = useAuth();

  return (
    <>
      <div>Hello {user?.display_name}</div> <div>Welcome to CodeRoom</div>
    </>
  );
}

export default Rooms;
