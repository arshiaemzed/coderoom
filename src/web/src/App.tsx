import LoginScreen from "./pages/Login";
import { Navigate, Route, Routes } from "react-router";
import Rooms from "./pages/Rooms";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { status } = useAuth();

  if (status === "loading") {
    return <p>Loading ...</p>;
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
