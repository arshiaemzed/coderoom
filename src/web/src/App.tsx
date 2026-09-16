import LoginScreen from "./pages/Login";
import { Route, Routes } from "react-router";
import Rooms from "./pages/Rooms";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginScreen setIsAuthenticated={setIsAuthenticated} />}
      />

      <Route
        path="/rooms"
        element={
          isAuthenticated ? (
            <Rooms />
          ) : (
            <LoginScreen setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
    </Routes>
  );
}

export default App;
