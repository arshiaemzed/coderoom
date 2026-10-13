import LoginScreen from "./pages/Login";
import { Navigate, Route, Routes } from "react-router";
import Rooms from "./pages/Rooms";
import { useAuth } from "./auth/AuthContext";
import { SessionScreen } from "./pages/Session";

function App() {
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          auth.status === "authenticated" ? (
            <Navigate to="/rooms" replace />
          ) : (
            <LoginScreen />
          )
        }
      />

      <Route
        path="/rooms/:roomId"
        element={
          auth.status === "unauthenticated" ? (
            <Navigate to="/login" replace />
          ) : (
            <SessionScreen />
          )
        }
      ></Route>

      <Route
        path="/rooms"
        element={
          auth.status === "unauthenticated" ? (
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
