import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";

type CodeRoom = {
  roomName: string;
  ownerName: string;
};

function Rooms() {
  return (
    <div className="rooms-page">
      <Header />

      <main className="rooms-main">
        <Heading />
        <RoomGrid />
      </main>
    </div>
  );
}

function Header() {
  const { user } = useAuth();

  return (
    <header className="room-header">
      <div className="room-header-content">
        <div className="room-header-title-div">
          <p className="room-header-title-p">CodeRoom</p>
        </div>
        <div className="room-header-displayname-and-logout-btn">
          <div className="room-header-displayname-div">
            <p className="room-header-displayname-p">{user?.display_name}</p>
          </div>
          <div className="room-header-logout-div">
            <button className="room-header-logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Heading() {
  return (
    <div className="room-heading">
      <div>
        <p>Your rooms</p>
      </div>

      <div>
        <button>Create new room</button>
      </div>
    </div>
  );
}

function RoomGrid() {
  const rooms = useRoom();

  return (
    <div className="room-grid">
      {rooms.length === 0 ? (
        <div>No rooms available</div>
      ) : (
        rooms.map((e) => (
          <Room key={e.id} ownerName={e.ownerName} roomName={e.name} />
        ))
      )}
    </div>
  );
}

function Room({ roomName, ownerName }: CodeRoom) {
  return (
    <div className="room-div">
      <div className="room-name-div">
        <p>{roomName}</p>
      </div>

      <div className="room-owner-div">
        <p>Owner: {ownerName}</p>
      </div>

      <div className="room-join-btn-div">
        <button className="room-join-btn">Open Room</button>
      </div>
    </div>
  );
}

export default Rooms;
