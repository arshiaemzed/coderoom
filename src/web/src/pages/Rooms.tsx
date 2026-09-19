import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";
import { FaCode } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

type CodeRoom = {
  roomName: string;
  ownerName: string;
  createdAt: Date;
};

function Rooms() {
  return (
    <div className="rooms-page">
      <Header />

      <main className="rooms-main">
        <Heading />
        <SearchBar />
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

function SearchBar() {
  return (
    <div className="searchbar-div">
      <input className="searchbar-input" placeholder="Enter room name"></input>
    </div>
  );
}

function Heading() {
  const rooms = useRoom();

  return (
    <div className="room-heading">
      <div>
        <h1 className="room-heading-rooms-p">Rooms</h1>
        <p className="room-heading-workspace-p">{rooms.length} Workspace</p>
      </div>

      <div>
        <button>
          <div>New Room</div>
        </button>
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
          <Room
            key={e.id}
            ownerName={e.ownerName}
            roomName={e.name}
            createdAt={e.createdAt}
          />
        ))
      )}
    </div>
  );
}

function Room({ roomName, ownerName, createdAt }: CodeRoom) {
  const date = new Date(createdAt);

  return (
    <div className="room-div">
      <div className="room-icons-div">
        <FaCode />
        <FaArrowRight />
      </div>

      <div>
        <div className="room-name-div">{roomName}</div>

        <div className="room-owner-div">Owner: {ownerName}</div>
      </div>

      <div className="create-at-div">
        Created At {translateMonth(date.getMonth())} {date.getDate()}
      </div>
    </div>
  );
}

function translateMonth(monthNumber: number): string {
  switch (monthNumber) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "March";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";

    default:
      return "Invalid";
  }
}

export default Rooms;
