import LoginScreen from "./pages/Login";
import { Navigate, Route, Routes } from "react-router";
import Rooms from "./pages/Rooms";
import { useAuth } from "./auth/AuthContext";
import { SessionScreen } from "./pages/Session";
import { useWebSocket } from "./websocket/useWebSocket";

function App() {
  const ws = useWebSocket();

  const auth = useAuth();

  if (ws.status === "connecting") {
    return <p>Connecting to the server</p>;
  }

  if (ws.status === "disconnected") {
    return <p>Failed to reach the server.</p>;
  }

  if (auth.status === "loading") {
    return <p>Authenticating ...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          status === "authenticated" ? (
            <Navigate to="/rooms" replace />
          ) : (
            <LoginScreen />
          )
        }
      />

      <Route
        path="/rooms/:roomId"
        element={
          status === "unauthenticated" ? (
            <Navigate to="/login" replace />
          ) : (
            <SessionScreen />
          )
        }
      ></Route>

      <Route
        path="/rooms"
        element={
          status === "unauthenticated" ? (
            <Navigate to="/login" replace />
          ) : (
            <Rooms />
          )
        }
      />
    </Routes>
  );
}

export default App;
